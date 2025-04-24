import {useCallback, useEffect, useMemo, useReducer, useRef} from 'react'
import {GroupProps, useFrame, useThree} from '@react-three/fiber'
import * as THREE from 'three'
import {MathUtils} from 'three'
import {useUIStore} from '@/stores/uiStore.ts';
import {ParticleCanvasTextureFactory} from '@/components/divination/ParticleCanvasTextureFactory.ts';
import {createInitialPositions, createRandom2DCirclePositions, findCircleIntersection} from '@/lib/divinationUtils.ts';
import {PointEvolveType, PointWillType} from '@/i18n/types.ts';
import {useDivinationStore} from '@/stores/divineStore.ts';
import {getPalette} from '@/utils/colorPalettes.ts';
import FancyLine from './FancyLine.tsx';
import {divi_point_f, divi_point_v, line_f, line_v} from '@/utils/glsl.ts';
import {DiviContext, DividePhase, DiviState, StateMachine} from '@/types/divi.ts';
import DiviGalaxy from '@/pages/divi/diviGalaxy.tsx';
import FireRing from '../FireRing.tsx';
import {Text} from '@react-three/drei';
import {animated, useSpring} from '@react-spring/three';
import {SpeedModeConfig} from '@/types/common.ts';
import {commonIChingBinaryList, commonIChingMap} from '@/i18n/symbols.ts';

const BaseSpeedConstant = 0.01;

interface DaoIsLoveDivisionProps extends GroupProps {
    radius: number;
    color?: string;
    palette?: string;
    count?: number;
    particleSize?: number;
    animation?: boolean;
    speedFactor?: number;
    zIndex: number;
    initialPosition: THREE.Vector3;
    taijiPosition: THREE.Vector3;
    humanPosition: THREE.Vector3;
    returnPosition: THREE.Vector3;
    spacing?: number; // Spacing between points
    rowSpacing?: number; // Spacing between rows
    separation_length?: number;
    layoutRadiusRatio?: number;
    startY?: number;
    lerpSpeed?: number;
}


