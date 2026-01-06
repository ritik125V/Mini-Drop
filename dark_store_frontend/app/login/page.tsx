'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { navigate } from 'next/dist/client/components/segment-cache/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState(" ");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResponse(null);

    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_ONE_BASE+"/warehouse/store-operator/login" ||
        'http://localhost:5000/api/v1/warehouse/store-operator/login',
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );

     if (res.data.success) { 
        console.log(res.data);
        
        localStorage.setItem('store-operator-data', JSON.stringify({
            ...res.data.profile,
        }));
        router.push('/dashboard');
        
      }     

      // Optional: if response contains a token, you may store it and redirect
      // if (res.data?.token) { localStorage.setItem('token', res.data.token); router.push('/'); }
    } catch (err: any) {
      if (err.response?.data?.message) setError(err.response.data.message);
      else setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 20 }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 420, border: '1px solid #eaeaea', padding: 24, borderRadius: 8 }}>
        <h1 style={{ marginBottom: 12 }}>Login</h1>

        <label style={{ display: 'block', marginBottom: 8 }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          style={{ width: '100%', padding: 8, marginBottom: 12, borderRadius: 4, border: '1px solid #ccc' }}
        />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, borderRadius: 4, background: '#111', color: '#fff', border: 'none' }}>
          {loading ? 'Sending...' : 'Login'}
        </button>

        {error && <p style={{ color: 'red', marginTop: 12 }}>{error}</p>}

        {response && (
          <div style={{ marginTop: 16, padding: 12, background: '#f6f6f6', borderRadius: 4 }}>
            <strong>Response:</strong>
            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 8 }}>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </form>
    </div>
  );
}
