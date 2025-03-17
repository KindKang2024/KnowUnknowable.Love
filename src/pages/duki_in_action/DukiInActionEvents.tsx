import React, {useState} from 'react';
import {formatDistanceToNow} from 'date-fns';
import {dukiDaoContractConfig} from '@/contracts/externalContracts';
import {useAccount, useChainId} from 'wagmi';
import {useWatchBaguaDukiDaoContractDukiInActionEvent} from '@/contracts/generated';


// enum InteractType {
//     In_To_Divine,
//     In_To_Invest,
//     Out_Claim_As_Duki4World,
//     Out_Claim_As_Duki4Nation,
//     Out_Claim_As_CommunityLottery,
//     Out_Claim_As_Builder,
//     Out_Claim_As_Contributor,
//     Out_Claim_As_Investor,
//     Out_Claim_As_Maintainer,
//     Out_Claim_As_Founder
// }

const InteractTypes = [
    {
        label: 'Divine',
        increase: true
    },
    {
        label: 'Invest',
        increase: true
    },
    {
        label: 'Claim Duki4World',
        increase: true
    },
    {
        label: 'Claim Duki4Nation',
        increase: true
    },
    {
        label: 'Claim Community Lottery',
        increase: true
    },
    {
        label: 'Claim As Builder',
        increase: true
    },
    {
        label: 'Claim As Contributor',
        increase: true
    },
    {
        label: 'Claim As Investor',
        increase: true
    },
    {
        label: 'Claim As Maintainer',
        increase: true
    },
    {
        label: 'Claim As Founder',
        increase: true
    }
]

// convert number to InteractType string

// event DukiInAction(
//     address user,
//     InteractType interactType,
//     uint256 daoEvolveRound,
//     uint256 amount,
//     uint256 unitNumber,
//     uint256 timestamp
// );

interface Transaction {
    timestamp: number;
    txHash: string;
    account: string;
    amount: number;
    interactType: number;
    evolveNum: number;
}

interface TransactionListProps {
    transactions: Transaction[];
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
    return (
        <div className="overflow-x-auto">
            <div className="min-w-[800px]">
                <div className="grid grid-cols-5 text-sm text-gray-500 mb-4 px-4">
                    <div className="text-left">AGE</div>
                    <div className="text-left">Interaction</div>
                    <div className="text-left">AMOUNT</div>
                    <div className="text-left">CREATOR</div>
                    <div className="text-left">TX HASH</div>
                </div>

                {transactions.length > 0 ? (
                    <div className="space-y-2">
                        {transactions.map((tx) => (
                            <div key={tx.txHash} className="grid grid-cols-5 p-4 border border-gray-700 hover:bg-gray-800/50 rounded-lg mb-2">
                                <div className="text-gray-400">
                                    {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: false, includeSeconds: false })}
                                </div>

                                <div className={`${InteractTypes[tx.interactType].increase ? 'text-green-400' : 'text-red-400'}`}>
                                    {InteractTypes[tx.interactType].label}
                                </div>
                                <div className={`${InteractTypes[tx.interactType].increase ? 'text-green-400' : 'text-red-400'}`}>
                                    {InteractTypes[tx.interactType].increase ? '+' : '-'}  {tx.amount.toFixed(2)} USDC
                                </div>
                                <div className="text-gray-400 overflow-hidden text-ellipsis">
                                    <a href={`https://sepolia.etherscan.io/address/${tx.account}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 transition-colors duration-300">
                                        {`${tx.account.slice(0, 6)}...${tx.account.slice(-4)}`}
                                    </a>
                                </div>
                                <div className="text-gray-400 overflow-hidden text-ellipsis">
                                    <a href={`https://sepolia.etherscan.io/tx/${tx.txHash}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors duration-300">
                                        {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-400">
                        No transactions found
                    </div>
                )}
            </div>
        </div>
    );
};


const DukiInActionEvents = ({ chainId }: { chainId: number }) => {
    const [activeTab, setActiveTab] = useState('dao');
    const [almEvents, setAlmEvents] = useState<Transaction[]>([]);
    const [myEvents, setMyEvents] = useState<Transaction[]>([]);
    const { address } = useAccount();

    useWatchBaguaDukiDaoContractDukiInActionEvent({
        address: dukiDaoContractConfig[chainId].address,
        pollingInterval: 6000,
        // enabled: !!address && activeTab === 'dao', // Only poll when address exists and 'me' tab is active
        enabled: true,
        args: {},
        onError(error) {
            console.log('Error!', error)
        },
        fromBlock: 0n,
        onLogs(logs) {
            console.log('logs', logs)
            const newTransactions = logs.map(log => ({
                timestamp: Number(log.args.timestamp) * 1000,
                txHash: log.transactionHash,
                account: log.args.user,
                amount: Number(log.args.amount) / dukiDaoContractConfig[chainId].StableCoinBase,
                interactType: log.args.interactType,
                units: Number(log.args.unitNumber),
                evolveNum: Number(log.args.daoEvolveRound)
            }));

            setAlmEvents(prev => {
                // Filter out duplicates by txHash and sort in descending order by timestamp
                const uniqueTransactions = [...newTransactions, ...prev].filter(
                    (tx, index, self) =>
                        index === self.findIndex(t => t.txHash === tx.txHash)
                ).sort((a, b) => b.timestamp - a.timestamp);
                return uniqueTransactions.slice(0, 10);
            });
        },
    });

    useWatchBaguaDukiDaoContractDukiInActionEvent({
        address: dukiDaoContractConfig[chainId].address,
        pollingInterval: 6000,
        // enabled: !!address && activeTab === 'me', // Only poll when address exists and 'me' tab is active
        enabled: true,
        args: {
            account: address,
        },
        onError(error) {
            console.log('Error!', error)
        },
        fromBlock: 0n,
        onLogs(logs) {
            console.log('logs', logs)
            const newTransactions = logs.map(log => ({
                timestamp: Number(log.args.timestamp) * 1000,
                txHash: log.transactionHash,
                account: log.args.user,
                amount: Number(log.args.amount) / dukiDaoContractConfig[chainId].StableCoinBase,
                interactType: log.args.interactType,
                units: Number(log.args.unitNumber),
                evolveNum: Number(log.args.daoEvolveRound)
            }));

            setMyEvents(prev => {
                // Filter out duplicates by txHash
                const uniqueTransactions = [...newTransactions, ...prev].filter(
                    (tx, index, self) =>
                        index === self.findIndex(t => t.txHash === tx.txHash)
                ).sort((a, b) => b.timestamp - a.timestamp); // Sort in descending order by timestamp
                return uniqueTransactions.slice(0, 10);
            });
        },
    });

    return (
        <div className="mx-auto border border-gray-700 mt-6 rounded-xl p-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    <span className="text-purple-400">DAO IN ACTION</span>
                </h2>
                <p className="text-gray-400 text-sm">Track the latest manifestations as they unfold.</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setActiveTab('dao')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'dao'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    All Transactions
                </button>
                <button
                    onClick={() => setActiveTab('me')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'me'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                >
                    My Transactions
                </button>
            </div>

            {/* Transaction List */}
            <TransactionList
                transactions={activeTab === 'dao' ? almEvents : myEvents}
            />
        </div>
    );
};

export default DukiInActionEvents;