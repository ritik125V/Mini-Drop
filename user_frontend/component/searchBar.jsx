"use client"

import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ProductCard from './productCard'
import { motion, AnimatePresence } from 'framer-motion' 

export default function SearchBar({ onSelect, fullPage = false } = {} , warehouseId) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  // debounce search
  useEffect(() => {
    if (!query || query.trim().length < 3) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    const id = setTimeout(() => {
      searchProducts(query)
    }, 400)
    return () => clearTimeout(id)
  }, [query])

  async function searchProducts(q) {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_API_ONE_BASE+"/customer/search-query"||
        'http://localhost:5000/api/v1/customer/search-query', {
        params: { 
          query: q,
          warehouseId: warehouseId || "WH_DEL_001"
        }
      })
      console.log("res is :" , res.data.products);
      
      setResults(res.data?.products || [])
    } catch (err) {
      console.error('Search error', err)
      setResults([])
    } finally {
      setLoading(false)
      setOpen(true)
      setSelectedIndex(-1)
    }
  }

  function handleKeyDown(e) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleSelect(results[selectedIndex])
      } else {
        // fallback: perform a full search
        searchProducts(query)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  function handleSelect(product) {
    setQuery(product.name || '')
    setOpen(false)
    if (onSelect) onSelect(product)
    else console.log('Selected product:', product)
  }

  function clear() {
    setQuery('')
    setResults([])
    setOpen(false)
    inputRef.current?.focus()
  }

  function formatPrice(p) {
    if (p === undefined || p === null) return ''
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)
    } catch (e) {
      return String(p)
    }
  }

  function formatDate(iso) {
    if (!iso) return ''
    try { return new Date(iso).toLocaleDateString() } catch { return '' }
  }

  function normalizeProduct(p) {
    return {
      ...p,
      basePrice: p.basePrice ?? p.price ?? p.base_price,
      imageUrl: p.imageUrl ?? p.image ?? p.image_url,
      _id: p._id ?? p.id ?? p.productId,
    }
  }

  function handleAdd(product) {
    // placeholder: integrate with cart API or context
    console.log('Add to cart:', product)
  }

  return (
    <div className={`${fullPage ? 'w-full' : 'max-w-xl'} mx-auto p-4`}>
      <div className="relative">
        <label htmlFor="search" className="sr-only">Search products</label>
        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500">
          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" /></svg>
          <input
            id="search"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products, brands, categories..."
            className="w-full placeholder-gray-400 text-gray-900 bg-transparent outline-none"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls="search-results"
            aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
          />

          {query && (
            <button type="button" aria-label="Clear" onClick={clear} className="text-gray-400 hover:text-gray-600 ml-2">
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 8.586l3.95-3.95a1 1 0 111.414 1.414L11.414 10l3.95 3.95a1 1 0 01-1.414 1.414L10 11.414l-3.95 3.95a1 1 0 01-1.414-1.414L8.586 10 4.636 6.05A1 1 0 116.05 4.636L10 8.586z" clipRule="evenodd" /></svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => searchProducts(query)}
            className="ml-3 inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {loading ? (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
            ) : null}
            Search
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className={`${fullPage ? 'mt-8' : 'absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-40 p-3'}`}
            >
              {results.length === 0 && !loading ? (
                <div className="p-3 text-sm text-gray-500">No results found.</div>
              ) : (
                fullPage ? (
                  <div id="search-results" role="listbox" ref={listRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {results.map((product, idx) => {
                      const p = normalizeProduct(product)
                      return (
                        <div
                          id={`result-${idx}`}
                          key={p._id || p.productId || idx}
                          role="option"
                          aria-selected={selectedIndex === idx}
                          onClick={() => handleSelect(product)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`cursor-pointer " ${selectedIndex === idx ? 'ring-2 ring-indigo-200' : ''}`}
                        >
                          <ProductCard product={p} />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div id="search-results" role="listbox" ref={listRef} className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-auto">
                    {results.map((product, idx) => {
                      const image = product.image || product.imageUrl
                      const price = formatPrice(product.basePrice ?? product.price ?? product.basePrice)
                      const created = formatDate(product.createdAt)

                      return (
                        <motion.div
                          id={`result-${idx}`}
                          key={product._id || product.productId || idx}
                          role="option"
                          aria-selected={selectedIndex === idx}
                          onClick={() => handleSelect(product)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.14 }}
                          className={`relative bg-white rounded-lg border shadow-sm p-3 cursor-pointer hover:shadow-md transition ${selectedIndex === idx ? 'ring-2 ring-indigo-200' : ''}`}
                        >
                          {/* Image */}
                          <div className="w-full h-28 bg-gray-100 rounded-md overflow-hidden mb-2 flex items-center justify-center">
                            {image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-gray-400 text-xl font-medium">{product.name?.slice(0,1) || 'P'}</div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="text-sm text-gray-900 font-semibold truncate">{product.name}</div>
                          <div className="mt-1 text-xs text-gray-500 truncate">{product.brand} • {product.category}</div>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            <div className="text-sm font-bold text-gray-900">{price}</div>
                            <div className="text-xs text-gray-500">{product.unitSize}{product.unitType ? ` ${product.unitType}` : ''}</div>
                          </div>

                          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                            <div className="truncate">ID: {product.productId}</div>
                            <div>{created}</div>
                          </div>

                          {product.tags && product.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {product.tags.slice(0,3).map((t) => (
                                <span key={t} className="text-[10px] bg-gray-100 px-2 py-1 rounded text-gray-600">{t}</span>
                              ))}
                            </div>
                          )}

                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onMouseDown={(e) => {
                                e.stopPropagation()
                                handleAdd(product)
                              }}
                              className="flex-1 bg-green-600 text-white text-sm py-1.5 rounded-md hover:bg-green-500"
                            >
                              Add
                            </button>
                            <button
                              onMouseDown={(e) => {
                                e.stopPropagation()
                                handleSelect(product)
                              }}
                              className="px-2 py-1 text-sm border rounded-md text-gray-700"
                            >
                              View
                            </button>
                          </div>

                          {!product.isActive && (
                            <div className="absolute top-2 right-2 text-xs px-2 py-1 bg-red-50 text-red-700 rounded">Inactive</div>
                          )}
                        </motion.div>
                      )
                    })}
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

