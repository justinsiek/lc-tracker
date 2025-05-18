"use client"

import { useState } from "react"
import { LogProblemDialog } from "./LogProblemDialog"
import { SkipConfirmDialog } from "./SkipConfirmDialog"
import { useStatsRefresh } from "@/contexts/StatsContext"

export function Navbar() {
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState(false);
  const { triggerRefresh } = useStatsRefresh();

  const handleLogProblem = () => {
    setIsLogDialogOpen(true);
  };

  const handleUseSkip = () => {
    setIsSkipDialogOpen(true);
  };

  const handleCloseLogDialog = () => {
    setIsLogDialogOpen(false);
  };

  const handleCloseSkipDialog = () => {
    setIsSkipDialogOpen(false);
  };

  const handleSubmitProblem = async (data: {
    userId: string;
    problemName: string;
    problemLink: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }) => {
    try {
      const response = await fetch('/api/log-problem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Problem logged successfully via API:', result);
      triggerRefresh();
      // setIsLogDialogOpen(false); // Already handled in LogProblemDialog's own submit
    } catch (error) {
      console.error('Failed to log problem:', error);
      // Here you could set an error state and display it to the user
    }
  };

  const handleConfirmSkip = async (userId: string) => {
    try {
      const response = await fetch('/api/log-skip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(`Skip confirmed for user ID: ${userId} via API:`, result);
      triggerRefresh();
      // setIsSkipDialogOpen(false); // Already handled in SkipConfirmDialog's own confirm
    } catch (error) {
      console.error(`Failed to log skip for user ID: ${userId}:`, error);
      // Here you could set an error state and display it to the user
    }
  };

  return (
    <header
      className="fixed w-full z-50 transition-all duration-300 bg-white border-b border-gray-200"
    >
      <div className="px-10">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <span className="text-xl font-semibold tracking-tighter text-black">leetcode<span className="text-green-600">tracker</span></span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="text-sm px-4 py-3 bg-green-600 text-white hover:bg-green-700 rounded-lg tracking-tight font-semibold"
              onClick={handleLogProblem}
            >
              Log Problem
            </button>
            <button
              className="text-sm text-gray-800 border-2 border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-100 tracking-tight font-semibold"
              onClick={handleUseSkip}
            >
              Use Skip
            </button>
          </div>
        </div>
      </div>

      <LogProblemDialog 
        isOpen={isLogDialogOpen} 
        onClose={handleCloseLogDialog}
        onSubmit={handleSubmitProblem}
      />

      <SkipConfirmDialog
        isOpen={isSkipDialogOpen}
        onClose={handleCloseSkipDialog}
        onConfirm={handleConfirmSkip}
      />
    </header>
  )
}