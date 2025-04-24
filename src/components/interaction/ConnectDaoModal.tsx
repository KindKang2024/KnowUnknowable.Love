import React, {useState} from "react";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {usePageCommonData} from "@/i18n/DataProvider";
import {DivinationEntry} from "@/services/api";
import {AmountSelect} from "@/components/AmountSelect";
import {DukiInActionToDeepseekDAO} from "@/components/DukiInActionToDeepseekDAO";

interface ConnectDaoModalProps {
    isOpen: boolean;
    onClose: () => void;
    divination: DivinationEntry;
    onModalCallback?: (data: DivinationEntry) => void;
}

export const ConnectDaoModal: React.FC<ConnectDaoModalProps> = ({
    isOpen,
    onClose,
    divination,
    onModalCallback
}) => {
    const commonData = usePageCommonData();

    const [selectedAmount, setSelectedAmount] = useState<number>(1);

    const handleAmountSelect = (amount: number) => {
        setSelectedAmount(amount);
    };

    const handleSuccess = (data: DivinationEntry) => {
        onModalCallback?.(data);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose} modal={true}>
            <DialogContent className="sm:max-w-[425px] bg-gray-900 border-gray-800">
                <DialogHeader>
                    <DialogTitle className="text-white">{commonData.modals.connectDaoTitle}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="text-sm text-indigo-300/80 bg-indigo-950/20 backdrop-blur-sm rounded-md p-2.5 border border-indigo-500/10">
                        {commonData.modals.connectDaoDescription}
                    </div>
                    <AmountSelect
                        amounts={[1, 2, 3]}
                        defaultAmount={selectedAmount}
                        onSelect={handleAmountSelect}
                    />
                    <DukiInActionToDeepseekDAO
                        divination={divination}
                        selectedAmount={selectedAmount}
                        onSuccess={handleSuccess}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}; 