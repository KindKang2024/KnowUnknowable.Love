// import { useLogin, useUserData, useLogout } from "@/services/api";
import {ConnectButton} from "@rainbow-me/rainbowkit";
import {useAccount, useDisconnect} from "wagmi";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle
} from "@/components/ui/dialog";
import {Check, Copy, ExternalLink, Wallet} from "lucide-react";
import {useUIStore} from "@/stores/uiStore";

// Replace with your actual DAO contract address
const DAO_CONTRACT_ADDRESS = "0x1234567890123456789012345678901234567890";

const CustomConnectButton = () => {
    const { address, isConnected } = useAccount();
    const { disconnect } = useDisconnect();
    const [showProfile, setShowProfile] = useState(false);
    const [copied, setCopied] = useState(false);
    const { authStatus, setAuthStatus } = useUIStore();


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDisconnect = () => {
        // if (address) {
        //     // Clear stored authentication state when disconnecting
        //     localStorage.removeItem(`auth-status-${address}`);
        // }
        disconnect();
        setShowProfile(false);
        setAuthStatus('unauthenticated');
    };


    return (
        <ConnectButton.Custom>
            {({
                account,
                chain,
                openConnectModal,
                connectModalOpen,
                mounted,
            }) => {
                const ready = mounted && account;
                const isAuthenticated = authStatus === 'authenticated';
                const isAuthenticating = authStatus === 'loading';
                const isConnectedButNotAuthenticated = ready && !isAuthenticated && !isAuthenticating;

                // Not connected at all
                if (!ready) {
                    return (
                        <Button
                            onClick={openConnectModal}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition-all duration-300 hover:shadow-purple-300/30"
                        >
                            <Wallet className="w-4 h-4 mr-2" />
                            {connectModalOpen ? "Connecting..." : "Connect Wallet"}
                        </Button>
                    );
                }

                if (isConnectedButNotAuthenticated) {
                    return (
                        <Button
                            // disabled
                            onClick={openConnectModal}
                            // onClick={openConnectModal}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition-all duration-300 hover:shadow-purple-300/30"                        >
                            <Wallet className="w-4 h-4 mr-2" />
                            Authenticating...
                        </Button>
                    );
                }

                // Fully authenticated
                return (
                    <>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setShowProfile(true)}
                                className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transition-all duration-300 hover:shadow-purple-300/30"
                            >
                                <div className="flex items-center gap-2">
                                    {account.displayBalance && (
                                        <span className="text-sm font-medium mr-2">
                                            {account.displayBalance}
                                        </span>
                                    )}
                                    <span className="text-sm font-medium">
                                        {account.displayName}
                                    </span>
                                </div>
                            </Button>
                        </div>

                        <Dialog open={showProfile} onOpenChange={setShowProfile}>
                            <DialogOverlay className="bg-black/40 backdrop-blur-sm" />
                            <DialogPortal>
                                <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-2xl shadow-xl">
                                    <DialogHeader>
                                        <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Wallet Profile</DialogTitle>
                                    </DialogHeader>

                                    {/* Wallet Information Section */}
                                    <div className="space-y-6 py-4">
                                        <div className="bg-gray-800/50 rounded-xl p-4 border border-purple-500/10 shadow-inner">
                                            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Wallet Information</h3>

                                            <div className="flex flex-col space-y-4">
                                                {chain && (
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-gray-400">Network</span>
                                                        <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-lg">
                                                            {chain.hasIcon && chain.iconUrl && (
                                                                <img
                                                                    alt={chain.name ?? "Chain icon"}
                                                                    src={chain.iconUrl}
                                                                    className="w-4 h-4 mr-2"
                                                                />
                                                            )}
                                                            <span className="text-sm font-medium text-white">
                                                                {chain.name || chain.id}
                                                                {chain.unsupported && (
                                                                    <span className="text-xs text-red-400 ml-1">
                                                                        (Unsupported)
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-400">Address</span>
                                                    <div className="flex items-center bg-gray-700/50 px-3 py-1 rounded-lg">
                                                        <span className="text-sm font-medium text-white">{account.address?.substring(0, 6)}...{account.address?.substring(account.address.length - 4)}</span>
                                                        <button
                                                            onClick={() => copyToClipboard(account.address || '')}
                                                            className="ml-2 text-purple-300 hover:text-purple-200 p-1 rounded-md hover:bg-purple-500/20 transition-colors"
                                                        >
                                                            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-400">Balance</span>
                                                    <div className="bg-gray-700/50 px-3 py-1 rounded-lg">
                                                        <span className="text-sm font-medium text-white">{account.displayBalance}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-gray-400">Status</span>
                                                    <div className="bg-gray-700/50 px-3 py-1 rounded-lg flex items-center">
                                                        <div className={`w-2 h-2 rounded-full mr-2 ${isAuthenticated ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                                        <span className="text-sm font-medium text-white">
                                                            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* DAO Section - Visually distinct */}
                                        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl p-4 border border-purple-500/20 shadow-lg">
                                            <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase tracking-wider flex items-center">
                                                <span className="bg-purple-500/20 p-1 rounded mr-2">DAO</span>
                                                Information
                                            </h3>

                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-gray-300">DAO Contract</span>
                                                <a
                                                    href={`https://etherscan.io/address/${DAO_CONTRACT_ADDRESS}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-sm font-medium bg-purple-500/20 px-3 py-1 rounded-lg text-purple-300 hover:text-purple-200 transition-colors group"
                                                >
                                                    View on Etherscan
                                                    <ExternalLink className="w-3 h-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-2">
                                            <Button
                                                variant="destructive"
                                                onClick={handleDisconnect}
                                                className="mr-2 bg-red-500/80 hover:bg-red-600 transition-colors"
                                            >
                                                Disconnect
                                            </Button>
                                            <DialogClose asChild>
                                                <Button
                                                    variant="outline"
                                                    className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 transition-colors"
                                                >
                                                    Close
                                                </Button>
                                            </DialogClose>
                                        </div>
                                    </div>
                                </DialogContent>
                            </DialogPortal>
                        </Dialog>
                    </>
                );
            }}
        </ConnectButton.Custom>
    );
};

export default CustomConnectButton;