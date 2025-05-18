import React from 'react'
import { Navbar } from '@/components/NavBar'
import { Stats } from '@/components/Stats'
import { Calendar } from '@/components/Calendar'
import { StatsProvider } from '@/contexts/StatsContext'

const page = () => {
  return (
    <StatsProvider>
      <div>
        <Navbar />
        <main className="container mx-auto px-4 py-8 pt-24">
          <Stats />
          <Calendar />
        </main>
      </div>
    </StatsProvider>
  )
}

export default page