// CameraContext.tsx
import React, {createContext, ReactNode, useContext, useState} from 'react';

type CameraState = 'FREE' | 'INTRO_ANIMATION' | 'DETAIL_VIEW' | 'ZOOMING_IN' | 'MOVING_TO_HOME' | 'FLY_BY';

interface CameraContextType {
  cameraState: CameraState;
  setCameraState: (state: CameraState) => void;
}

const CameraContext = createContext<CameraContextType | null>(null);

interface CameraProviderProps {
  children: ReactNode;
}

export const CameraProvider: React.FC<CameraProviderProps> = ({ children }) => {
  const [cameraState, setCameraState] = useState<CameraState>('INTRO_ANIMATION');

  return (
    <CameraContext.Provider value={{ cameraState, setCameraState }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCameraContext must be used within a CameraProvider');
  }
  return context;
};
