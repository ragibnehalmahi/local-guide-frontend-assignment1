// components/sections/hero-section.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function HeroSection() {
  const router = useRouter()
  const [destination, setDestination] = useState('')

  const handleSearch = () => {
    if (destination.trim()) {
      router.push(`/explore?city=${destination}`)
    } else {
      router.push('/explore')
    }
  }

  return (
    <section className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Find Your Perfect Local Guide
        </h1>
        <p className="text-xl mb-8">
          Discover hidden gems and authentic experiences with passionate locals.
        </p>
        <div className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
          <Input
            type="text"
            placeholder="Where are you going?"
            className="flex-grow text-gray-800"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} className="bg-white text-blue-600 hover:bg-gray-100">
            Search Guides
          </Button>
        </div>
      </div>
    </section>
  )
}