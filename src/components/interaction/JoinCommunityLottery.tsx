// import { useEffect, useState } from 'react';
// import { useAccount, useWriteContract, useWaitForTransactionReceipt, useTransactionReceipt, useClient } from 'wagmi';
// import { TransactionDebug } from './TransactionDebug';
// import React from 'react';
// import { useUnsname } from '@/services/api';
// import { useReadErc20Allowance, useReadErc20BalanceOf, useWriteBaguaDukiDaoContractPayToJoinCommunityAndLottery, useWriteErc20Approve } from '@/contracts/generated';
// import { toast } from '@/hooks/use-toast';
// import { dukiDaoContractConfig } from '@/contracts/externalContracts';
// import { waitForTransactionReceipt } from 'viem/actions';
// import { useQueryClient } from '@tanstack/react-query';
// import { config } from '@/wagmi';

// interface JoinCommunityLotteryModalProps {
//     isOpen: boolean;
//     onClose: () => void;
// }

// export const JoinCommunityLotteryModal = ({ isOpen, onClose }: JoinCommunityLotteryModalProps) => {
//     const queryClient = useQueryClient();
//     const { address } = useAccount();
//     const { data: uns_domain } = useUnsname(address || '0x');

//     const [domain, setDomain] = useState(uns_domain || 'kindkang');
//     const [years, setYears] = useState(3);
//     const [error, setError] = useState('');
//     const [transactionHash, setTransactionHash] = useState<string | null>(null);
//     const [txStatus, setTxStatus] = useState('idle');

//     const { data: payToJoinCommunityLotteryData,
//         writeContractAsync: payToJoinCommunityLottery,
//         isSuccess: payToJoinCommunityLotterySuccess,
//         isPending: payToJoinCommunityLotteryPending,
//         isError: ispayToJoinCommunityLotteryError,
//         error: payToJoinCommunityLotteryError } = useWriteBaguaDukiDaoContractPayToJoinCommunityAndLottery()

//     useEffect(() => {
//         console.log({
//             pending: payToJoinCommunityLotteryPending,
//             success: payToJoinCommunityLotterySuccess,
//             data: payToJoinCommunityLotteryData,
//             isError: ispayToJoinCommunityLotteryError,
//             error: payToJoinCommunityLotteryError,
//         });
//     }, [payToJoinCommunityLotteryPending, ispayToJoinCommunityLotteryError, payToJoinCommunityLotterySuccess]);

//     // Check current allowance
//     const { data: allowance } = useReadErc20Allowance({
//         address: dukiDaoContractConfig.stableCoin,
//         args: [address!, dukiDaoContractConfig.address],
//         query: {
//             enabled: address !== undefined && address !== null
//         }
//     });

//     // Add balance check before approval
//     const { data: balance } = useReadErc20BalanceOf({
//         address: dukiDaoContractConfig.stableCoin,
//         args: [address!],
//         query: {
//             enabled: address !== undefined && address !== null
//         }
//     });

//     console.log('Current balance:', balance);

//     const {
//         // data: approveData,
//         writeContractAsync: approve,
//         // isSuccess: approveSuccess,
//         // isPending: approvePending,
//         // isError: isApproveError,
//         // error: approveError
//     } = useWriteErc20Approve();

//     // useEffect(() => {
//     //     console.log({
//     //         pending: approvePending,
//     //         success: approveSuccess,
//     //         data: approveData,
//     //         isError: isApproveError,
//     //         error: approveError
//     //     });
//     // }, [approvePending, isApproveError, approveSuccess]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setError('');
//         setTransactionHash(null);

//         if (domain === undefined) {
//             toast({
//                 title: 'Please enter your domain',
//                 variant: 'destructive',
//             });
//             return;
//         }

//         try {
//             // First approve USDC spending
//             const joinCommunityLotteryAmount = BigInt(dukiDaoContractConfig.joinCommunityLotteryFee * 10 ** 6);

