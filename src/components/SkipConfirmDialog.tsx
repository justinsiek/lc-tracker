"use client"

import React from 'react'
import { AlertTriangle } from 'lucide-react'

interface SkipConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SkipConfirmDialog({ isOpen, onClose, onConfirm }: SkipConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 w-full max-w-md p-6">
        <div className="flex items-center justify-center mb-4 text-yellow-500">
          <AlertTriangle size={48} />
        </div>
        <h2 className="text-xl font-semibold mb-2 text-center">Use Skip</h2>
        
        <p className="text-gray-700 mb-6 text-center">
          Are you sure you want to use a skip? This will count against your monthly skip limit.
        </p>
        
        <div className="flex justify-center space-x-4">
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Confirm Skip
          </button>
        </div>
      </div>
    </div>
  );
} 