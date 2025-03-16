// import { ComponentType, useEffect } from 'react'

// import { useUIStore } from '@/stores/uiStore'
// import { useAccount, useConnect } from 'wagmi'
// import { useUnsname, useUserData } from '@/services/api'
// import { useConnectModal } from '@rainbow-me/rainbowkit'

// interface RequirementsConfig {
//     requireConnection?: boolean
//     requireVerification?: boolean
// }

// export function withWeb3Requirements<P extends object>(
//     WrappedComponent: ComponentType<P>,
//     config: RequirementsConfig = { requireConnection: true, requireVerification: false }
// ) {
//     return function WithWeb3RequirementsComponent(props: P) {
//         const { address, isConnected } = useAccount();
//         const { data: uns_domain } = useUnsname(address || '0x');
//         const { openConnectModal } = useConnectModal();
//         const { setVerification } = useUIStore();

//         const canShowWrappedComponent = (!config.requireConnection || isConnected) &&
//             (!config.requireVerification || uns_domain);

//         // Otherwise show the steps UI with active buttons
//         return (
//             <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//                 <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
//                     <div className="flex items-center mb-8">
//                         {/* Step 1 */}
//                         <div className={`flex-1 relative ${isConnected ? 'text-green-500' : 'text-gray-500'}`}>
//                             <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 
//                                 ${isConnected ? 'bg-green-100 border-green-500' : 'border-gray-300'}`}>
//                                 1
//                             </div>
//                             <div className="text-center mt-2 text-sm">Connect Wallet</div>
//                             {!isConnected && (
//                                 <button
//                                     onClick={openConnectModal}
//                                     className="w-full mt-2 rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors text-sm"
//                                 >
//                                     Connect
//                                 </button>
//                             )}
//                         </div>

//                         {/* Connector Line */}
//                         <div className="w-16 h-[2px] bg-gray-300"></div>

//                         {/* Step 2 */}
//                         <div className={`flex-1 relative ${uns_domain ? 'text-green-500' : 'text-gray-500'}`}>
//                             <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 
//                                 ${uns_domain ? 'bg-green-100 border-green-500' : 'border-gray-300'}`}>
//                                 2
//                             </div>
//                             <div className="text-center mt-2 text-sm">Verify UNS</div>
//                             {isConnected && !uns_domain && config.requireVerification && (
//                                 <button
//                                     onClick={() => setVerification(true)}
//                                     className="w-full mt-2 rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition-colors text-sm"
//                                     disabled={!isConnected}
//                                 >
//                                     Verify
//                                 </button>
//                             )}
//                         </div>

//                         {/* Connector Line */}
//                         <div className="w-16 h-[2px] bg-gray-300"></div>

//                         {/* Step 3 - Wrapped Component */}
//                         <div className={`flex-1 relative ${canShowWrappedComponent ? 'text-green-500' : 'text-gray-500'}`}>
//                             <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center border-2 
//                                 ${canShowWrappedComponent ? 'bg-green-100 border-green-500' : 'border-gray-300'}`}>
//                                 3
//                             </div>
//                             <div className="text-center mt-2 text-sm">Continue</div>
//                             {canShowWrappedComponent && (
//                                 <WrappedComponent {...props} />
//                             )}
//                         </div>
//                     </div>

//                     <p className="text-gray-500 text-sm text-center">
//                         {!isConnected
//                             ? "Please connect your wallet to continue"
//                             : !uns_domain && config.requireVerification
//                                 ? "Please verify your UNS name to continue"
//                                 : ""}
//                     </p>
//                 </div>
//             </div>
//         )
//     }
// }
