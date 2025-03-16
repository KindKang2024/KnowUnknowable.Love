import {useEffect, useRef, useState} from "react";
import {motion, useAnimation, useMotionValue, useSpring, useTransform, useVelocity} from "motion/react";
import "./BottomSheet.css";

export default function BottomSheet({ isClosed, setIsClosed }) {
    const [isOpen, setIsOpen] = useState(false);
    // const [myLatestVelocity, setLatestVelocity] = useState(0);

    const y = useMotionValue(0);
    const ySmooth = useSpring(y, {
        velocity: 10,
        stiffness: 4000,
        damping: 200
        // mass: 1
    });

    const yVelocity = useVelocity(ySmooth);
    const rotationByVelocityLeft = useTransform(
        yVelocity,
        [-1000, 1000],
        [45, -45]
    );
    const rotationByVelocityRight = useTransform(
        yVelocity,
        [-1000, 1000],
        [-45, 45]
    );

    function onClose() {
        setIsOpen(false);
    }

    function onOpen() {
        setIsOpen(true);
    }

    function onToggle() {
        setIsOpen(!isOpen);
    }

    const prevIsOpen = usePrevious(isOpen);
    const controls = useAnimation();

    function onDragEnd(event, info) {
        const shouldClose =
            info.velocity.y > 20 || (info.velocity.y >= 0 && info.point.y > 45);
        if (shouldClose) {
            controls.start("hidden");
            onClose();
        } else {
            controls.start("visible");
            onOpen();
        }
    }

    useEffect(() => {
        if (prevIsOpen && !isOpen) {
            controls.start("hidden");
        } else if (!prevIsOpen && isOpen) {
            controls.start("visible");
        } else if (isClosed) {
            controls.start("closed");
        } else if (!isClosed) {
            controls.start("hidden");
        }
    }, [controls, isOpen, isClosed, prevIsOpen]);

    const handleDoubleClick = (e) => {
        switch (e.detail) {
            case 1:
                // console.log("click");
                break;
            case 2:
                if (!prevIsOpen && isOpen) {
                    controls.start("hidden");
                    setIsOpen(false);
                    // console.log("double click visible");
                } else if (prevIsOpen && !isOpen) {
                    controls.start("visible");
                    setIsOpen(true);
                    // console.log("double click hidden");
                }

                break;

            default:
                return;
        }
    };

    return (
        <motion.div
            drag="y"
            onDragEnd={onDragEnd}
            initial="hidden"
            animate={controls}
            transition={{
                type: "spring",
                damping: 40,
                stiffness: 400
            }}
            variants={{
                visible: { y: "10%" },
                hidden: { y: "80%" },
                closed: { y: "100%" }
            }}
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            className="BottomSheet"
            style={{ y }}
        >
            <div className="DragHandleEdge" onClick={handleDoubleClick}>
                <motion.div
                    animate={controls}
                    className="DragHandle left"
                    style={{
                        rotate: rotationByVelocityLeft
                    }}
                />
                <motion.div
                    animate={controls}
                    className="DragHandle right"
                    style={{
                        rotate: rotationByVelocityRight
                    }}
                />
            </div>
            <div className="Navbar">
                <span className="Title">Bottom sheet</span>
                <div className="ButtonGroup">
                    <span className="ButtonExpandCollapse" onClick={onToggle}>
                        <span className="IconExpandCollapse"> {isOpen ? "􀫞" : "􀧛"}</span>
                        <span className="LabelExpandCollapse">
                            {isOpen ? "Collapse" : "Expand"}
                        </span>
                    </span>
                    <span className="CloseIcon" onClick={() => setIsClosed(true)}>
                        􀁡
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

function usePrevious(value) {
    const previousValueRef = useRef();

    useEffect(() => {
        previousValueRef.current = value;
    }, [value]);

    return previousValueRef.current;
}
