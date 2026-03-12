import { createContext, useContext, useState, ReactNode } from 'react';

interface RobotModeContextType {
  isRobotMode: boolean;
  toggleRobotMode: () => void;
}

const RobotModeContext = createContext<RobotModeContextType | undefined>(undefined);

export const RobotModeProvider = ({ children }: { children: ReactNode }) => {
  const [isRobotMode, setIsRobotMode] = useState(false);

  const toggleRobotMode = () => {
    setIsRobotMode((prev) => !prev);
  };

  return (
    <RobotModeContext.Provider value={{ isRobotMode, toggleRobotMode }}>
      {children}
    </RobotModeContext.Provider>
  );
};

export const useRobotMode = () => {
  const context = useContext(RobotModeContext);
  if (context === undefined) {
    throw new Error('useRobotMode must be used within a RobotModeProvider');
  }
  return context;
};
