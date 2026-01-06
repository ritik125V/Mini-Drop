import React from 'react'
import SearchBar from '@/component/searchBar'
function page() {
  return (
    <div className="min-h-screen bg-white text-white">
      <div className="px-4 py-6">
        <SearchBar fullPage={true} />
      </div>
    </div>
  )
}

export default page