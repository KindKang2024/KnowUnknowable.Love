// // Transaction Debug Component
// export const TransactionDebug = ({
//     error,
//     isPending,
//     hash,
//     txStatus,
//     simulateError
// }: {
//     error: string;
//     isPending: boolean;
//     hash: string | null;
//     txStatus: string;
//     simulateError?: Error | null;
// }) => {
//     // 处理 BigInt 序列化
//     const serializeBigInt = (obj: any): any => {
//         if (obj === null || obj === undefined) {
//             return obj;
//         }

//         if (typeof obj === 'bigint') {
//             return obj.toString();
//         }

//         if (Array.isArray(obj)) {
//             return obj.map(serializeBigInt);
//         }

//         if (typeof obj === 'object') {
//             const result: any = {};
//             for (const [key, value] of Object.entries(obj)) {
//                 result[key] = serializeBigInt(value);
//             }
//             return result;
//         }

//         return obj;
//     };

//     return (
//         <div className="mt-4 space-y-2 text-sm font-mono bg-gray-50 p-4 rounded-lg">
//             <h3 className="font-bold">Transaction Debug Info</h3>

//             <div>
//                 <div className="text-gray-600">Transaction Status:</div>
//                 <div className="text-blue-600">{txStatus || 'Not started'}</div>
//             </div>

//             {hash && (
//                 <div>
//                     <div className="text-gray-600">Transaction Hash:</div>
//                     <div className="break-all">{hash}</div>
//                 </div>
//             )}

//             {simulateError && (
//                 <div>
//                     <div className="text-gray-600">Simulation Error:</div>
//                     <div className="text-red-600 break-all">{simulateError.message}</div>
//                 </div>
//             )}

//             {error && (
//                 <div>
//                     <div className="text-gray-600">Error:</div>
//                     <div className="text-red-600 break-all">{error}</div>
//                 </div>
//             )}
//         </div>
//     );
// };
