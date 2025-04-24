import { useAccount, useSignMessage } from 'wagmi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "../ui/dialog";
import { useDivinationStore } from "@/stores/divineStore";
import { NiceButton } from "../ui/styled/nice-button";
import { Info } from 'lucide-react';
import { usePageCommonData } from '@/i18n/DataProvider';

interface AgreementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const WillDivineAgreementModal = ({ isOpen, onClose }: AgreementModalProps) => {
    const { will: divinationText, willSignature: signature, setWillSignature } = useDivinationStore();
    const { signMessageAsync, isPending, error } = useSignMessage();
    const { address } = useAccount();

    const commonPageData = usePageCommonData();

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
                className="bg-gradient-to-br from-[#1A1F2C] to-[#2a2f3c] border border-[#9b87f5]/20 fixed z-50 pointer-events-auto rounded-lg shadow-xl p-6 max-w-lg mx-auto"
                onPointerDownOutside={(e) => {
                    e.preventDefault();
                }}
            >
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-[#c2b7f9] text-center">
                        {/* Divine Agreement */}
                        {commonPageData.modals.divineAgreement}

                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <div className="p-2 rounded-md bg-[#1F2432]/50">
                        <div className="text-white/80 space-y-1">
                            <p className="text-sm text-red-500/90">
                                {/* By using this site for divination, you affirm your intent is honest, faithful, and righteous. Otherwise, reconsider participating. */}
                                {commonPageData.modals.consentPoints[0]}
                            </p>
                            <p className="text-xs text-white/70">
                                {/* You understand that the I Ching offers no direct answers, only glimpses—like a zero-knowledge proof—gently guiding us toward the Divine Will.  */}
                                {commonPageData.modals.consentPoints[1]}
                            </p>
                            <p className="text-xs text-white/60 mt-1.5 pt-1.5 border-t border-white/10">
                                <Info className="h-3.5 w-3.5 mr-1 inline shrink-0 text-red-500" />
                                {/* This site is a proof of concept for 'DUKI in action'. It offers no guarantees about service availability, and most of your divination data is also recorded on the ZK-Chain Scroll once connected to the DAO.
                                We make no claims about the truth or falsity of I Ching divination, as we indeed know nothing. The Unknowable remains beyond reach—there is always more unknown beyond any known unknown. We can only seek it humbly, with love. */}
                                {commonPageData.modals.consentPoints[2]}
                            </p>
                        </div>
                    </div>

                    <div className="p-2 rounded-md bg-[#1F2432]/50">
                        <label className="text-xs font-medium text-[#9b87f5]/60 block mb-1">
                            {/* Will Content */}
                            {commonPageData.diviFields.diviWill}
                        </label>
                        <div className="text-sm text-white/80 break-words whitespace-pre-wrap bg-[#151923] p-2 rounded font-mono text-xs">
                            {divinationText}
                        </div>
                    </div>

                    <div className="p-2 rounded-md bg-[#1F2432]/50">
                        <label className="text-xs font-medium text-[#9b87f5]/60 block mb-1">
                            {/* Agreement Signature */}
                            {commonPageData.modals.agreementSignatureLabel}
                        </label>
                        <div className="mt-1.5 flex items-center justify-between">
                            {signature ? (
                                <div className="text-xs text-green-400/80 bg-[#151923] p-1.5 rounded font-mono break-all whitespace-pre-wrap flex-grow mr-3">
                                    {signature}
                                </div>
                            ) : (
                                <div className="text-sm text-amber-400/80 flex-grow mr-3 italic text-xs">
                                    {/* Awaiting your signature... */}
                                    {commonPageData.modals.awaitingSignatureLabel}
                                </div>
                            )}
                            {!signature && (
                                <NiceButton
                                    onClick={handleSignMessage}
                                    disabled={isPending || !divinationText}
                                    className={`px-3 py-1.5 text-xs ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {/* {isPending ? 'Signing...' : 'Sign Will'} */}
                                    {isPending ? commonPageData.modals.signingLabel : commonPageData.modals.signAgreementButton}
                                </NiceButton>
                            )}
                        </div>
                        {error && (
                            <p className="text-xs text-red-500/80 mt-1.5">
                                Error signing: {error.message}
                            </p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}; 