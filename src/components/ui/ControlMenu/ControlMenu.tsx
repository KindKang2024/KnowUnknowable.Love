import {useCameraContext} from '../../../contexts/CameraContext';
import CameraHomeButton from "./CameraHomeButton";
import InfoButton from "./InfoButton";
import ExitViewButon from "./ExitViewButon";

const ControlMenu = () => {
    const { cameraState } = useCameraContext();
    // const controls = useAnimation();

    // useEffect(() => {
    //     if (cameraState === 'FREE') {
    //         controls.start('visible');
    //     }
    // }, [cameraState, controls]);

    const menuVariants = {
        hidden: { y: '-140%', opacity: 1 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div
            className="
            absolute top-5 left-5
            p-2
            border-2
            border-secondary-100
            rounded-xl
            bg-black
          ">
            <div className="flex gap-x-2">
                <ExitViewButon />
                <CameraHomeButton />
                <InfoButton />
            </div>
        </div>
    );
}

export default ControlMenu;
