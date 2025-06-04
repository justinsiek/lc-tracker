'use client'

import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, CalendarDays, Trophy, Info } from 'lucide-react'
import { useStatsRefresh } from '@/contexts/StatsContext'

// Define problem difficulty types
type ProblemDifficulty = 'easy' | 'medium' | 'hard';

// Define problem data structure
interface Problem {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  date: Date;
  userId: string;
  problemLink: string;
}

// API response type (date is string)
interface ApiProblem {
  id: string;
  title: string;
  difficulty: ProblemDifficulty;
  date: string; // Date from API is a string
  userId: string;
  problemLink: string;
}

// User data (matching Stats component)
const users = [
  { id: "1", name: "Noah", color: "blue" },
  { id: "2", name: "Justin", color: "green" }
];

export const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<Date | null>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);

  const [problemsData, setProblemsData] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshKey } = useStatsRefresh();

  useEffect(() => {
    const fetchCalendarProblems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/calendar-problems');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data: ApiProblem[] = await response.json();
        
        // Convert date strings to Date objects
        const formattedData: Problem[] = data.map(problem => ({
          ...problem,
          date: new Date(problem.date), // Convert string to Date
        }));
        setProblemsData(formattedData);

      } catch (err: any) {
        setError(err.message || 'Failed to fetch calendar problems');
        setProblemsData([]); // Clear data or handle error appropriately
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarProblems();
  }, [refreshKey]);

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get day of week for the first day of the month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  // Get month name
  const getMonthName = (month: number) => {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[month];
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  // Get problems for a specific day
  const getProblemsForDay = (day: number, userId?: string) => {
    if (userId) {
      return problemsData.filter(problem => 
        problem.date.getDate() === day && 
        problem.date.getMonth() === currentMonth && 
        problem.date.getFullYear() === currentYear &&
        problem.userId === userId
      );
    }
    return problemsData.filter(problem => 
      problem.date.getDate() === day && 
      problem.date.getMonth() === currentMonth && 
      problem.date.getFullYear() === currentYear
    );
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: ProblemDifficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 border-green-200';
      case 'medium':
        return 'bg-yellow-100 border-yellow-200';
      case 'hard':
        return 'bg-red-100 border-red-200';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  // Generate calendar grid
  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-gray-200 bg-gray-50"></div>
      );
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isDayToday = isToday(date);
      const isSelected = selectedDay && 
                         selectedDay.getDate() === day && 
                         selectedDay.getMonth() === currentMonth && 
                         selectedDay.getFullYear() === currentYear;
      
      const isHovered = hoveredDay && 
                        hoveredDay.getDate() === day && 
                        hoveredDay.getMonth() === currentMonth && 
                        hoveredDay.getFullYear() === currentYear;

      // Get problems for this day for each user
      const problems = getProblemsForDay(day);
      const hasProblems = problems.length > 0;

      days.push(
        <div 
          key={day} 
          className={`h-24 border border-gray-300 p-1 relative transition-all ${
            isDayToday ? 'bg-green-50' : ''
          } ${
            isSelected ? 'ring-2 ring-green-400' : ''
          } ${
            isHovered ? 'bg-gray-50' : ''
          } ${
            hasProblems ? 'hover:bg-gray-50' : ''
          }`}
          onClick={() => setSelectedDay(date)}
          onMouseEnter={() => hasProblems && setHoveredDay(date)}
          onMouseLeave={() => hasProblems && setHoveredDay(null)}
        >
          <div className={`text-sm font-medium ${isDayToday ? 'text-green-600' : ''}`}>{day}</div>
          
          {/* Problem indicators for each user */}
          <div className="flex flex-wrap gap-1 mt-1">
            {users.map(user => {
              const userProblems = getProblemsForDay(day, user.id);
              if (userProblems.length === 0) return null;
              
              return (
                <div key={user.id} className="flex flex-wrap gap-0.5">
                  {userProblems.map(problem => (
                    <div 
                      key={problem.id}
                      className={`w-4 h-4 rounded-full ${getDifficultyColor(problem.difficulty)} border-2`}
                      title={`${user.name}: ${problem.title} (${problem.difficulty})`}
                    ></div>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Selected/Hovered day details */}
          {(isSelected || isHovered) && hasProblems && (
            <div className="absolute bottom-1 right-1">
              <div className="text-xs text-gray-500">{problems.length} problem{problems.length !== 1 ? 's' : ''}</div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Calculate total problems completed this month
  const calculateMonthlyStats = () => {
    const problemsInCurrentMonth = problemsData.filter(problem => 
      problem.date.getMonth() === currentMonth && 
      problem.date.getFullYear() === currentYear
    );

    return {
      total: problemsInCurrentMonth.length,
      easy: problemsInCurrentMonth.filter(p => p.difficulty === 'easy').length,
      medium: problemsInCurrentMonth.filter(p => p.difficulty === 'medium').length,
      hard: problemsInCurrentMonth.filter(p => p.difficulty === 'hard').length,
      byUser: users.map(user => ({
        name: user.name,
        count: problemsInCurrentMonth.filter(p => p.userId === user.id).length
      }))
    };
  };

  const monthlyStats = calculateMonthlyStats();

  if (isLoading) {
    return <div className="mt-6 rounded-lg border border-gray-300 p-6 text-center"><p>Loading calendar data...</p></div>;
  }

  if (error) {
    return <div className="mt-6 rounded-lg border border-gray-300 p-6 text-center text-red-500"><p>Error loading calendar: {error}</p></div>;
  }

  return (
    <div className="mt-6 rounded-lg border border-gray-300 ">
      <div className="mb-4 p-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-800">Monthly Stats</h2>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <button
              onClick={goToPreviousMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-md font-medium">
              {getMonthName(currentMonth)} {currentYear}
            </span>
            <button
              onClick={goToNextMonth}
              className="p-1 rounded hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-100 border-2 border-green-200 mr-1"></div>
              <span>Easy</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-100 border-2 border-yellow-200 mr-1"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-100 border-2 border-red-200 mr-1"></div>
              <span>Hard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly stats summary */}
      <div className="mb-4 px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-lg border border-gray-300 bg-card">
          <div className="pb-2 p-4">
            <h3 className="text-md font-medium text-gray-800">Total Problems</h3>
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold text-green-600">{monthlyStats.total}</div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-300 bg-card">
          <div className="pb-2 p-4">
            <h3 className="text-md font-medium text-gray-800">Easy</h3>
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold text-green-600">{monthlyStats.easy}</div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-300 bg-card">
          <div className="pb-2 p-4">
            <h3 className="text-md font-medium text-gray-800">Medium</h3>
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold text-green-600">{monthlyStats.medium}</div>
          </div>
        </div>
        
        <div className="rounded-lg border border-gray-300 bg-card">
          <div className="pb-2 p-4">
            <h3 className="text-md font-medium text-gray-800">Hard</h3>
          </div>
          <div className="p-4 pt-0">
            <div className="text-2xl font-bold text-green-600">{monthlyStats.hard}</div>
          </div>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-7 gap-px">
          {/* Calendar header with day names */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center py-1 font-medium text-sm">
              {day}
            </div>
          ))}
          
          {/* Calendar days */}
          {renderCalendarGrid()}
        </div>
      </div>

      {/* Selected day details */}
      {selectedDay && (
        <div className="mt-2 mx-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-300">
          <h3 className="text-md font-medium mb-2 text-gray-800">
            {selectedDay.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h3>
          
          {getProblemsForDay(selectedDay.getDate()).length > 0 ? (
            <div>
              {users.map(user => {
                const userProblems = getProblemsForDay(selectedDay.getDate(), user.id);
                if (userProblems.length === 0) return null;
                
                return (
                  <div key={user.id} className="mb-2">
                    <div className="text-sm font-medium text-gray-800">{user.name}'s Problems:</div>
                    <ul className="text-sm">
                      {userProblems.map(problem => (
                        <li key={problem.id} className="flex items-center mt-1">
                          <div className={`w-3 h-3 rounded-full border-2 ${getDifficultyColor(problem.difficulty)} mr-2`}></div>
                          <a 
                            href={problem.problemLink} 
                            className="hover:text-green-600 hover:underline"
                            target="_blank"
                          >
                            {problem.title}
                          </a>
                          <span className={`ml-1 px-1.5 py-0.5 rounded text-xs border-2 ${
                            problem.difficulty === 'easy' ? 'bg-green-100 text-green-800 border-green-200' :
                            problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            'bg-red-100 text-red-800 border-red-200'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center text-gray-500 text-sm">
              <Info className="w-4 h-4 mr-1" />
              No problems completed on this day
            </div>
          )}
        </div>
      )}
    </div>
  )
}
