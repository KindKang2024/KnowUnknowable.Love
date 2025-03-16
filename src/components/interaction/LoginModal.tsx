import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,} from "@/components/ui/dialog";
import {useUIStore} from "@/stores/uiStore";
import {useConnectModal} from "@rainbow-me/rainbowkit";
import {useAccount} from "wagmi";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
    const { address, isConnected } = useAccount();
    // const { data: userData } = useUserData(address || '0x');
    const { authStatus, setAuthStatus } = useUIStore();

    const { openConnectModal } = useConnectModal();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-2xl font-bold">Sign in to continue</DialogTitle>
                    </div>
                    <DialogDescription>
                        Create an account or sign in to send messages
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-3 py-4">
                    <Button variant="outline" className="w-full py-6"
                        onClick={() => {
                            openConnectModal();
                            onClose();
                        }}>
                        Connect Wallet
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}; 