import {Button} from "../ui/button";
import {useAccount, useSignMessage} from 'wagmi';
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from "../ui/dialog";
import {useDivinationStore} from "@/stores/divineStore";

interface WillSignatureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WillSignatureModal = ({ isOpen, onClose }: WillSignatureModalProps) => {
    const { will: divinationText, willSignature: signature, setWillSignature } = useDivinationStore();
    const { signMessageAsync, isPending, error } = useSignMessage();
    const { address } = useAccount();

    const handleSignMessage = async () => {
        // 不诚不占 不义不占 不疑不占
        const signature = await signMessageAsync({
            message: divinationText,
            account: address
        });
        console.log('signature:', signature);
        if (signature) {
            setWillSignature(signature);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="bg-[#1A1F2C] border border-white/10 fixed z-50 pointer-events-auto"
                onPointerDownOutside={(e) => {
                    // Prevent events from propagating to elements underneath
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-[#9b87f5]">Divine Will Agreement Signature</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <label className="text-xs text-[#9b87f5]/60">Will Content</label>
                        <div className="text-white/80 break-words whitespace-pre-wrap">
                            {divinationText}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-[#9b87f5]/60">Divinable Prerequisites</label>
                        <div className="text-white/80">不诚不占 不义不占 不疑不占</div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-[#9b87f5]/60">Modern Interpretation</label>
                        <div className="text-white/80">
                            Maybe the unknownable is doing this kind of zero knowledge to us, who knows?
                            Believe nothing, verify everything.
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs text-[#9b87f5]/60">Signature</label>
                        <div className="text-white/80">
                            {signature ? (
                                <div className="text-white/80">
                                    <div className="break-all whitespace-pre-wrap">
                                        Signature: {signature.slice(0, 10)}...{signature.slice(-10)}
                                    </div>
                                </div>
                            ) : (
                                <Button onClick={handleSignMessage} disabled={isPending}>
                                    {isPending ? 'Signing...' : 'Sign'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}; 