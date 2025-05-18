"use client"

import React, { useState } from 'react'
import { AlertTriangle } from 'lucide-react'

interface SkipConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string) => void;
}

export function SkipConfirmDialog({ isOpen, onClose, onConfirm }: SkipConfirmDialogProps) {
  const [userId, setUserId] = useState<string>("1"); // Default to Noah (user ID 1)

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-md p-6">
        <div className="flex items-center justify-center mb-4 text-yellow-500">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-center">Use Skip</h2>
        
        <p className="text-gray-700 mb-4 text-center"> 
          Are you sure you want to use a skip? This will count against your monthly skip limit.
        </p>

        {/* User Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 text-center">For which user?</label>
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
        
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className="px-6 py-2 w-full text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 w-full text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            onClick={handleConfirm}
          >
            Confirm Skip
          </button>
        </div>
      </div>
    </div>
  );
} 