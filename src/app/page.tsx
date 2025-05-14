import React from 'react'
import { Navbar } from '@/components/NavBar'
import { Stats } from '@/components/Stats'
const page = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-20">
        <Stats />
      </main>
    </div>
  )
}

export default page