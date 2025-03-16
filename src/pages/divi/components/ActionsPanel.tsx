import React, {useState} from 'react';
import {ChevronDown, ChevronUp, DollarSign, Share2} from 'lucide-react';

interface ActionItemProps {
    number: number;
    title: string;
    children?: React.ReactNode;
    defaultOpen?: boolean;
}

const ActionItem: React.FC<ActionItemProps> = ({ number, title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-700">
            <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-4">
                    {/* <StepNumber number={number} /> */}
                    <h3 className="text-lg text-purple-300 font-medium">{title}</h3>
                </div>
                {isOpen ?
                    <ChevronUp className="text-purple-300" size={20} /> :
                    <ChevronDown className="text-purple-300" size={20} />
                }
            </div>
            {isOpen && (
                <div className="px-4 pb-4 ml-12">
                    {children}
                </div>
            )}
        </div>
    );
};

interface AmountButtonProps {
    value: string;
    selected: boolean;
    onClick: () => void;
}

const AmountButton: React.FC<AmountButtonProps> = ({ value, selected, onClick }) => (
    <button
        className={`px-6 py-2 rounded-full ${selected
            ? 'bg-purple-900 border-2 border-purple-400 text-purple-300'
            : 'bg-gray-800 border border-gray-700 text-gray-300'
            }`}
        onClick={onClick}
    >
        ${value}
    </button>
);

const ActionsPanel: React.FC = () => {
    const [selectedAmount, setSelectedAmount] = useState('3');

    return (
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <h2 className="text-xl text-purple-300 font-semibold">Actions Panel</h2>
                <div className="flex gap-2">
                    <button className="text-purple-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="19" cy="12" r="1"></circle>
                            <circle cx="5" cy="12" r="1"></circle>
                        </svg>
                    </button>
                    <button className="text-purple-300">
                        <ChevronUp size={24} />
                    </button>
                </div>
            </div>

            <ActionItem number={1} title="Will Awaken" defaultOpen={true}>
                <div className="space-y-3">
                    <p className="text-purple-400">Will to Divine</p>
                    <div className="flex justify-between">
                        <p className="text-purple-300 truncate">I seek divine guidance t...</p>
                        <button className="text-purple-300">Detail</button>
                    </div>
                </div>
            </ActionItem>

            <ActionItem number={2} title="Divide To Divine">
                {/* Content for Divide To Divine */}
            </ActionItem>

            <ActionItem number={3} title="Love Into Dao" defaultOpen={true}>
                <div className="space-y-4">
                    <p className="text-purple-400">Select Amount (USDT)</p>
                    <div className="flex gap-2 flex-wrap">
                        {['3', '6', '10', 'Other'].map((amount) => (
                            <AmountButton
                                key={amount}
                                value={amount}
                                selected={selectedAmount === amount}
                                onClick={() => setSelectedAmount(amount)}
                            />
                        ))}
                    </div>

                    <button className="w-full bg-purple-800 hover:bg-purple-700 text-purple-200 py-3 rounded-md flex items-center justify-center gap-2 transition-colors">
                        <DollarSign size={18} />
                        <span>Pay ${selectedAmount}</span>
                    </button>

                    <button className="w-full border border-purple-600 text-purple-300 py-3 rounded-md flex items-center justify-center gap-2 hover:bg-purple-900/30 transition-colors">
                        <Share2 size={18} />
                        <span>Share Result</span>
                    </button>
                </div>
            </ActionItem>
        </div>
    );
};

export default ActionsPanel; 