//             if (balance && balance < joinCommunityLotteryAmount) {
//                 setError(`Insufficient balance: ${balance} < ${joinCommunityLotteryAmount}`);
//                 return;
//             }

//             if ((allowance === undefined || allowance === 0n) || allowance < joinCommunityLotteryAmount) {
//                 setTxStatus('approving');
//                 const approveTx = await approve({
//                     address: dukiDaoContractConfig.stableCoin,
//                     args: [dukiDaoContractConfig.address, joinCommunityLotteryAmount]
//                 });
//                 console.log(approveTx);
//                 // Wait for the transaction to be mined
//                 const approveReceipt = await waitForTransactionReceipt(
//                     config.getClient(),
//                     {
//                         hash: approveTx,
//                         // timeout: 30_000 // Add 60 second timeout
//                     }
//                 );

//                 if (approveReceipt.status === 'success') {
//                     // Transaction was successful
//                     console.log('Approval successful');
//                 } else {
//                     setError('Approval failed');
//                     return;
//                 }

//                 // setTransactionHash(approveTx);
//                 // const { data: approveReceipt } = useWaitForTransactionReceipt({
//                 //     hash: approveTx
//                 // });
//                 // console.log("txReceipt", approveReceipt);
//             }

//             // Then subscribe
//             const txHash = await payToJoinCommunityLottery({
//                 address: dukiDaoContractConfig.address,
//                 args: []
//             });

//             console.log(txHash);

//             // setTransactionHash(subscribeTx);
//             const txReceipt = await waitForTransactionReceipt(
//                 config.getClient(),
//                 {
//                     hash: txHash
//                 });
//             console.log("txReceipt", txReceipt);
//             // setTxStatus('success');
//             if (txReceipt.status === 'success') {
//                 toast({
//                     title: 'Successfully subscribed!',
//                     variant: 'default',
//                 });
//             } else {
//                 setError('Subscription failed');
//                 return;
//             }
//             onClose();
//         } catch (err) {
//             console.log("err", err);
//             setError((err as Error).message);
//             toast({
//                 title: 'Transaction failed',
//                 description: (err as Error).message,
//                 variant: 'destructive',
//             });
//         }
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
//                 <h2 className="text-2xl font-bold mb-4 text-white">Join Community Lottery</h2>
//                 <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
//                         <div className="text-center justify-between">
//                             <span className="text-gray-300 text-base">Entry Fee: </span>
//                             <span className="text-2xl font-bold text-purple-400 ml-2">
//                                 {(dukiDaoContractConfig.joinCommunityLotteryFee)} USDC
//                             </span>
//                         </div>
//                     </div>

//                     <div className="bg-gray-900/50 rounded-lg p-4">
//                         <h3 className="text-white font-medium mb-3">Benefits</h3>
//                         <ul className="space-y-2 text-gray-300">
//                             <li className="flex items-start">
//                                 <span className="text-purple-400 mr-2">•</span>
//                                 Support the DAO and Gain lifetime Lottery Chance
//                             </li>
//                             <li className="flex items-start">
//                                 <span className="text-purple-400 mr-2">•</span>
//                                 Suitable for owners who do not have xxx.unstoppable domain
//                             </li>
//                         </ul>
//                     </div>

//                     {error && (
//                         <div className="text-red-500 text-sm px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
//                             {error || 'An error occurred during the transaction.'}
//                         </div>
//                     )}

//                     <div className="flex justify-end gap-3 pt-2">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-6 py-2.5 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
//                             disabled={txStatus === 'submitted' || txStatus === 'confirming'}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-8 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-500 transition-colors disabled:bg-purple-800 disabled:text-purple-200"
//                             disabled={txStatus === 'submitted' || txStatus === 'confirming'}
//                         >
//                             {txStatus === 'submitted' || txStatus === 'confirming' ? 'Joining...' : 'Join Now'}
//                         </button>
//                     </div>
//                 </form>
//             </div>

//         </div>
//     );
// };
