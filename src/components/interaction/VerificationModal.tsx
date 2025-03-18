import React, { useState } from "react";
import { ArrowRightFromLine, Check, CheckCircle, Pencil, XCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { KnownStatus } from "@/pages/will/components/DivinationsTable";

interface VerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    divination: any;
}

export const VerificationModal = ({ 
    isOpen, 
    onClose, 
    divination
}: VerificationModalProps) => {
    const [status, setStatus] = useState<number>(divination?.known_status || KnownStatus.Unknown);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // await verifyDivination(divination.uuid, status);
            onClose();
        } catch (error) {
            console.error("Error verifying divination:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="bg-[#1A1F2C] border border-white/10 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-[#9b87f5] flex items-center gap-2">
                        <Pencil className="w-5 h-5" />
                        Update Verification Status
                    </DialogTitle>
                </DialogHeader>
                
                <div className="py-4">
                    <div className="mb-4">
                        <h3 className="text-white/90 font-medium mb-1">Divination Will:</h3>
                        <p className="text-white/70 text-sm border border-white/10 rounded p-2 bg-black/30">
                            {divination?.will}
                        </p>
                    </div>
                    
                    <p className="text-white/80 text-sm mb-4">
                        Has this divination proven to be correct or incorrect based on real-world outcomes?
                    </p>
                    
                    <RadioGroup 
                        className="space-y-3 mb-4"
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
                                Verified Correct - The divination was proven accurate
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
                                Verified Incorrect - The divination was proven inaccurate
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
                                <ArrowRightFromLine className="h-4 w-4 mr-2" />
                                Deprecated - This divination is no longer relevant
                            </Label>
                        </div>
                    </RadioGroup>
                    
                    <div className="flex justify-end space-x-2 mt-6">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        
                        <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-none"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Check className="h-4 w-4 mr-2" />
                                    Submit Verification
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