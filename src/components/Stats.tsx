import React from 'react'
import { CalendarDays, Check, X, Flame } from 'lucide-react'

interface PlayerStats {
  id: string;
  name: string;
  completed: number;
  skipped: number;
  lastProblem: string;
  currentStreak: number;
}

interface ChallengeStatsData {
  users: PlayerStats[];
}

// Mock Data
const mockStats: ChallengeStatsData = {
  users: [
    {
      id: "1",
      name: "Noah",
      completed: 17,
      skipped: 1,
      lastProblem: "Reverse Nodes in k-Group",
      currentStreak: 7,
    },
    {
      id: "2",
      name: "Justin",
      completed: 16,
      skipped: 2,
      lastProblem: "Trapping Rain Water",
      currentStreak: 3,
    }
  ]
};

export const Stats = () => {
  const data = mockStats;
  const today = new Date();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  return (
    <div className="mx-auto max-w-7xl space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Days Left Card */}
        <div className="rounded-lg border border-gray-300 bg-card">
          <div className="pb-2 p-6">
            <h3 className="text-sm font-medium">Challenge Duration</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl text-green-600 font-bold">2 <span className="text-sm font-normal text-gray-500">days</span></div>
          </div>
        </div>

        {/* Prize Pool Card */}
        <div className="rounded-lg border border-gray-300 bg-card">
          <div className="pb-2 p-6">
            <h3 className="text-sm font-medium text-gray-800">Prize Pool</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-green-600"><span className="text-gray-500">$</span>50</div>
          </div>
        </div>

        {/* Problems Completed Card */}
        <div className="rounded-lg border border-gray-300 bg-card">
          <div className="pb-2 p-6">
            <h3 className="text-sm font-medium text-gray-800">Problems Completed</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-green-600">{data.users[0].completed} <span className="text-sm font-normal text-gray-500">problems completed</span></div>
          </div>
        </div>

        {/* Skips Used Card */}
        <div className="rounded-lg border border-gray-300 bg-card">
          <div className="pb-2 p-6">
            <h3 className="text-sm font-medium text-gray-800">Skips Used</h3>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-green-600">{data.users[1].skipped} <span className="text-sm font-normal text-gray-500">skips used</span></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {data.users.map((user) => (
          <div key={user.id} className="rounded-lg border border-gray-300 bg-card">
            <div className="p-6">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{user.name}'s Progress</h3>
                  <p className="text-sm text-muted-foreground">{user.completed} problems completed this month</p>
                </div>
                <div className="flex items-center gap-1 text-xs h-7 text-gray-700 rounded-full bg-orange-100 px-2 py-1 border-2 border-orange-300">
                  <Flame className="h-4 w-4 text-orange-500" /> 
                  <span>
                    {user.currentStreak} day streak
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 border-2 border-emerald-300">
                    <Check className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Last Problem</div>
                    <div className="text-xs text-muted-foreground">{user.lastProblem}</div>
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

