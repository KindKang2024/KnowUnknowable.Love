import React, { useState } from "react";
import { Check, CheckCircle, Pencil, Trash2, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { KnownStatus } from "@/pages/will/components/DivinationsTable";
import { DivinationEntry, useUpdateDivinationStatus } from "@/services/api";
import { useToast } from "@/components/ui/use-toast";
import { useAccount } from 'wagmi';
import { useWriteLoveDaoContractVowDaoManifestation } from '@/contracts/generated';
import { waitForTransactionReceipt } from 'viem/actions';
import { config } from '@/wagmi';
import { defaultChainWhenNotConnected, dukiDaoContractConfig } from '@/contracts/externalContracts';
import { usePageCommonData } from "@/i18n/DataProvider";
import { zeroHash } from 'viem';

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    divination: DivinationEntry;
}

export const VerificationModal = ({
    isOpen,
    onClose,
    divination
}: VerificationModalProps) => {
    const [status, setStatus] = useState<number>(divination?.known_status || KnownStatus.Unknown);
    const [note, setNote] = useState<string>('');
    const [error, setError] = useState('');
    const [txStatus, setTxStatus] = useState('idle');
    const { toast } = useToast();
    const { address, chainId } = useAccount();
    const targetChainId = chainId || defaultChainWhenNotConnected;
    const pageCommonData = usePageCommonData();

    const { writeContractAsync: vowDaoManifestation,
        isSuccess: isVowDaoManifestationSuccess,
        isPending: isVowDaoManifestationPending,
        isError: isVowDaoManifestationError,
        error: vowDaoManifestationError
    } = useWriteLoveDaoContractVowDaoManifestation();

    const { mutateAsync: updateKnownStatus, status: updateKnownStatusState } = useUpdateDivinationStatus({
        onSuccess: () => {
            toast({
                title: "Verification Successful",
                description: "The divination status has been updated.",
            });
            onClose();
        }
    });

    const isSubmitting = updateKnownStatusState === 'pending' || isVowDaoManifestationPending;

    const handleSubmit = async () => {
        setError('');
        setTxStatus('submitting');

        try {
            const manifestationTx = await vowDaoManifestation({
                address: dukiDaoContractConfig[targetChainId]?.address || '0x',
                args: [divination.uuid, status, 0n, 0n, 0, zeroHash, zeroHash]
            });

            // Wait for the transaction receipt
            const manifestationReceipt = await waitForTransactionReceipt(
                config.getClient(),
                {
                    hash: manifestationTx
                }
            );

            if (manifestationReceipt.status === 'success') {
                try {
                    // After successful contract interaction, update the status in the API
                    await updateKnownStatus({
                        uuid: divination.uuid,
                        known_status: status,
                        known_tx: manifestationTx,
                        known_note: note
                    });
                } catch (apiError) {
                    console.error("API Error:", apiError);
                    setError(apiError.message || "Failed to update status in API");
                    return;
                }
            } else {
                setError('Contract interaction failed');
                toast({
                    title: "Verification Failed",
                    description: "The contract interaction failed.",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error("Error verifying divination:", error);
            setError((error as Error).message);
            toast({
                title: "Verification Failed",
                description: (error as Error).message,
                variant: "destructive"
            });
        } finally {
            setTxStatus('idle');
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-[#1A1F2C] border border-white/10 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-[#9b87f5] flex items-center gap-2">
                        <Pencil className="w-5 h-5" />
                        {/* Update Verification Status */}
                        {pageCommonData.modals.updateKnownStatus}
                    </DialogTitle>
                </DialogHeader>

                <div className="py-4">
                    <div className="mb-4">
                        <h3 className="text-white/90 font-medium mb-1">
                            {pageCommonData.diviFields.diviWill}
                        </h3>
                        <p className="text-white/70 text-sm border border-white/10 rounded p-2 bg-black/30">
                            {divination?.will}
                        </p>
                    </div>

                    <p className="text-white/80 text-sm mb-4">
                        {pageCommonData.modals.updateKnownStatusDescription}
                    </p>

                    <div className="space-y-4">
                        <RadioGroup
                            className="space-y-3"
                            value={String(status)}
                            onValueChange={(value) => setStatus(Number(value))}
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="1"
                                    id="verified-correct"
                                    className="border-green-400 text-green-400"
                                />
                                <Label
                                    htmlFor="verified-correct"
                                    className="text-green-300 font-medium flex items-center"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {/* Verified Correct - The divination was proven accurate */}
                                    {pageCommonData.modals.updateKnownStatusVerifiedCorrect}
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="2"
                                    id="verified-incorrect"
                                    className="border-red-400 text-red-400"
                                />
                                <Label
                                    htmlFor="verified-incorrect"
                                    className="text-red-300 font-medium flex items-center"
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    {/* Verified Incorrect - The divination was proven inaccurate */}
                                    {pageCommonData.modals.updateKnownStatusVerifiedIncorrect}
                                </Label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                    value="3"
                                    id="deprecated"
                                    className="border-gray-400 text-gray-400"
                                />
                                <Label
                                    htmlFor="deprecated"
                                    className="text-gray-300 font-medium flex items-center"
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    {/* Deprecated - This divination is no longer relevant */}
                                    {pageCommonData.modals.updateKnownStatusDeprecated}
                                </Label>
                            </div>
                        </RadioGroup>

                        <div className="space-y-2">
                            <Label htmlFor="note" className="text-white/90">
                                {/* Additional Notes (Optional) */}
                                {pageCommonData.modals.updateKnownStatusNote}
                            </Label>
                            <Textarea
                                id="note"
                                placeholder={pageCommonData.modals.updateKnownStatusNotePlaceholder}
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="min-h-[100px] bg-black/30 border-white/10 text-white/90 placeholder:text-white/40 focus:border-purple-500/50"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm mt-2 bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            Error: {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-2 mt-6">
                        <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
                            onClick={onClose}
                            disabled={isSubmitting || txStatus === 'submitting'}
                        >
                            {/* Cancel */}
                            {pageCommonData.buttons.cancel}
                        </Button>

                        <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none"
                            onClick={handleSubmit}
                            disabled={isSubmitting || txStatus === 'submitting'}
                        >
                            {isSubmitting || txStatus === 'submitting' ? (
                                <>
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    {/* Processing... */}
                                    {pageCommonData.modals.processing}
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    {/* Submit Verification */}
                                    {pageCommonData.buttons.submit}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default VerificationModal;