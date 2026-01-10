import React from 'react'
import { ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation'

function CartButton () {
    const router = useRouter()
  return (
    <div 
    onClick={() => router.push('/shop/cart')}
    className='fixed hover:scale-103 transition duration-75 z-100 bottom-4 right-3 bg-yellow-400 rounded-full px-6 py-3'>
        <ShoppingBag/>
    </div>
  )
}

export default CartButton