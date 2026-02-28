"use client";

import axios from "axios";
import { useState, useRef, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const BASE_URL =
  "https://styra-service-backend.onrender.com/web-config/api/v1.0/web-config";

export default function MultiKeyLoadTester() {
  const [apiKeys, setApiKeys] = useState([""]);
  const [duration, setDuration] = useState(60);
  const [concurrency, setConcurrency] = useState(1);

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [resultsReady, setResultsReady] = useState(false);

  const resultsRef = useRef([]);
  const perKeyRef = useRef({});
  const runningRef = useRef(false);

  function updateKey(index, value) {
    const copy = [...apiKeys];
    copy[index] = value;
    setApiKeys(copy);
  }

  function addKeyField() {
    setApiKeys([...apiKeys, ""]);
  }

  async function hitApi(key) {
    const start = performance.now();
    try {
      const res = await axios.get(BASE_URL, {
        params: { query: "variables" },
        headers: { "x-api-key": key },
      });

      const end = performance.now();
      const time = Math.round(end - start);

      resultsRef.current.push(time);

      if (!perKeyRef.current[key])
        perKeyRef.current[key] = { success: 0, fail: 0 };

      perKeyRef.current[key].success++;

      setLogs((prev) => [
        ...prev.slice(-200),
        `[${new Date().toLocaleTimeString()}] KEY:${key.slice(
          0,
          6
        )}... 200 - ${time}ms`,
      ]);

      return time;
    } catch (err) {
      if (!perKeyRef.current[key])
        perKeyRef.current[key] = { success: 0, fail: 0 };

      perKeyRef.current[key].fail++;

      setLogs((prev) => [
        ...prev.slice(-200),
        `[${new Date().toLocaleTimeString()}] KEY:${key.slice(
          0,
          6
        )}... FAILED`,
      ]);

      return null;
    }
  }

  async function worker(key, endTime) {
    while (runningRef.current && Date.now() < endTime) {
      await hitApi(key);
    }
  }

  async function runTest() {
    setIsRunning(true);
    setResultsReady(false);
    setLogs([]);
    resultsRef.current = [];
    perKeyRef.current = {};
    runningRef.current = true;

    const endTime = Date.now() + duration * 1000;

    const workers = [];

    for (let key of apiKeys) {
      if (!key) continue;

      for (let i = 0; i < concurrency; i++) {
        workers.push(worker(key, endTime));
      }
    }

    await Promise.all(workers);

    runningRef.current = false;
    setIsRunning(false);
    finalizeResults();
  }

  function stopTest() {
    runningRef.current = false;
    setIsRunning(false);
  }

  function finalizeResults() {
    const data = resultsRef.current;
    if (!data.length) return;

    const total = data.length;
    const avg = data.reduce((a, b) => a + b, 0) / total;
    const sorted = [...data].sort((a, b) => a - b);
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2] +
            sorted[sorted.length / 2 - 1]) /
          2
        : sorted[Math.floor(sorted.length / 2)];

    const min = Math.min(...data);
    const max = Math.max(...data);
    const rps = (total / duration).toFixed(2);

    setGraphData(
      data.map((d, i) => ({
        request: i + 1,
        duration: d,
      }))
    );

    setResultsReady({
      total,
      avg: avg.toFixed(2),
      median: median.toFixed(2),
      min,
      max,
      rps,
      perKey: perKeyRef.current,
    });
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl mb-6">
        Multi API Key Load Tester
      </h1>

      {!isRunning && (
        <div className="space-y-4 mb-6">
          {apiKeys.map((key, index) => (
            <input
              key={index}
              value={key}
              onChange={(e) =>
                updateKey(index, e.target.value)
              }
              placeholder="Enter API Key"
              className="w-full p-2 bg-neutral-900 border border-neutral-700"
            />
          ))}

          <button
            onClick={addKeyField}
            className="px-3 py-1 bg-neutral-800"
          >
            + Add API Key
          </button>

          <div className="flex gap-4">
            <input
              type="number"
              value={duration}
              onChange={(e) =>
                setDuration(Number(e.target.value))
              }
              placeholder="Duration (sec)"
              className="p-2 bg-neutral-900 border border-neutral-700"
            />

            <input
              type="number"
              value={concurrency}
              onChange={(e) =>
                setConcurrency(Number(e.target.value))
              }
              placeholder="Concurrency per key"
              className="p-2 bg-neutral-900 border border-neutral-700"
            />
          </div>

          <button
            onClick={runTest}
            className="px-4 py-2 bg-green-600"
          >
            Start Test
          </button>
        </div>
      )}

      {isRunning && (
        <div>
          <p>Running test for {duration}s...</p>
          <button
            onClick={stopTest}
            className="px-4 py-2 bg-red-600 mt-2 mb-4"
          >
            Stop
          </button>

          <div className="bg-neutral-900 p-4 h-64 overflow-y-scroll text-xs font-mono">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {resultsReady && (
        <div className="mt-10">
          <h2 className="text-xl mb-4">Final Results</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>Total Requests: {resultsReady.total}</div>
            <div>Avg: {resultsReady.avg} ms</div>
            <div>Median: {resultsReady.median} ms</div>
            <div>Min: {resultsReady.min} ms</div>
            <div>Max: {resultsReady.max} ms</div>
            <div>RPS: {resultsReady.rps}</div>
          </div>

          <h3 className="mb-2">Per Key Breakdown</h3>
          <div className="mb-6">
            {Object.entries(resultsReady.perKey).map(
              ([key, value]) => (
                <div key={key}>
                  {key.slice(0, 8)}... →
                  Success: {value.success} |
                  Fail: {value.fail}
                </div>
              )
            )}
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData}>
                <CartesianGrid stroke="#333" />
                <XAxis dataKey="request" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#4f46e5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}