'use client'

import React, { useState, useEffect } from 'react'
import { CalendarDays, Check, X, Flame } from 'lucide-react'
import { useStatsRefresh } from '@/contexts/StatsContext'

interface PlayerStats {
  id: string;
  name: string;
  completed: number;
  completedTotal: number;
  skipped: number;
  skippedTotal: number;
  lastProblem: string | null;
  lastProblemLink: string | null;
  currentStreak: number;
  completedTodayLocal: boolean;
}

interface ChallengeStatsData {
  users: PlayerStats[];
}


export const Stats = () => {
  const [challengeStats, setChallengeStats] = useState<ChallengeStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshKey } = useStatsRefresh();

  // Define the challenge start date (PST/PDT)
  const challengeStartDatePST = new Date(2025, 5 - 1, 14); // Month is 0-indexed, so 5 - 1 = April for May. Corrected to 5-1 for May.

  // Function to get current date in PST/PDT as a Date object (start of day)
  const getCurrentPSTDateObject = () => {
    // Get current date/time string in PST/PDT
    const nowPSTString = new Date().toLocaleString("en-US", { timeZone: "America/Los_Angeles" });
    // Parse that string back into a Date object. This object's "time" will be PST/PDT,
    // but its internal representation might still be based on system's UTC offset.
    // For day difference, we primarily care about the date components.
    const nowPSTDate = new Date(nowPSTString);
    // Normalize to start of the day in PST to avoid time-of-day issues in calculation
    return new Date(nowPSTDate.getFullYear(), nowPSTDate.getMonth(), nowPSTDate.getDate());
  };
  
  const todayPST = getCurrentPSTDateObject();
  
  // Calculate days since challenge start
  // Ensure challengeStartDatePST is also treated as start of day for fair comparison
  const startDateNormalized = new Date(challengeStartDatePST.getFullYear(), challengeStartDatePST.getMonth(), challengeStartDatePST.getDate());
  
  const timeDifference = todayPST.getTime() - startDateNormalized.getTime();
  // Add 1 because if today is the start date, it's day 1
  const daysSinceChallengeStart = Math.floor(timeDifference / (1000 * 3600 * 24)) + 1;

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/stats');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: ChallengeStatsData = await response.json();
        setChallengeStats(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch stats');
        setChallengeStats(null); // Optionally clear data or use mockStats as fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [refreshKey]);

  if (isLoading) {
    return <div className="mx-auto space-y-4 text-center"><p>Loading stats...</p></div>;
  }

  if (error) {
    return <div className="mx-auto space-y-4 text-center text-red-500"><p>Error loading stats: {error}</p></div>;
  }

  if (!challengeStats || !challengeStats.users || challengeStats.users.length === 0) {
    return <div className="mx-auto space-y-4 text-center"><p>No stats data available.</p></div>;
  }

  const totalProblemsCompleted = challengeStats.users.reduce((sum, user) => sum + user.completedTotal, 0);
  const totalSkipsUsed = challengeStats.users.reduce((sum, user) => sum + user.skippedTotal, 0);

  return (
    <div className="mx-auto space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Days Left Card */}
        <div className="rounded-lg border border-gray-300">
          <div className="pb-2 py-4 px-6">
            <h3 className="text-md font-medium">Challenge Duration</h3>
          </div>
          <div className="py-4 px-6 pt-0">
            <div className="text-2xl text-green-600 font-bold">
              {daysSinceChallengeStart < 1 ? 1 : daysSinceChallengeStart}
              <span className="text-sm font-normal text-gray-500 ml-1">
                {daysSinceChallengeStart === 1 ? "day" : "days"}
              </span>
            </div>
          </div>
        </div>

        {/* Prize Pool Card */}
        <div className="rounded-lg border border-gray-300 bg-card">
          <div className="pb-2 py-4 px-6">
            <h3 className="text-md font-medium text-gray-800">Prize Pool</h3>
          </div>
          <div className="py-4 px-6 pt-0">
            <div className="text-2xl font-bold text-green-600"><span className="text-gray-400 text-lg">$</span>50</div>
          </div>
        </div>

        {/* Problems Completed Card */}
        <div className="rounded-lg border border-gray-300 bg-card">
          <div className="pb-2 py-4 px-6">
            <h3 className="text-md font-medium text-gray-800">Problems Completed</h3>
          </div>
          <div className="py-4 px-6 pt-0">
            <div className="text-2xl font-bold text-green-600">{totalProblemsCompleted} <span className="text-sm font-normal text-gray-500">problems completed</span></div>
          </div>
        </div>

        {/* Skips Used Card */}
        <div className="rounded-lg border border-gray-300 bg-card">
          <div className="pb-2 py-4 px-6">
            <h3 className="text-md font-medium text-gray-800">Skips Used</h3>
          </div>
          <div className="py-4 px-6 pt-0">
            <div className="text-2xl font-bold text-green-600">{totalSkipsUsed} <span className="text-sm font-normal text-gray-500">skips used</span></div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full">
        {challengeStats.users.map((user) => (
          <div key={user.id} className="rounded-lg border border-gray-300 bg-card w-full">
            <div className="p-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{user.name}'s Progress</h3>
                  <p className="text-sm text-muted-foreground">{user.completed} problems completed this month</p>
                </div>
                <div className={`flex items-center gap-1 text-xs h-7 rounded-full px-2 py-1 border-2 ${
                  user.currentStreak > 0 ? 'text-gray-700 bg-orange-100 border-orange-300' : 'text-gray-700 bg-gray-100 border-gray-300'
                }`}>
                  <Flame className={`h-4 w-4 ${user.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} /> 
                  <span>
                    {user.currentStreak} day streak
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {user.completedTodayLocal ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 border-2 border-emerald-300">
                      <Check className="h-5 w-5 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 border-2 border-red-300">
                      <X className="h-5 w-5 text-red-500" />
                    </div>
                  )}
                  <div>
                    <div className="text-sm font-medium">Last Problem</div>
                    <div className="text-xs text-muted-foreground">
                      {user.lastProblem ? (
                        user.lastProblemLink ? (
                          <a 
                            href={user.lastProblemLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:text-green-600 hover:underline"
                          >
                            {user.lastProblem}
                          </a>
                        ) : (
                          user.lastProblem
                        )
                      ) : (
                        'N/A'
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-1">Skips Used</div>
                  <div className="flex justify-center space-x-1.5">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                          i < user.skipped
                            ? 'bg-red-100 text-red-400 border-2 border-red-300'
                            : 'bg-gray-100 border-gray-300 border-2'
                        }`}
                      >
                        {i < user.skipped && <X className="w-3 h-3" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

