// PlanetMenu.tsx
import React from 'react';
// import { motion, useAnimation } from 'framer-motion';
import {useSpeedControl} from '../../../contexts/SpeedControlContext';
import {useSelectedPlanet} from '../../../contexts/SelectedPlanetContext';
import {useCameraContext} from '../../../contexts/CameraContext';
import {PlanetData} from '../../../../types';
import {Button} from '../button';
import {useFlybyStore} from '@/stores/flybyStore';

interface PlanetMenuProps {
  planets: PlanetData[];
}

const PlanetMenu: React.FC<PlanetMenuProps> = ({ planets }) => {
  const [selectedPlanet, setSelectedPlanet] = useSelectedPlanet();
  const { overrideSpeedFactor } = useSpeedControl();
  const { cameraState, setCameraState } = useCameraContext();
  // const controls = useAnimation();

  // useEffect(() => {
  //   if (cameraState === 'FREE') {
  //     controls.start({ y: 0, opacity: 1 });
  //   }
  // }, [cameraState, controls]);

  const handleSelect = (planetName: string) => {
    const selected = planets.find((planet) => planet.name === planetName);
    setSelectedPlanet(selected ?? null);
    overrideSpeedFactor();
    setCameraState('ZOOMING_IN');
  };

  const { resetFlybyIndex } = useFlybyStore();

  const handleFlyBy = () => {
    setCameraState('FLY_BY');
    resetFlybyIndex();
  };

  const menuVariants = {
    hidden: { y: '170%', opacity: 1 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };


  return (
    <div
      className="fixed top-5 left-5 right-5"
    // variants={menuVariants}
    // initial="hidden"
    // animate={controls}
    >
      <div className='flex flex-wrap gap-2 justify-center'>
        {planets.map((planet) => (
          <>
            <Button
              key={planet.id}
              color='secondary'
              size='sm'
              onClick={() => handleSelect(planet.name)}
              disabled={selectedPlanet?.id === planet.id}
            >
              {planet.name}
            </Button>

            {planet.name === 'Neptune' && (
              <Button color='secondary' size='sm' key='flyby2'
                onClick={() => handleFlyBy()}>
                Fly By
              </Button>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default PlanetMenu;