export default function DiviCircle({
    radius,
    color,
    palette = 'cosmic',
    count = 50,
    particleSize = 0.8,
    animation = false,
    zIndex = 0,
    speedFactor = 1.0,
    initialPosition = new THREE.Vector3(0, 0, 0),
    taijiPosition = new THREE.Vector3(0, 1.3, 0),
    humanPosition = new THREE.Vector3(0, 1.2, 0),
    returnPosition = new THREE.Vector3(0, 0, 0),
    separation_length = 0.5,
    spacing = 0.24, // Spacing between points
    rowSpacing = 0.12, // Spacing between rows
    layoutRadiusRatio = 1.6,
    startY = 2,
    // lerpSpeed = 0.04,
    ...props
}: DaoIsLoveDivisionProps) {
    const diviPointsRef = useRef<THREE.Points>(null); // its location should follow  capturedWillDataRef
    const [, forceUpdate] = useReducer(x => x + 1, 0);
    const { will, isDivinationCompleted, gua,
        divide, getStage,
        setStage } = useDivinationStore();

    const circleRef = useRef<THREE.Mesh>(null);
    const { pointer } = useThree();

    const { divideReady, setElevated, setDivideReady, getSpeedMode, speedMode, setSpeedMode, setDividePhase } = useUIStore();

    const diviContextRef = useRef<DiviContext>({
        stateStartTime: 0,
        stateElapsedTime: 0,
        allAnimationComplete: false,
        firstIntersectionPoint: null,
        secondIntersectionPoint: null,
        lastPoint: null,
        yinCount: 0,
        firstIntersectionTime: 0,
        diviPositions: createInitialPositions(initialPosition, count),
        velocities: new Float32Array(count * 2),
        diviData: Array(count).fill(null).map((_, i) => ({
            pointType: PointWillType.UNKNOWABLE,
            pointEvolveType: PointEvolveType.DIRECTED,
            index: i,
            goal: {
                type: PointWillType.UNKNOWABLE,
                position: new THREE.Vector3(initialPosition.x, initialPosition.y, initialPosition.z),
                color: new THREE.Color(1, 1, 1)
            }
        }))
    });

    const handleWandering = useCallback((ctx: DiviContext) => {
        // console.log('DIVI_CHANGE_START onUpdate', diviContextRef.current.stateElapsedTime);
        const baseSpeed = BaseSpeedConstant * speedFactor;
        const diviPositions = diviPointsRef.current.geometry.attributes.position.array as Float32Array;
        // const capturedWillPositions = diviPointsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            if (ctx.diviData[i].pointType === PointWillType.UNKNOWABLE) {
                // console.log(cameraState, ' free', capturedWillDataRef.current[i]);
                const i3 = i * 3;
                const i2 = i * 2;
                const x = diviPositions[i3];
                const y = diviPositions[i3 + 1];

                // Update position with current velocity
                let newX = x + velocities[i2];
                let newY = y + velocities[i2 + 1];

                // Check circle boundary collision
                const distanceFromCenter = Math.sqrt(newX * newX + newY * newY);
                const radiusRatio = 0.98;
                if (distanceFromCenter > radius * radiusRatio) {
                    const angle = Math.atan2(newY, newX);
                    const bounceAngle = angle + Math.PI + (Math.random() - 0.5) * 0.5;
                    velocities[i2] = Math.cos(bounceAngle) * baseSpeed;
                    velocities[i2 + 1] = Math.sin(bounceAngle) * baseSpeed;

                    const scale = (radius * radiusRatio) / distanceFromCenter;
                    newX *= scale;
                    newY *= scale;
                }

                diviPositions[i3] = newX;
                diviPositions[i3 + 1] = newY;
                // capturedWillPositions[i3 + 2] = Math.sin(clock.getElapsedTime() + i * 0.5) * 0.01;
            }
        }
        diviPointsRef.current.geometry.attributes.position.needsUpdate = true;
    }, [])

    const lerpSpeed = useRef(0.04);
    useEffect(() => {
        const speedMode = getSpeedMode();
        lerpSpeed.current = SpeedModeConfig[speedMode].speed;
    }, [speedMode]);

    const handleAnimating = useCallback(() => {
        // console.log('DIVI Common handleAnimating', stateMachineRef.current.currentState);
        // const baseSpeed = 0.001 * speedFactor;

        // const diviPositions = diviPointsRef.current.geometry.attributes.position.array as Float32Array;
        const diviPositions = diviPointsRef.current.geometry.attributes.position.array as Float32Array;
        let isChangeAnimationComplete = true;

        const EPSILON = 0.005;

        for (let i = 0; i < count; i++) {
            if (diviContextRef.current.diviData[i].pointEvolveType !== PointEvolveType.DIRECTED) {
                continue;
            }
            const i3 = i * 3;

            const x = diviPositions[i3];
            const y = diviPositions[i3 + 1];
            // if (capturedWillDataRef.current[i].type === PointMoveType.TAIJI_FIXED) {
            //     continue;
            // }
            const newX = MathUtils.lerp(x, diviContextRef.current.diviData[i].goal.position.x, lerpSpeed.current);
            const newY = MathUtils.lerp(y, diviContextRef.current.diviData[i].goal.position.y, lerpSpeed.current);

            // check if animation is complete
            if (isChangeAnimationComplete) {
                isChangeAnimationComplete = (
                    Math.abs(newX - diviContextRef.current.diviData[i].goal.position.x) <= EPSILON &&
                    Math.abs(newY - diviContextRef.current.diviData[i].goal.position.y) <= EPSILON
                );
                diviContextRef.current.diviData[i].pointEvolveType = PointEvolveType.DIRECTED;
                // console.log('DIVINATION_CHANGE ANIMATION complete', isChangeAnimationComplete);
            }
            diviContextRef.current.diviData[i].pointType = diviContextRef.current.diviData[i].goal.type;
            diviPositions[i3] = newX;
            diviPositions[i3 + 1] = newY;
            // capturedWillPositions[i3 + 2] = 0;
        }
        diviContextRef.current.allAnimationComplete = isChangeAnimationComplete;
        diviPointsRef.current.geometry.attributes.position.needsUpdate = true;
        // capturedWillPointsRef.current.geometry.attributes.color.needsUpdate = true;
        // capturedWillPointsRef.current.geometry.attributes.color.needsUpdate = true;
    }, [])

    const stateMachineRef = useRef<StateMachine>({
        currentState: DiviState.FREE,
        states: {
            [DiviState.FREE]: {
                name: DiviState.FREE,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            return will != null && will.length > 0 && getStage() === DiviState.DIVI_START
                        },
                        nextState: DiviState.DIVI_START
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    // console.log('FREE onEnter');
                    // setElevated(true);
                    // const randomPositions = createRandom2DCirclePositions(count, radius);
                    // for (let i = 0; i < count; i++) {
                    //     let cur = ctx.diviData[i]
                    //     cur.goal.position.copy(randomPositions[i]);
                    //     cur.pointEvolveType = PointEvolveType.FREE;
                    // }
                },
                onUpdate: (ctx: DiviContext) => {
                    // console.log('FREE onUpdate');
                    // handleWandering(ctx);
                },
                onExit: (ctx: DiviContext) => {
                    // console.log('FREE onExit');
                    // setElevated(false);
                }
            },
            [DiviState.DIVI_START]: {
                name: DiviState.DIVI_START,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            // return ctx.stateElapsedTime > 1
                            return will != null && will.length > 0
                        },
                        nextState: DiviState.DIVI_YAO_START
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    console.log('DIVI_START onEnter');
                    ctx.diviData.forEach(item => {
                        item.pointType = PointWillType.UNKNOWABLE;
                        item.pointEvolveType = PointEvolveType.DIRECTED;
                        item.goal.type = PointWillType.UNKNOWABLE;
                        item.goal.position.copy(initialPosition);
                        // item.goal.color = new THREE.Color(1, 1, 1);
                    })
                },
                onExit: (ctx: DiviContext) => {
                }
            },

            [DiviState.DIVI_YAO_START]: {
                name: DiviState.DIVI_YAO_START,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            console.log('DIVI_YAO_START condition', ctx.allAnimationComplete, ctx.stateElapsedTime);
                            return ctx.allAnimationComplete && ctx.stateElapsedTime > (getSpeedMode() === 'fast' ? 0.1 : 1);
                        },
                        nextState: DiviState.DIVI_CHANGE_START
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    setElevated(false);
                },
                onUpdate: (ctx: DiviContext) => {
                    console.log('DIVI_YAO_START onUpdate', diviContextRef.current.stateElapsedTime);
                    handleAnimating();
                },
                onExit: () => {
                    console.log('DIVI_YAO_START onExit');
                    setElevated(true);
                }
            },

            [DiviState.DIVI_CHANGE_START]: {
                name: DiviState.DIVI_CHANGE_START,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            // 
                            return ctx.allAnimationComplete || ctx.stateElapsedTime > 3;
                        },
                        nextState: DiviState.DIVI_CHANGING
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    console.log('DIVI_YAO_START onEnter');
                    resetDivision();
                    const randomPositions = createRandom2DCirclePositions(count, radius);
                    for (let i = 0; i < count; i++) {
                        const cur = ctx.diviData[i]
                        if (cur.pointType === PointWillType.UNKNOWABLE || cur.pointType === PointWillType.HEAVEN || cur.pointType === PointWillType.EARTH) {
                            cur.goal.type = i === 0 ? PointWillType.TAIJI : PointWillType.UNKNOWABLE;
                            cur.goal.position.copy(i === 0 ? taijiPosition : randomPositions[i]);
                            cur.pointEvolveType = PointEvolveType.DIRECTED;
                        }
                    }
                    diviContextRef.current.allAnimationComplete = false;
                    setDividePhase(DividePhase.WaitDivide);
                },
                onUpdate: (ctx: DiviContext) => {
                    handleAnimating();
                },
                onExit: (ctx: DiviContext) => {
                    console.log('DIVI_CHANGE_START onExit');
                    setDivideReady(false)
                }
            },
            [DiviState.DIVI_CHANGE_CONTINUE]: {
                name: DiviState.DIVI_CHANGE_CONTINUE,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            // 
                            return ctx.allAnimationComplete || ctx.stateElapsedTime > 1;
                        },
                        nextState: DiviState.DIVI_CHANGING
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    resetDivision();
                    const randomPositions = createRandom2DCirclePositions(count, radius);
                    for (let i = 0; i < count; i++) {
                        const cur = ctx.diviData[i]
                        if (cur.pointType === PointWillType.UNKNOWABLE || cur.pointType === PointWillType.HEAVEN || cur.pointType === PointWillType.EARTH) {
                            cur.goal.type = i === 0 ? PointWillType.TAIJI : PointWillType.UNKNOWABLE;
                            cur.goal.position.copy(i === 0 ? taijiPosition : randomPositions[i]);
                            cur.pointEvolveType = PointEvolveType.DIRECTED;
                        }
                    }
                    diviContextRef.current.allAnimationComplete = false;
                },
                onUpdate: (ctx: DiviContext) => {
                    handleAnimating();
                },
                onExit: (ctx: DiviContext) => {
                    console.log('DIVI_CHANGE_CONTINUE onExit');
                }
            },
            [DiviState.DIVI_CHANGING]: {
                name: DiviState.DIVI_CHANGING,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            // 
                            if (ctx.secondIntersectionPoint != null && ctx.firstIntersectionPoint != null) {
                                return true;
                            }
                            return false
                        },
                        nextState: DiviState.DIVI_HEAVEN_EARTH_BORN
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    setDivideReady(true);
                    // resetDivision();
                    setDividePhase(DividePhase.WaitDivide);
                },
                onUpdate: (ctx: DiviContext) => {
                    handleWandering(ctx);
                },
                onExit: (ctx: DiviContext) => {
                    console.log('DIVI_CHANGE_START onExit');
                    setDivideReady(false)
                }
            },
            [DiviState.DIVI_HEAVEN_EARTH_BORN]: {
                name: DiviState.DIVI_HEAVEN_EARTH_BORN,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            return ctx.allAnimationComplete;
                        },
                        nextState: DiviState.DIVI_HUMAN_BORN
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    console.log('DIVINATION_DIVIDE onEnter');

                    const needSwap = ctx.firstIntersectionPoint.x > ctx.secondIntersectionPoint.x;
                    const [start, end] = needSwap ? [ctx.secondIntersectionPoint, ctx.firstIntersectionPoint] : [ctx.firstIntersectionPoint, ctx.secondIntersectionPoint];

                    const positions = diviPointsRef.current.geometry.attributes.position.array as Float32Array;
                    const colors = diviPointsRef.current.geometry.attributes.color.array as Float32Array;

                    // Calculate line parameters for projection
                    const lineVector = new THREE.Vector3().subVectors(end, start);
                    const lineDirection = lineVector.normalize().multiplyScalar(0.2);

                    // Arrays to store indices for each type
                    const heavenIndices: Set<number> = new Set();
                    const earthIndices: Set<number> = new Set();

                    for (let i = 1; i < count; i++) {
                        // if (diviDataRef.current[i].pointType !== PointWillType.UNKNOWABLE) {
                        if (ctx.diviData[i].pointType !== PointWillType.UNKNOWABLE) {
                            continue;
                        }
                        const i3 = i * 3;
                        const currentPos = new THREE.Vector3(positions[i3], positions[i3 + 1], 0);

                        // Determine which side the point is on
                        const side = Math.sign((end.x - start.x) * (positions[i3 + 1] - start.y) -
                            (end.y - start.y) * (positions[i3] - start.x));

                        if (side > 0) {
                            // Point is above the line
                            heavenIndices.add(i);
                            // capturedWillDataRef.current[i].curWillType = PointWillType.HEAVEN;
                            ctx.diviData[i].goal.type = PointWillType.HEAVEN;

                            // Project point upward perpendicular to the division line
                            const perpVector = new THREE.Vector3(-lineDirection.y, lineDirection.x, 0);
                            const targetPos = currentPos.clone().add(perpVector.multiplyScalar(separation_length));

                            // capturedWillDataRef.current[i].targetPosition.copy(targetPos);
                            ctx.diviData[i].goal.position = targetPos;
                            colors[i3 + 1] = 0x0000ff;
                        } else {
                            // Point is below the line
                            earthIndices.add(i);
                            // capturedWillDataRef.current[i].curWillType = PointWillType.EARTH;
                            ctx.diviData[i].goal.type = PointWillType.EARTH;

                            // Project point downward perpendicular to the division line
                            const perpVector = new THREE.Vector3(lineDirection.y, -lineDirection.x, 0);
                            const targetPos = currentPos.clone().add(perpVector.multiplyScalar(separation_length));

                            // capturedWillDataRef.current[i].targetPosition.copy(targetPos);
                            ctx.diviData[i].goal.position = targetPos;
                            colors[i3 + 1] = 0x00ff00;
                        }
                        ctx.diviData[i].pointEvolveType = PointEvolveType.DIRECTED;
                    }
                    diviContextRef.current.yinCount = earthIndices.size;
                    diviPointsRef.current.geometry.attributes.color.needsUpdate = true;

                    setDividePhase(DividePhase.DivideIntoYinYang);
                },
                onUpdate: (ctx: DiviContext) => {
                    handleAnimating();
                },
                onExit: (ctx: DiviContext) => {
                    console.log('DIVINATION_DIVIDE onExit');
                }
            },

            [DiviState.DIVI_HUMAN_BORN]: {
                name: DiviState.DIVI_HUMAN_BORN,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            return ctx.allAnimationComplete;
                        },
                        nextState: DiviState.DIVI_REMINDER_COMPUTATION
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    console.log('DIVINATION_HUMAN_BORN onEnter');
                    // 挂一象三 （❤️） 
                    const earthFixedIndices: number[] = ctx.diviData
                        .filter(constraint => constraint.pointType === PointWillType.EARTH)
                        .map(constraint => constraint.index);

                    const i = earthFixedIndices[Math.floor(Math.random() * earthFixedIndices.length)];

                    ctx.diviData[i].goal.type = PointWillType.HUMANITY;
                    ctx.diviData[i].goal.position.copy(humanPosition);
                    ctx.diviData[i].pointEvolveType = PointEvolveType.DIRECTED;

                    setDividePhase(DividePhase.SetOneForThreePowers);

                },
                onUpdate: (ctx: DiviContext) => {
                    handleAnimating();
                },
                onExit: (ctx: DiviContext) => {
                    console.log('DIVINATION_HUMAN_BORN onExit');
                }
            },
            [DiviState.DIVI_REMINDER_COMPUTATION]: {
                name: DiviState.DIVI_REMINDER_COMPUTATION,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            return ctx.allAnimationComplete;
                        },
                        nextState: DiviState.DIVI_REMINDER_TAKEN
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    console.log('DIVINATION_REMINDER_COMPUTATION onEnter');
                    // 归奇
                    const myHeavenIndices: number[] = ctx.diviData
                        .filter(constraint => constraint.pointType === PointWillType.HEAVEN)
                        .map(constraint => constraint.index);

                    const myEarthIndices: number[] = ctx.diviData
                        .filter(constraint => constraint.pointType === PointWillType.EARTH)
                        .map(constraint => constraint.index);

                    const heavenTotalCount = myHeavenIndices.length;
                    const earthTotalCount = myEarthIndices.length;

                    const heavenReminderCount = heavenTotalCount % 4 === 0 ? 4 : heavenTotalCount % 4;
                    const earthReminderCount = earthTotalCount % 4 === 0 ? 4 : earthTotalCount % 4;
                    console.log('heavenReminderCount : heavenTotalCount', heavenReminderCount, heavenTotalCount);
                    console.log('earthReminderCount : earthTotalCount', earthReminderCount, earthTotalCount);


                    const changeCount: number = diviContextRef.current.diviData
                        .filter(constraint => constraint.pointType === PointWillType.HUMANITY)
                        .length;

                    const pointsPerRow = 4; // This could be made into a parameter


                    for (const [i, index] of myHeavenIndices.entries()) {
                        if (i < heavenReminderCount) {
                            // Place reminder points in a row on the left side
                            const col = i;
                            // Center the points by calculating offset based on total count
                            const offsetX = ((heavenReminderCount - 1) * spacing) / 2;
                            const baseX = -radius * layoutRadiusRatio;
                            ctx.diviData[index].goal.position = new THREE.Vector3(
                                baseX - offsetX + col * spacing,
                                startY - (changeCount * rowSpacing),
                                0
                            );
                            ctx.diviData[index].goal.type = PointWillType.HEAVEN_REMINDER;
                            ctx.diviData[index].pointEvolveType = PointEvolveType.DIRECTED;
                        } else {
                            const row = Math.floor((i - heavenReminderCount) / pointsPerRow);
                            const col = (i - heavenReminderCount) % pointsPerRow;
                            // Calculate offset to center the points in each row
                            const rowPointCount = Math.min(pointsPerRow, heavenTotalCount - heavenReminderCount - row * pointsPerRow);
                            const offsetX = ((rowPointCount - 1) * spacing) / 2;
                            const baseX = -radius * layoutRadiusRatio;
                            ctx.diviData[index].goal.position = new THREE.Vector3(
                                baseX - offsetX + col * spacing,
                                startY - ((changeCount + 2) * rowSpacing) - row * rowSpacing,
                                0
                            );
                            ctx.diviData[index].goal.type = PointWillType.HEAVEN;
                            ctx.diviData[index].pointEvolveType = PointEvolveType.DIRECTED;
                        }
                    }

                    for (const [i, index] of myEarthIndices.entries()) {
                        if (i < earthReminderCount) {
                            // Place reminder points in a row on the right side
                            const col = i;
                            // Center the points by calculating offset based on total count
                            const offsetX = ((earthReminderCount - 1) * spacing) / 2;
                            const baseX = radius * layoutRadiusRatio;
                            ctx.diviData[index].goal.position = new THREE.Vector3(
                                baseX - offsetX + col * spacing,
                                startY - (changeCount * rowSpacing),
                                0
                            );
                            ctx.diviData[index].goal.type = PointWillType.EARTH_REMINDER;
                            ctx.diviData[index].pointEvolveType = PointEvolveType.DIRECTED;
                        } else {
                            const row = Math.floor((i - earthReminderCount) / pointsPerRow);
                            const col = (i - earthReminderCount) % pointsPerRow;
                            // Calculate offset to center the points in each row
                            const rowPointCount = Math.min(pointsPerRow, earthTotalCount - earthReminderCount - row * pointsPerRow);
                            const offsetX = ((rowPointCount - 1) * spacing) / 2;
                            const baseX = radius * layoutRadiusRatio;
                            ctx.diviData[index].goal.position = new THREE.Vector3(
                                baseX - offsetX + col * spacing,
                                startY - ((changeCount + 2) * rowSpacing) - row * rowSpacing,
                                0
                            );
                            ctx.diviData[index].goal.type = PointWillType.EARTH;
                            ctx.diviData[index].pointEvolveType = PointEvolveType.DIRECTED;
                        }
                    }
                    diviPointsRef.current.geometry.attributes.position.needsUpdate = true;

                    setDividePhase(DividePhase.CountByFours);
                },
                onUpdate: (ctx: DiviContext) => {
                    handleAnimating();
                },
                onExit: (ctx: DiviContext) => {
                    console.log('DIVINATION_REMINDER_COMPUTATION onExit');
                }
            },
            [DiviState.DIVI_REMINDER_TAKEN]: {
                name: DiviState.DIVI_REMINDER_TAKEN,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            return ctx.allAnimationComplete;
                        },
                        nextState: DiviState.DIVI_CHANGE_END
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    // console.log('DIVINATION_REMINDER_TAKEN onEnter');
                    for (let i = 0; i < count; i++) {
                        if (ctx.diviData[i].pointType === PointWillType.EARTH_REMINDER
                            || ctx.diviData[i].pointType === PointWillType.HEAVEN_REMINDER
                            || ctx.diviData[i].pointType === PointWillType.HUMANITY
                        ) {
                            ctx.diviData[i].goal.position.copy(returnPosition);
                            ctx.diviData[i].goal.type = ctx.diviData[i].pointType;
                            ctx.diviData[i].pointEvolveType = PointEvolveType.DIRECTED;
                        } else if (ctx.diviData[i].pointType === PointWillType.EARTH || ctx.diviData[i].pointType === PointWillType.HEAVEN) {
                            ctx.diviData[i].goal.type = PointWillType.UNKNOWABLE;
                            ctx.diviData[i].pointEvolveType = PointEvolveType.DIRECTED;
                        }
                    }
                    diviPointsRef.current.geometry.attributes.position.needsUpdate = true;
                    setDividePhase(DividePhase.GatherTheRemainders);
                },
                onUpdate: (ctx: DiviContext) => {
                    handleAnimating();
                },
                onExit: (ctx: DiviContext) => {
                    console.log('DIVINATION_REMINDER_TAKEN onExit');
                }
            },
            [DiviState.DIVI_CHANGE_END]: {
                name: DiviState.DIVI_CHANGE_END,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            const changeCount: number = diviContextRef.current.diviData
                                .filter(constraint => constraint.pointType === PointWillType.HUMANITY)
                                .length;
                            const yaoEnd = changeCount >= 3 || isDivinationCompleted();
                            console.log('DIVINATION_CHANGE_END', yaoEnd, changeCount, isDivinationCompleted());
                            return yaoEnd;
                        },
                        nextState: DiviState.DIVI_YAO_END
                    },
                    {
                        condition: (ctx: DiviContext) => {
                            return true;
                        },
                        nextState: DiviState.DIVI_CHANGE_CONTINUE
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    // console.log('DIVINATION_REMINDER_TAKEN onEnter'); 
                    divide(ctx.yinCount);
                    setDividePhase(null);
                },
                // onUpdate: (ctx: DiviContext) => {
                // handleAnimating();
                // },
                onExit: (ctx: DiviContext) => {
                    setStage(DiviState.DIVI_YAO_END);
                }
            },
            [DiviState.DIVI_YAO_END]: {
                name: DiviState.DIVI_YAO_END,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            return ctx.allAnimationComplete && isDivinationCompleted()
                        },
                        nextState: DiviState.DIVI_END
                    },
                    {
                        condition: (ctx: DiviContext) => {
                            return ctx.allAnimationComplete;
                        },
                        nextState: DiviState.DIVI_YAO_START
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    console.log('DIVI_YAO_END onEnter');
                    setElevated(false);
                    ctx.diviData.forEach(item => {
                        item.pointType = PointWillType.UNKNOWABLE;
                        item.pointEvolveType = PointEvolveType.DIRECTED;
                        item.goal.type = PointWillType.UNKNOWABLE;
                        item.goal.position.copy(initialPosition);
                        // item.goal.color = new THREE.Color(1, 1, 1);
                    })
                },
                onUpdate: (ctx: DiviContext) => {
                    handleAnimating();
                },
                onExit: (ctx: DiviContext) => {
                    console.log('DIVI_YAO_START onExit');
                }
            },
            [DiviState.DIVI_END]: {
                name: DiviState.FREE,
                transitions: [
                    {
                        condition: (ctx: DiviContext) => {
                            return isDivinationCompleted();
                        },
                        nextState: DiviState.FREE
                    }
                ],
                onEnter: (ctx: DiviContext) => {
                    console.log('DIVI_END onEnter');
                    ctx.diviData.forEach(item => {
                        item.pointType = PointWillType.UNKNOWABLE;
                        item.pointEvolveType = PointEvolveType.DIRECTED;
                        item.goal.type = PointWillType.UNKNOWABLE;
                        item.goal.position.copy(initialPosition);
                        // item.goal.color = new THREE.Color(1, 1, 1);
                    })
                },
                onUpdate: (ctx: DiviContext) => {
                    handleAnimating();
                },
                onExit: (ctx: DiviContext) => {
                    setStage(DiviState.FREE);
                    setDivideReady(false);
                }
            },
        }
    });

    const groupRef = useRef<THREE.Group>(null);
    const { cameraState, setCameraState } = useUIStore();

    const { camera, } = useThree();

    // Minimum distance between points and minimum time between updates
    const MIN_DISTANCE = 0.005; // Adjust this value to control line smoothness
    const MIN_UPDATE_INTERVAL = 0; // Approximately 60fps

    // Get the color palette
    const colorPalette = useMemo(() => getPalette(palette), [palette]);

    // Use the provided color or get it from the palette
    const particleColor = useMemo(() => color || colorPalette.diviPrimary, [color, colorPalette]);

    // Initialize geometry and material
    const { divinationUnitsGeometry, divinationUnitsMaterial } = useMemo(() => {
        // Create particle positions
        // const capturedWillInitialPositions = new Float32Array(count * 3);
        const initialPositions = createInitialPositions(initialPosition, count);
        const colors = new Float32Array(count * 3);
        const colorObj = new THREE.Color(particleColor);
        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            colors[i3] = colorObj.r;
            colors[i3 + 1] = colorObj.g;
            colors[i3 + 2] = colorObj.b;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(initialPositions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // Add custom attributes for the shader
        const sizes = new Float32Array(count);
        const randomValues = new Float32Array(count * 4);
        const particleColors = new Float32Array(count * 3);

        // Create a color palette for more interesting variation
        const baseColor = new THREE.Color(particleColor);
        const colorVariants = [
            new THREE.Color(baseColor).offsetHSL(0.05, 0.1, 0.1),  // Slightly shifted hue
            new THREE.Color(baseColor).offsetHSL(-0.05, 0.2, 0),   // Different saturation
            new THREE.Color(baseColor).offsetHSL(0.1, 0, 0.15),    // Brighter variant
            new THREE.Color(baseColor).offsetHSL(-0.1, 0.15, -0.1) // Darker variant
        ];

        for (let i = 0; i < count; i++) {
            // Equal size for all particles
            sizes[i] = 1.0;

            // Random values for animation and effects
            randomValues[i * 4] = Math.random() * 2 - 1;     // random x offset
            randomValues[i * 4 + 1] = Math.random() * 2 - 1; // random y offset
            randomValues[i * 4 + 2] = Math.random() * 0.02 + 0.01; // random animation speed
            randomValues[i * 4 + 3] = Math.random();   // random effect intensity

            // Assign varied colors from palette
            const colorIndex = Math.floor(Math.random() * colorVariants.length);
            const selectedColor = colorVariants[colorIndex];
            particleColors[i * 3] = selectedColor.r;
            particleColors[i * 3 + 1] = selectedColor.g;
            particleColors[i * 3 + 2] = selectedColor.b;
        }

        geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
        geo.setAttribute('aRandom', new THREE.BufferAttribute(randomValues, 4));
        geo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

        // Custom shader material for fancy particle effects
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color(particleColor) },
                uSize: { value: particleSize * 2.0 }, // Fixed larger size
                uColorVariation: { value: 0.2 }, // Control color variation intensity
                uGlowStrength: { value: 1.2 }, // Stronger glow
            },
            vertexShader: divi_point_v,
            fragmentShader: divi_point_f,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        return { divinationUnitsGeometry: geo, divinationUnitsMaterial: mat };
    }, [count]);

    // Store velocities for particles
    const velocities = useMemo(() => {
        const vels = new Float32Array(count * 2);
        const baseSpeed = BaseSpeedConstant * speedFactor;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            vels[i * 2] = Math.cos(angle) * baseSpeed;
            vels[i * 2 + 1] = Math.sin(angle) * baseSpeed;
        }
        // console.log('vels', vels);
        return vels;
    }, [count, speedFactor]);


    // Create dots geometry and material
    const { dotsGeometry, dotsMaterial, intersectionMaterial } = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const mat = new THREE.PointsMaterial({
            size: 0.3,
            color: 0xff0000,
            map: new THREE.CanvasTexture(ParticleCanvasTextureFactory.createLove()),
            transparent: true,
            depthWrite: false,
            alphaTest: 0.01
        });
        const intersectMat = new THREE.PointsMaterial({
            size: 0.5,
            color: 0xffff00,  // Yellow color for intersection points
            map: new THREE.CanvasTexture(ParticleCanvasTextureFactory.createDot()),
            transparent: true,
            depthWrite: false,
            alphaTest: 0.01
        });
        return { dotsGeometry: geo, dotsMaterial: mat, intersectionMaterial: intersectMat };
    }, []);

    // Add memoized geometries for intersection points
    const intersectionGeometries = useMemo(() => ({
        first: new THREE.BufferGeometry(),
        second: new THREE.BufferGeometry()
    }), []);

    // Update geometries when intersection points change
    useEffect(() => {
        if (diviContextRef.current.firstIntersectionPoint) {
            intersectionGeometries.first.setFromPoints([diviContextRef.current.firstIntersectionPoint]);
            intersectionGeometries.first.attributes.position.needsUpdate = true;
        }
        if (diviContextRef.current.secondIntersectionPoint) {
            intersectionGeometries.second.setFromPoints([diviContextRef.current.secondIntersectionPoint]);
            intersectionGeometries.second.attributes.position.needsUpdate = true;
        }
    }, [diviContextRef.current.firstIntersectionPoint, diviContextRef.current.secondIntersectionPoint]);

    // Cleanup geometries on unmount
    useEffect(() => {
        return () => {
            intersectionGeometries.first.dispose();
            intersectionGeometries.second.dispose();
        };
    }, []);

    // Create reusable objects for pointer move handling
    const planeRef = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
    const raycasterRef = useRef(new THREE.Raycaster());
    const intersectionPointRef = useRef(new THREE.Vector3());

    // Helper function to handle pointer movement from within useFrame
    const handlePointerMoveFromVector2 = useCallback((pointerPosition: THREE.Vector2, currentTime: number) => {
        if (diviContextRef.current.firstIntersectionPoint != null && diviContextRef.current.secondIntersectionPoint != null) return;

        // Reuse the plane and raycaster objects
        raycasterRef.current.setFromCamera(pointerPosition, camera);

        // Reuse the intersection point vector
        const result = raycasterRef.current.ray.intersectPlane(planeRef.current, intersectionPointRef.current);
        if (result === null) return;

        groupRef.current.worldToLocal(intersectionPointRef.current);

        if (diviContextRef.current.lastPoint) {
            // Check for circle intersection
            const circleIntersection = findCircleIntersection(diviContextRef.current.lastPoint, intersectionPointRef.current, radius);
            if (circleIntersection) {
                if (!diviContextRef.current.firstIntersectionPoint) {
                    diviContextRef.current.firstIntersectionPoint = circleIntersection;
                    diviContextRef.current.firstIntersectionTime = currentTime; // Record the time when first point is set
                    forceUpdate();
                } else if (!diviContextRef.current.secondIntersectionPoint) {
                    // Check if second point is far enough from first point
                    const distance = diviContextRef.current.firstIntersectionPoint.distanceTo(circleIntersection);
                    const MIN_INTERSECTION_DISTANCE = radius * 0.5;

                    if (distance > MIN_INTERSECTION_DISTANCE) {
                        // Store the potential second intersection point temporarily
                        const potentialSecondPoint = circleIntersection.clone();

                        // Check if the line properly divides the points
                        const positions = diviPointsRef.current.geometry.attributes.position.array as Float32Array;
                        let hasPointsAboveLine = false;
                        let hasPointsBelowLine = false;

                        for (let i = 1; i < count; i++) {
                            if (diviContextRef.current.diviData[i].pointType !== PointWillType.UNKNOWABLE) {
                                continue; // Only check UNKNOWABLE points
                            }

                            const i3 = i * 3;
                            // Determine which side the point is on using the line equation
                            const side = Math.sign(
                                (potentialSecondPoint.x - diviContextRef.current.firstIntersectionPoint.x) *
                                (positions[i3 + 1] - diviContextRef.current.firstIntersectionPoint.y) -
                                (potentialSecondPoint.y - diviContextRef.current.firstIntersectionPoint.y) *
                                (positions[i3] - diviContextRef.current.firstIntersectionPoint.x)
                            );

                            if (side > 0) {
                                hasPointsAboveLine = true;
                            } else if (side <= 0) {
                                hasPointsBelowLine = true;
                            }

                            if (hasPointsAboveLine && hasPointsBelowLine) {
                                break;
                            }
                        }

                        // Check if all points are on one side of the line
                        if (!(hasPointsAboveLine && hasPointsBelowLine)) {
                            console.error("Error: All points are on one side of the line. The line must divide the points.");
                            // Clear the first point to force the user to start over
                            diviContextRef.current.firstIntersectionPoint = null;
                            forceUpdate();
                            return;
                        }

                        // If we reach here, the line properly divides the points
                        diviContextRef.current.secondIntersectionPoint = potentialSecondPoint;
                        forceUpdate();
                    }
                }
            }
        }
        // Clone the intersection point to avoid reference issues
        diviContextRef.current.lastPoint = intersectionPointRef.current.clone();
    }, [camera, radius, count]);

    // Particle animation and collision
    useFrame(({ clock, pointer }, delta) => {
        // const time = clock.getElapsedTime();
        const currentTime = clock.getElapsedTime();

        if (guaGroupRef.current) {
            // has two points
            if (!diviContextRef.current.firstIntersectionPoint || !diviContextRef.current.secondIntersectionPoint) {
                guaGroupRef.current.rotation.z -= delta * 0.1;
            }
            if (diviContextRef.current.firstIntersectionPoint && !diviContextRef.current.secondIntersectionPoint) {
                const timeSinceFirstPoint = currentTime - diviContextRef.current.firstIntersectionTime;

                if (timeSinceFirstPoint > 1.0) { // 2 seconds timeout
                    diviContextRef.current.firstIntersectionPoint = null;
                    diviContextRef.current.firstIntersectionTime = 0;
                    forceUpdate();
                }
            }
        }


        if (!diviPointsRef.current) return;



        // Update shader time uniform for particle animation
        if (divinationUnitsMaterial.uniforms) {
            // Update time
            divinationUnitsMaterial.uniforms.uTime.value = currentTime;

            // Create more dramatic pulsing effects for glow
            if (divinationUnitsMaterial.uniforms.uGlowStrength) {
                // More dramatic glow pulsing
                const glowPulse = 1.2 + 0.8 * Math.sin(currentTime * 0.5);
                divinationUnitsMaterial.uniforms.uGlowStrength.value = glowPulse;
            }

            // Set fixed size with no variation
            if (divinationUnitsMaterial.uniforms.uSize) {
                divinationUnitsMaterial.uniforms.uSize.value = particleSize * 2.0; // Fixed larger size
            }
        }

        // use it to make cut smooth instead of onPointerMove
        if (divideReady) {
            handlePointerMoveFromVector2(pointer, currentTime);
            if (groupRef.current?.userData.updateTime) {
                groupRef.current.userData.updateTime(currentTime);
            }
        }


        // Update state machine
        const stateMachine = stateMachineRef.current;
        // stateMachine.stateElapsedTime = currentTime - stateMachine.stateStartTime;
        diviContextRef.current.stateElapsedTime = currentTime - diviContextRef.current.stateStartTime;

        // Get current state
        const currentState = stateMachine.states[stateMachine.currentState];
        if (!currentState) return;

        // Check for transitions
        for (const transition of currentState.transitions) {
            if (transition.condition(diviContextRef.current)) {
                console.log(`Transitioning from ${stateMachine.currentState} to ${transition.nextState}`);

                // Exit current state
                if (currentState.onExit) {
                    currentState.onExit(diviContextRef.current);
                }

                // Enter new state
                stateMachine.currentState = transition.nextState;
                diviContextRef.current.stateStartTime = currentTime;
                diviContextRef.current.stateElapsedTime = 0;

                const newState = stateMachine.states[transition.nextState];
                if (newState && newState.onEnter) {
                    newState.onEnter(diviContextRef.current);
                }

                break;
            }
        }

        // Update current state
        const state = stateMachine.states[stateMachine.currentState];
        if (state && state.onUpdate) {
            state.onUpdate(diviContextRef.current);
            return; // Skip the old animation code
        }

    });



    // Add a function to reset the division
    const resetDivision = useCallback(() => {
        diviContextRef.current.secondIntersectionPoint = null;
        diviContextRef.current.firstIntersectionPoint = null;
    }, []);

    // Create both materials with useMemo to avoid recreation
    const materials = useMemo(() => {
        const dashMaterial = new THREE.ShaderMaterial({
            uniforms: {
                color: { value: new THREE.Color(color) },
                dashSize: { value: 0.05 },
                gapSize: { value: 0.15 },
                time: { value: 0 },
                amplitude: { value: 0.05 },
                frequency: { value: 5.0 },
                colorShift: { value: 0.5 },
                dashCount: { value: 40.0 }
            },
            vertexShader: line_v,
            fragmentShader: line_f,
            transparent: true,
            side: THREE.DoubleSide
        });

        const standardMaterial = new THREE.MeshStandardMaterial({
            color: color,
            side: THREE.DoubleSide,
            emissive: color,
            emissiveIntensity: 1,
            transparent: true,
            opacity: 0.8
        });

        return { dashMaterial, standardMaterial };
    }, [color]);

    const AnimatedFireRing = animated(FireRing);
    const fireRingSpring = useSpring({
        opacity: divideReady ? 1 : 0,
        config: { tension: 240, friction: 120, mass: 10 }
    });

    const guaGroupRef = useRef<THREE.Group>(null);


    // Set up the updateTime function once
    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.userData.updateTime = (time) => {
                if (materials.dashMaterial.uniforms.time) {
                    materials.dashMaterial.uniforms.time.value = time;
                }
            };
        }
    }, [materials]);

    return (
        <group
            {...props}
            ref={groupRef}
        >

            <points ref={diviPointsRef} geometry={divinationUnitsGeometry} material={divinationUnitsMaterial} />

            <group position={[0, 0.0, 0]}>
                <DiviGalaxy spin={1} branches={4}
                    radius={radius * 2.0 + 0.2}
                    randomness={2}
                    size={2}
                    randomnessPower={4}
                    count={100000}
                    spinSpeed={0.2}
                />
            </group>

            <animated.group>
                <AnimatedFireRing width={radius * 4.4} opacity={fireRingSpring.opacity} />
            </animated.group>


            {/* Intersection point markers */}
            {diviContextRef.current.firstIntersectionPoint && (
                <points position={[0, 0, 0.16]} geometry={intersectionGeometries.first} material={intersectionMaterial} />
            )}
            {diviContextRef.current.secondIntersectionPoint && (
                <points position={[0, 0, 0.16]} geometry={intersectionGeometries.second} material={intersectionMaterial} />
            )}

            {/* Division line */}
            {diviContextRef.current.firstIntersectionPoint && diviContextRef.current.secondIntersectionPoint && (
                <FancyLine
                    start={diviContextRef.current.firstIntersectionPoint}
                    end={diviContextRef.current.secondIntersectionPoint}
                />
            )}

            {/* Gua text items group */}
            <group ref={guaGroupRef} rotation={[0, 0, 0]} position={[0, 0, 0.0]}>
                {commonIChingBinaryList.map((item, i) => {
                    // const angle = (i / commonIChingMap.length) * Math.PI * 2;
                    const angle = (i / 64) * Math.PI * 2;
                    const x = Math.cos(angle) * radius * 1.10;
                    const y = Math.sin(angle) * radius * 1.10;

                    return (
                        <Text
                            key={`gua-${i}`}
                            position={[x, y, 0.01]}
                            rotation={[0, 0, angle + Math.PI * 3 / 2]}
                            fontSize={0.18}
                            color="#e9b1ec"
                            anchorX="center"
                            anchorY="middle"
                            outlineColor={particleColor}
                            fillOpacity={1}
                        >
                            {commonIChingMap[item].symbol}
                        </Text>
                    );
                })}
            </group>

        </group>

    );
}
