"use client"

import React, { useState } from 'react'

interface LogProblemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    userId: string;
    problemName: string;
    problemLink: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }) => void;
}

export function LogProblemDialog({ isOpen, onClose, onSubmit }: LogProblemDialogProps) {
  const [userId, setUserId] = useState<string>("1"); // Default to Noah (user ID 1)
  const [problemName, setProblemName] = useState<string>("");
  const [problemLink, setProblemLink] = useState<string>("");
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      userId,
      problemName,
      problemLink,
      difficulty
    });
    // Reset form
    setProblemName("");
    setProblemLink("");
    setDifficulty('medium');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Log New Problem</h2>
        
        <form onSubmit={handleSubmit}>
          {/* User Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
            <div className="flex">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-l-lg border ${
                  userId === "1" 
                    ? "bg-green-600 text-white border-green-600" 
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setUserId("1")}
              >
                Noah
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-r-lg border ${
                  userId === "2" 
                    ? "bg-green-600 text-white border-green-600" 
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setUserId("2")}
              >
                Justin
              </button>
            </div>
          </div>
          
          {/* Problem Name */}
          <div className="mb-4">
            <label htmlFor="problemName" className="block text-sm font-medium text-gray-700 mb-2">
              Problem Name
            </label>
            <input
              type="text"
              id="problemName"
              value={problemName}
              onChange={(e) => setProblemName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          {/* Problem Link */}
          <div className="mb-4">
            <label htmlFor="problemLink" className="block text-sm font-medium text-gray-700 mb-2">
              Problem Link
            </label>
            <input
              type="url"
              id="problemLink"
              value={problemLink}
              onChange={(e) => setProblemLink(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>
          
          {/* Problem Difficulty */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <div className="flex">
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-l-lg border ${
                  difficulty === "easy" 
                    ? "bg-green-600 text-white border-green-600" 
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDifficulty("easy")}
              >
                Easy
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium border-t border-b ${
                  difficulty === "medium" 
                    ? "bg-green-600 text-white border-green-600" 
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDifficulty("medium")}
              >
                Medium
              </button>
              <button
                type="button"
                className={`flex-1 py-2 text-sm font-medium rounded-r-lg border ${
                  difficulty === "hard" 
                    ? "bg-green-600 text-white border-green-600" 
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setDifficulty("hard")}
              >
                Hard
              </button>
            </div>
          </div>
          
          {/* Footer Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 