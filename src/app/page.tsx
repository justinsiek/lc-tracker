import React from 'react'
import { Navbar } from '@/components/NavBar'
import { Stats } from '@/components/Stats'
import { Calendar } from '@/components/Calendar'
const page = () => {
  return (
    <div>
      <Navbar />
      <main className="container mx-auto px-4 py-8 pt-24">
        <Stats />
        <Calendar />
      </main>
    </div>
  )
}

export default page