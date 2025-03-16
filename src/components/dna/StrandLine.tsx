import {Line} from '@react-three/drei';

export interface StrandLineProps {
    points: [number, number, number][];
    name: 'yin' | 'yang';
    lineWidth?: number;
    opacity?: number;
}

const StrandLine: React.FC<StrandLineProps> = ({
    points,
    name,
    lineWidth = 1.2,
    opacity = 0.8
}) => {
    const colors = {
        yin: 'red',  // red for Yin
        yang: '#f39c12'  // Orange for Yang
    };

    return (
        <Line
            points={points}
            color={colors[name]}
            lineWidth={lineWidth}
            transparent
            opacity={opacity}
        />
    );
};

export default StrandLine; 