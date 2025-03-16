// CameraHomeButton.tsx
import {Button} from '../button';

const CameraHomeButton = () => {
  // const { cameraState, setCameraState } = useCameraContext();
  // const { restoreSpeedFactor } = useSpeedControl();
  // const [selectedPlanet, setSelectedPlanet] = useSelectedPlanet();

  const moveToHome = () => {
    // setCameraState('MOVING_TO_HOME');
    // if (selectedPlanet) {
    //   setSelectedPlanet(null)
    //   restoreSpeedFactor();
    // }
  };

  // const isButtonDisabled = cameraState === 'INTRO_ANIMATION';

  return (
    <Button
      color='secondary'
      disabled={false}
      onClick={moveToHome}
    >
      {/* Home Button */}
      Divine
    </Button>
  );
};

export default CameraHomeButton;
