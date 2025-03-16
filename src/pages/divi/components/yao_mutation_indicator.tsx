import {animated, config, useSpring} from "@react-spring/web";
import {Circle, X} from "lucide-react";

interface MutableIndicatorProps {
    isYin: boolean;
    index: number;
}
const AnimateCircle = animated(Circle);
const AnimateX = animated(X);

export const MutableIndicator = ({ isYin, index }: MutableIndicatorProps) => {

    const iconAnimationProps = useSpring({
        from: { opacity: 0, transform: 'scale(0)', translateY: '-100%' },
        to: { opacity: 1, transform: 'scale(1)', translateY: '0%' },
        delay: 100 + index * 150, // Increased delay to appear after YaoLine (which uses 10 + index * 150)
        config: config.wobbly
    });

    return (
        <div>
            {isYin ? (
                <AnimateCircle style={iconAnimationProps} className="h-4 w-4" />
            ) : (
                <AnimateX style={iconAnimationProps} className="h-4 w-4" />
            )}
        </div>
    );
};
