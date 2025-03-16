import React from 'react';
import {YAO} from './YAO';
import styled from 'styled-components';

interface YaoDivisionVisualizationProps {
    yao: YAO;
    size?: 'small' | 'medium' | 'large';
}

// Styled components for the visualization
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const CircleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

interface CircleProps {
    size: number;
}

const Circle = styled.div<CircleProps>`
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

interface HalfCircleProps {
    isYin: boolean;
    percentage: number;
}

const HalfCircle = styled.div<HalfCircleProps>`
  position: absolute;
  width: ${props => props.percentage}%;
  height: 100%;
  ${props => props.isYin ? 'left: 0;' : 'right: 0;'}
  background-color: ${props => props.isYin ? '#3498db' : '#e74c3c'};
  display: flex;
  justify-content: ${props => props.isYin ? 'flex-start' : 'flex-end'};
  align-items: center;
  padding: 0 10px;
`;

const Dot = styled.div<{ color: string; size: number }>`
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const DotsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 5px;
`;

const HumanDot = styled(Dot)`
  border: 2px solid white;
`;

const CenterValue = styled.div`
  position: absolute;
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const RoundLabel = styled.div`
  font-weight: bold;
  font-size: 16px;
  color: #333;
`;

/**
 * Component to visualize the YAO division process with three circles
 * representing the three rounds of division.
 */
const YaoDivisionVisualization: React.FC<YaoDivisionVisualizationProps> = ({ yao, size = 'medium' }) => {
    // Get data from the YAO
    const yinCounts = yao.getYinCounts();
    const yangCounts = yao.getYangCounts();
    const yinLeftCounts = yao.getYinLeftCounts();
    const yangLeftCounts = yao.getYangLeftCounts();
    const undividedCounts = yao.getUndividedCounts();
    const finalUndividedGroupCount = yao.finalUndividedGroupCount();

    // Determine circle sizes based on the size prop
    const circleSizes = {
        small: { large: 120, medium: 100, small: 80 },
        medium: { large: 180, medium: 150, small: 120 },
        large: { large: 240, medium: 200, small: 160 },
    }[size];

    // Determine dot sizes based on the size prop
    const dotSizes = {
        small: { regular: 6, human: 8 },
        medium: { regular: 8, human: 10 },
        large: { regular: 10, human: 12 },
    }[size];

    // Create the visualization for each round
    const renderRound = (round: number) => {
        if (round >= yinCounts.length) return null;

        const totalCount = round === 0 ? 49 : undividedCounts[round - 1];
        const yinCount = yinCounts[round];
        const yangCount = yangCounts[round];
        const yinPercentage = (yinCount / totalCount) * 100;
        const yangPercentage = (yangCount / totalCount) * 100;

        const yinLeftCount = yinLeftCounts[round];
        const yangLeftCount = yangLeftCounts[round];

        // Circle size based on round
        const circleSize = round === 0
            ? circleSizes.large
            : round === 1
                ? circleSizes.medium
                : circleSizes.small;

        return (
            <CircleContainer key={round}>
                <RoundLabel>Round {round + 1}</RoundLabel>
                <Circle size={circleSize}>
                    <HalfCircle isYin={true} percentage={yinPercentage}>
                        <DotsContainer>
                            {/* Human dot */}
                            <HumanDot color="#ffd700" size={dotSizes.human} />

                            {/* Yin remainder dots */}
                            {Array.from({ length: yinLeftCount }).map((_, i) => (
                                <Dot key={`yin-${i}`} color="#ffffff" size={dotSizes.regular} />
                            ))}
                        </DotsContainer>
                    </HalfCircle>

                    <HalfCircle isYin={false} percentage={yangPercentage}>
                        <DotsContainer>
                            {/* Yang remainder dots */}
                            {Array.from({ length: yangLeftCount }).map((_, i) => (
                                <Dot key={`yang-${i}`} color="#ffffff" size={dotSizes.regular} />
                            ))}
                        </DotsContainer>
                    </HalfCircle>

                    {round === 2 && (
                        <CenterValue>{Math.round(finalUndividedGroupCount)}</CenterValue>
                    )}
                </Circle>
            </CircleContainer>
        );
    };

    return (
        <Container>
            {renderRound(0)}
            {renderRound(1)}
            {renderRound(2)}
        </Container>
    );
};

export default YaoDivisionVisualization; 