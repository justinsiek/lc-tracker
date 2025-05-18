"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface StatsContextType {
  refreshKey: number;
  triggerRefresh: () => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

export const useStatsRefresh = () => {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStatsRefresh must be used within a StatsProvider');
  }
  return context;
};

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider = ({ children }: StatsProviderProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey(prevKey => prevKey + 1);
  }, []);

  return (
    <StatsContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </StatsContext.Provider>
  );
};