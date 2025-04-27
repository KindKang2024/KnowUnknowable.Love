import React, {useEffect, useRef, useState} from 'react';
import styles from './ZeroKnowledgeDemo.module.css';
import {ZkDemo} from '@/i18n/data_types';

interface Point {
    [key: string]: [number, number];
}

interface ColorMap {
    [key: string]: number;
}

type Edge = [string, string];

const ZeroKnowledgeDemo: React.FC<{ data: ZkDemo }> = ({ data }) => {
    // Constants
    const POINTS_1: Point = {
        'a': [300, 40],
        'b': [119, 187],
        'c': [481, 187],
        'd': [175, 359],
        'e': [425, 359],
        'f': [300, 88],
        'g': [175, 191],
        'h': [420, 191],
        'i': [215, 311],
        'j': [385, 311],
    };

    const COLORS_1: ColorMap = {
        'a': 0,
        'b': 1,
        'c': 1,
        'd': 0,
        'e': 2,
        'f': 2,
        'g': 2,
        'h': 0,
        'i': 1,
        'j': 0,
    };

    const DOT_1: Edge[] = [
        ['a', 'b'], ['a', 'c'], ['c', 'e'], ['d', 'e'], ['b', 'd'],
        ['a', 'f'], ['b', 'g'], ['c', 'h'], ['d', 'i'], ['e', 'j'],
        ['h', 'g'], ['h', 'i'], ['g', 'j'], ['f', 'j'], ['f', 'i'],
    ];

    const COLORS = ['MediumBlue', 'DarkOrchid', 'DarkTurquoise'];
    const PERMUTATIONS = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];

    // State
    const [revealed, setRevealed] = useState<boolean>(false);
    const [turboMode, setTurboMode] = useState<boolean>(false);
    const [confidence, setConfidence] = useState<number>(0);
    const [trials, setTrials] = useState<number>(0);
    const [autoRunning, setAutoRunning] = useState<boolean>(false);
    const [revealDisabled, setRevealDisabled] = useState<boolean>(true);
    const [nodeColors, setNodeColors] = useState<Map<string, number>>(new Map());
    const [revealedNodes, setRevealedNodes] = useState<Set<string>>(new Set());
    const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
    const [permutation, setPermutation] = useState<number[]>([]);
    const [graphState, setGraphState] = useState<'idle' | 'success' | 'failure'>('idle');

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    // Utility functions
    const randomPick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randomPermutation = (): number[] => randomPick(PERMUTATIONS);

    // Setup graph
    const setupGraph = (preserveTrials = false) => {
        setRevealed(false);
        setGraphState('idle');
        setSelectedEdge(null);
        setRevealedNodes(new Set());

        if (!preserveTrials) {
            setTrials(0);
            setConfidence(0);
        }

        const perm = randomPermutation();
        setPermutation(perm);

        const colors = new Map<string, number>();
        Object.keys(POINTS_1).forEach(node => {
            colors.set(node, perm[COLORS_1[node]]);
        });
        setNodeColors(colors);

        setRevealDisabled(true);
    };

    // Handle revealing all nodes
    const handleReveal = () => {
        if (!revealed) {
            const allNodes = new Set(Object.keys(POINTS_1));
            setRevealedNodes(allNodes);
            setRevealed(true);
        } else {
            setupGraph();
        }
    };

    // Handle edge selection
    const handleEdgeSelect = (edge: Edge) => {
        if (revealed) return;

        setSelectedEdge(edge);

        const newPerm = randomPermutation();
        setPermutation(newPerm);

        const colors = new Map<string, number>();
        Object.keys(POINTS_1).forEach(node => {
            colors.set(node, newPerm[COLORS_1[node]]);
        });
        setNodeColors(colors);

        const newRevealed = new Set<string>();
        newRevealed.add(edge[0]);
        newRevealed.add(edge[1]);
        setRevealedNodes(newRevealed);
        setRevealDisabled(false);

        const node1Color = colors.get(edge[0]);
        const node2Color = colors.get(edge[1]);

        if (node1Color === node2Color) {
            setGraphState('failure');
            setTrials(0);
            setConfidence(0);
            setRevealed(true);
        } else {
            setTrials(prevTrials => {
                const newTrials = prevTrials + 1;
                const newConfidence = Math.min((1 - Math.pow(1 - 1 / DOT_1.length, newTrials)) * 100, 99.99);
                setConfidence(newConfidence);
                return newTrials;
            });

            setGraphState('success');
        }
    };

    // Handle turbo mode toggle
    const handleTurboToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setTurboMode(isChecked);

        if (isChecked) {
            setAutoRunning(true);
            setTimeout(() => runAutoMode(), 0);
        } else {
            setAutoRunning(false);
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            setRevealedNodes(new Set());
            setSelectedEdge(null);
        }
    };

    // Auto mode function
    const runAutoMode = () => {
        if (!autoRunning) return;

        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        const randomEdge = randomPick(DOT_1);

        const newPerm = randomPermutation();
        setPermutation(newPerm);

        const colors = new Map<string, number>();
        Object.keys(POINTS_1).forEach(node => {
            colors.set(node, newPerm[COLORS_1[node]]);
        });
        setNodeColors(colors);

        setSelectedEdge(randomEdge);

        const newRevealed = new Set<string>();
        newRevealed.add(randomEdge[0]);
        newRevealed.add(randomEdge[1]);
        setRevealedNodes(newRevealed);

        setRevealDisabled(false);

        const node1Color = colors.get(randomEdge[0]);
        const node2Color = colors.get(randomEdge[1]);

        timerRef.current = setTimeout(() => {
            if (node1Color === node2Color) {
                setGraphState('failure');
                setTrials(0);
                setConfidence(0);
                setRevealed(true);
                setTurboMode(false);
                setAutoRunning(false);
            } else {
                setTrials(prevTrials => {
                    const newTrials = prevTrials + 1;
                    const newConfidence = Math.min((1 - Math.pow(1 - 1 / DOT_1.length, newTrials)) * 100, 99.99);
                    setConfidence(newConfidence);
                    return newTrials;
                });

                setGraphState('success');

                if (autoRunning) {
                    timerRef.current = setTimeout(() => runAutoMode(), 50);
                }
            }
        }, 1000);
    };

    // Setup on component mount
    useEffect(() => {
        setupGraph();

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    // Update auto mode when turboMode or autoRunning changes
    useEffect(() => {
        if (revealed) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
            setAutoRunning(false);
            setTurboMode(false);
            return;
        }

        if (turboMode && autoRunning && !revealed) {
            if (!timerRef.current) {
                runAutoMode();
            }
        } else if (!turboMode || !autoRunning) {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [turboMode, autoRunning, revealed, graphState]);

    // Update edge appearance when selected edge changes
    useEffect(() => {
        if (svgRef.current) {
            const lines = svgRef.current.querySelectorAll('g:first-of-type line');

            lines.forEach((line, idx) => {
                const currentEdge = DOT_1[idx];
                const isSelected = selectedEdge &&
                    (selectedEdge[0] === currentEdge[0] && selectedEdge[1] === currentEdge[1]);

                line.setAttribute('stroke', isSelected ? 'green' : 'gray');
                line.setAttribute('stroke-width', isSelected ? '5px' : '1px');
            });
        }
    }, [selectedEdge]);

    return (
        <div className={styles.container}>
            <div>
                <h1 className="text-red-300 text-ms mb-2 flex items-center justify-center">
                    {data.title}
                    <a href="https://web.mit.edu/~ezyang/Public/graph/svg.html" target="_blank" rel="noopener noreferrer" className="text-xs ml-2 text-blue-300 hover:text-blue-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {data.originalAddress}
                    </a>
                </h1>
                <p className="text-white/70 mb-4 text-left max-w-2xl mx-auto">
                    {data.description}
                </p>
                <p className="text-white/70 mb-4 text-left max-w-2xl mx-auto">
                    {data.clickAnyEdge}
                </p>
               

                <div className={styles.mainCanvas}>
                    <svg
                        ref={svgRef}
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.svgContainer}
                        style={{ cursor: 'default' }}
                        onClick={(e) => {
                            if (e.target === svgRef.current) {
                                setupGraph(false);
                            }
                        }}
                    >
                        <defs>
                            <marker
                                id="Triangle"
                                viewBox="0 0 10 10"
                                refX="0" refY="5"
                                markerUnits="strokeWidth"
                                markerWidth="4" markerHeight="3"
                                orient="auto"
                            >
                                <path d="M 0 0 L 10 5 L 0 10 z" />
                            </marker>
                        </defs>

                        {/* Edges */}
                        <g>
                            {DOT_1.map((edge, index) => (
                                <line
                                    key={`edge-${index}`}
                                    x1={POINTS_1[edge[0]][0]}
                                    y1={POINTS_1[edge[0]][1]}
                                    x2={POINTS_1[edge[1]][0]}
                                    y2={POINTS_1[edge[1]][1]}
                                    stroke="gray"
                                    strokeWidth="1px"
                                />
                            ))}
                        </g>

                        {/* Edge hover areas */}
                        <g>
                            {DOT_1.map((edge, index) => (
                                <line
                                    key={`hover-${index}`}
                                    x1={POINTS_1[edge[0]][0]}
                                    y1={POINTS_1[edge[0]][1]}
                                    x2={POINTS_1[edge[1]][0]}
                                    y2={POINTS_1[edge[1]][1]}
                                    stroke="rgba(255,255,255,0)"
                                    strokeWidth="15px"
                                    style={{ cursor: !revealed && !autoRunning ? 'pointer' : 'default' }}
                                    onMouseOver={(e) => {
                                        if (!revealed && !autoRunning) {
                                            const lines = svgRef.current?.getElementsByTagName('line');
                                            if (lines && lines[index]) {
                                                lines[index].setAttribute('stroke', 'cyan');
                                                lines[index].setAttribute('stroke-width', '5px');
                                            }
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!revealed && !autoRunning) {
                                            const lines = svgRef.current?.getElementsByTagName('line');
                                            if (lines && lines[index]) {
                                                const isSelected = selectedEdge &&
                                                    selectedEdge[0] === edge[0] &&
                                                    selectedEdge[1] === edge[1];
                                                lines[index].setAttribute('stroke', isSelected ? 'green' : 'gray');
                                                lines[index].setAttribute('stroke-width', isSelected ? '5px' : '1px');
                                            }
                                        }
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!revealed && !autoRunning) {
                                            handleEdgeSelect(edge);
                                        }
                                    }}
                                />
                            ))}
                        </g>

                        {/* Nodes */}
                        <g>
                            {Object.entries(POINTS_1).map(([nodeName, position]) => {
                                let fillColor = "white";
                                if (autoRunning && !revealedNodes.has(nodeName)) fillColor = "grey";
                                if (revealedNodes.has(nodeName)) {
                                    const colorIndex = nodeColors.get(nodeName) || 0;
                                    fillColor = COLORS[colorIndex];
                                }
                                if (revealed && !revealedNodes.has(nodeName)) fillColor = "gray";

                                return (
                                    <circle
                                        key={`node-${nodeName}`}
                                        cx={position[0]}
                                        cy={position[1]}
                                        r="10"
                                        fill={fillColor}
                                    />
                                );
                            })}
                        </g>
                    </svg>
                </div>

                <div className={styles.controls}>
                    <div>
                        <button
                            className={styles.button}
                            onClick={handleReveal}
                        // disabled={revealDisabled}
                        >
                            {revealed ? data.resetText : data.revealText}
                        </button>
                        <label htmlFor="turbo" style={{ marginLeft: '10px' }}>
                            {data.turboText}
                        </label>
                        <input
                            type="checkbox"
                            id="turbo"
                            checked={turboMode}
                            onChange={handleTurboToggle}
                        />
                    </div>
                    <div className={styles.confidenceDisplay}>
                        {data.confidence}: <span className={graphState === 'failure' ? styles.confidenceError : ''}>
                            {confidence.toFixed(2)}
                        </span>%
                    </div>
                    <div>
                        <button className={styles.button} onClick={() => setupGraph(false)}>{data.resetText}</button>
                    </div>
                </div>
            </div>


            <div className="mt-10">
                <h1 className="text-red-300 text-ms mb-3 text-center">
                    {data.comparisonsTitle}
                </h1>
                <div className="overflow-auto w-full">
                    <table className="min-w-full border-collapse border border-purple-500/30 bg-black/30 text-sm text-white/80 rounded-lg">


                        <thead>
                            <tr className="bg-purple-900/30">
                                {/* <th className="p-3 border border-purple-500/30 text-left">Aspect</th>
                                <th className="p-3 border border-purple-500/30 text-left">I Ching Divination</th>
                                <th className="p-3 border border-purple-500/30 text-left">Zero Knowledge Proof</th> */}
                                <th className="p-3 border border-purple-500/30 text-left w-1/5">{data.comparisons[0].aspect}</th>
                                <th className="p-3 border border-purple-500/30 text-left w-2/5">{data.comparisons[0].iChing}</th>
                                <th className="p-3 border border-purple-500/30 text-left w-2/5">{data.comparisons[0].zkDemo}</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.comparisons.slice(1).map((comparison, index) => (
                                <tr key={index}>
                                    <td className="p-3 border border-purple-500/30 font-medium text-purple-300">{comparison.aspect}</td>
                                    <td className="p-3 border border-purple-500/30">
                                        <div dangerouslySetInnerHTML={{ __html: comparison.iChing }} />
                                    </td>
                                    <td className="p-3 border border-purple-500/30">{comparison.zkDemo}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ZeroKnowledgeDemo;