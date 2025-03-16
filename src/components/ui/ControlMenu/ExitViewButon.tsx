// ExitViewButton.tsx
// import { useSelectedPlanet } from '../../../contexts/SelectedPlanetContext';
// import { useSpeedControl } from '../../../contexts/SpeedControlContext';
// import { useCameraContext } from '../../../contexts/CameraContext';

import {Button} from '../button';

const ExitViewButton: React.FC = () => {
  // const [selectedPlanet, setSelectedPlanet] = useSelectedPlanet();
  // const { restoreSpeedFactor } = useSpeedControl();
  // const { setCameraState } = useCameraContext();

  const handleExitDetailMode = () => {
    // setSelectedPlanet(null);
    // restoreSpeedFactor();
    // setCameraState('MOVING_TO_HOME');
    console.log("Exit")
  };

  // if (!selectedPlanet) return null;

  return (
    <Button color='danger' onClick={handleExitDetailMode}>
      &nbsp;Exit&nbsp;
    </Button>
  );
};

export default ExitViewButton;
