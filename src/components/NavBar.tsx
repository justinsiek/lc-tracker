"use client"

import Link from "next/link"

export function Navbar() {

  return (
    <header
      className="fixed w-full z-50 transition-all duration-300 bg-white border-b border-gray-200"
    >
      <div className="px-10">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold tracking-tighter text-black">leetcode<span className="text-green-600">tracker</span></span>
          </div>
          <div className="flex items-center space-x-2">
            
            <Link
              href="/signup"
              className="text-sm px-4 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg tracking-tight font-semibold"
            >
              Log Problem
            </Link>
            <Link href="/login" className="text-sm text-gray-800 border-2 border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-100 tracking-tight font-semibold">
              Use Skip
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}