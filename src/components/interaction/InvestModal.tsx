// import { useEffect, useState } from 'react';
// import { useAccount, useWriteContract, useWaitForTransactionReceipt, useTransactionReceipt, useClient } from 'wagmi';
// import { TransactionDebug } from './TransactionDebug';
// import React from 'react';
// import { useUnsname } from '@/services/api';
// import { useReadErc20Allowance, useReadErc20BalanceOf, useWriteBaguaDukiDaoContractPayToInvestUnsInLimo, useWriteBaguaDukiDaoContractpayToInvest, useWriteErc20Approve } from '@/contracts/generated';
// import { toast } from '@/hooks/use-toast';
// import { dukiDaoContractConfig } from '@/contracts/externalContracts';
// import { waitForTransactionReceipt } from 'viem/actions';
// import { useQueryClient } from '@tanstack/react-query';
// import { config } from '@/wagmi';

// interface InvestModalProps {
//     isOpen: boolean;
//     onClose: () => void;
// }

// export const InvestModal = ({ isOpen, onClose }: InvestModalProps) => {
//     const queryClient = useQueryClient();
//     const { address } = useAccount();
//     const { data: uns_domain } = useUnsname(address || '0x');

//     const [domain, setDomain] = useState(uns_domain || 'kindkang');
//     const [years, setYears] = useState(3);
//     const [error, setError] = useState('');
//     const [transactionHash, setTransactionHash] = useState<string | null>(null);
//     const [txStatus, setTxStatus] = useState('idle');

//     const { data: payToInvestData,
//         writeContractAsync: payToInvest,
//         isSuccess: payToInvestSuccess,
//         isPending: payToInvestPending,
//         isError: ispayToInvestError,
//         error: payToInvestError } = useWriteBaguaDukiDaoContractPayToInvestUnsInLimo()

//     useEffect(() => {
//         console.log({
//             pending: payToInvestPending,
//             success: payToInvestSuccess,
//             data: payToInvestData,
//             isError: ispayToInvestError,
//             error: payToInvestError,
//         });
//     }, [payToInvestPending, ispayToInvestError, payToInvestSuccess]);

//     // Check current allowance
//     const { data: allowance } = useReadErc20Allowance({
//         address: dukiDaoContractConfig.stableCoin,
//         args: [address!, dukiDaoContractConfig.address],
//     });

//     // Add balance check before approval
//     const { data: balance } = useReadErc20BalanceOf({
//         address: dukiDaoContractConfig.stableCoin,
//         args: [address!]
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

//         const investFee = BigInt(dukiDaoContractConfig.investFee * 10 ** 6);

//         try {
//             // First approve USDC spending
//             if (balance && balance < dukiDaoContractConfig.investFee) {
//                 setError(`Insufficient balance: ${balance} < ${dukiDaoContractConfig.investFee}`);
//                 return;
//             }

//             if ((allowance === undefined || allowance === 0n) || allowance < investFee) {
//                 setTxStatus('approving');
//                 const approveTx = await approve({
//                     address: dukiDaoContractConfig.stableCoin,
//                     args: [dukiDaoContractConfig.address, investFee]
//                 });
//                 console.log(approveTx);
//                 // Wait for the transaction to be mined
//                 const approveReceipt = await waitForTransactionReceipt(
//                     config.getClient(),
//                     {
//                         hash: approveTx,
//                     }
//                 );

//                 if (approveReceipt.status === 'success') {
//                     // Transaction was successful
//                     console.log('Approval successful');
//                 } else {
//                     setError('Approval failed');
//                     return;
//                 }
//             }

//             // Then subscribe
//             const subscribeTx = await payToInvest({
//                 address: dukiDaoContractConfig.address,
//                 args: [domain]
//             });

//             console.log(subscribeTx);

//             // setTransactionHash(subscribeTx);
//             const subscribeReceipt = await waitForTransactionReceipt(
//                 config.getClient(),
//                 {
//                     hash: subscribeTx
//                 });
//             console.log("subscribeReceipt", subscribeReceipt);
//             // setTxStatus('success');
//             if (subscribeReceipt.status === 'success') {
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
//                 <h2 className="text-2xl font-bold mb-4 text-white">Invest On Your Domain</h2>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium mb-2 text-gray-200">
//                             Domain Name
//                         </label>
//                         <div className="flex items-center">
//                             <input
//                                 type="text"
//                                 value={domain || ''}
//                                 onChange={(e) => setDomain(e.target.value)}
//                                 className="flex-1 p-2 bg-gray-700 text-white rounded-l border border-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                                 placeholder="Enter your domain prefix"
//                             />
//                             <span className="p-2 bg-gray-600 text-gray-300 rounded-r border border-l-0 border-gray-600">
//                                 .unstoppable
//                             </span>
//                         </div>
//                     </div>


//                     <div className="text-sm text-gray-300">
//                         Investment Amount: {dukiDaoContractConfig.investFee.toString()} USDC
//                     </div>

//                     {error && (
//                         <div className="text-red-500 text-sm mt-2">
//                             Error: {error || 'An error occurred during the transaction.'}
//                         </div>
//                     )}
//                     {/* {approveError && (
//                         <div className="text-red-500 text-sm mt-2">
//                             {typeof approveError === 'string' ? approveError : approveError.message || 'An error occurred during token approval.'}
//                         </div>
//                     )} */}

//                     <div className="rounded-lg space-y-3 mb-4">
//                         <h3 className="text-white font-medium">Why Becoming an Investor:</h3>
//                         <ul className="list-disc list-outside text-gray-300 space-y-2">
//                             <li>Gain lifetime DNS management access for the domain</li>
//                             <li>The owner of the invested domain will share 10% of all revenues in the DAO. (Do not expect too high returns, treat it as a good way to get involved in the DAO.)</li>
//                         </ul>
//                     </div>

//                     <div className="flex justify-end gap-2">
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
//                             disabled={txStatus === 'submitted' || txStatus === 'confirming'}
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             type="submit"
//                             className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors disabled:bg-purple-400"
//                             disabled={txStatus === 'submitted' || txStatus === 'confirming'}
//                         >
//                             {txStatus === 'submitted' || txStatus === 'confirming' ? 'Processing...' : 'Become an Investor Now'}
//                         </button>
//                     </div>
//                 </form>
//                 {/* <TransactionDebug
//                     error={error}
//                     isPending={txStatus === 'submitted' || txStatus === 'confirming'}
//                     hash={transactionHash}
//                     txStatus={txStatus}
//                 /> */}
//             </div>

//         </div>
//     );
// };
