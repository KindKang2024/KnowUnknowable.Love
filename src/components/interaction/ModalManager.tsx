// import { SubscribeModal } from './SubscribeModal';
// import { InvestModal } from './InvestModal';
// import { JoinCommunityLotteryModal } from './JoinCommunityLottery';

import {useUIStore} from "@/stores/uiStore";
import {WillDivineAgreementModal} from "./WillDivineAgreementModal.tsx";
import {EnlightenmentModal} from "./EnlightenmentModal.tsx";
import {GuaModal} from "./GuaModal";
import {ModalType} from "@/types/common.ts";
import VerificationModal from "./VerificationModal";
import {InvestModal} from "./InvestModal";
import {ConnectDaoModal} from "@/components/interaction/ConnectDaoModal.tsx";

export const ModalManager = () => {
    const { activeModal, modalData, closeModal } = useUIStore();

    if (!activeModal) return null;

    const modals: Record<ModalType, React.ReactNode> = {
        // connect: <ConnectModal onClose={closeModal} />,
        // subscribe: <SubscribeModal isOpen={true} onClose={closeModal} />,
        [ModalType.WILL_SIGNATURE]: <WillDivineAgreementModal isOpen={true} onClose={closeModal} />,
        [ModalType.ENLIGHTENMENT]: <EnlightenmentModal isOpen={true} onClose={closeModal} entry={modalData} />,
        [ModalType.GUA]: <GuaModal isOpen={true} binary={modalData} onClose={closeModal} />,
        [ModalType.INVEST]: <InvestModal isOpen={true} onClose={closeModal} />,
        [ModalType.VERIFICATION]: <VerificationModal isOpen={true} onClose={closeModal} divination={modalData} />,
        [ModalType.CONNECT_DAO]: (
            <ConnectDaoModal
                isOpen={true}
                onClose={closeModal}
                divination={modalData}
            />
        ),
        // joinCommunityLottery: <JoinCommunityLotteryModal isOpen={true} onClose={closeModal} />,
        // // domain: <DomainInputModal onClose={closeModal} data={modalData} />,
        // invest: <InvestModal isOpen={true} onClose={closeModal} />
    };

    return modals[activeModal as keyof typeof modals] || null;
};