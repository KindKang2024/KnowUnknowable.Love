// import { SubscribeModal } from './SubscribeModal';
// import { InvestModal } from './InvestModal';
// import { JoinCommunityLotteryModal } from './JoinCommunityLottery';

import {useUIStore} from "@/stores/uiStore";
import {LoginModal} from "./LoginModal";
import {WillSignatureModal} from "./WillSignatureModal";
import {EnlightenmentModal} from "./EnlightenmentModal.tsx";
import {GuaModal} from "./GuaModal";
import {ModalType} from "@/types/common.ts";
import VerificationModal from "./VerificationModal";

export const ModalManager = () => {
    const { activeModal, modalData, closeModal } = useUIStore();

    if (!activeModal) return null;

    const modals: Record<ModalType, React.ReactNode> = {
        // connect: <ConnectModal onClose={closeModal} />,
        // subscribe: <SubscribeModal isOpen={true} onClose={closeModal} />,
        [ModalType.LOGIN]: <LoginModal isOpen={true} onClose={closeModal} />,
        [ModalType.WILL_SIGNATURE]: <WillSignatureModal isOpen={true} onClose={closeModal} />,
        [ModalType.ENLIGHTENMENT]: <EnlightenmentModal isOpen={true} onClose={closeModal} entry={modalData} />,
        [ModalType.GUA]: <GuaModal isOpen={true} binary={modalData} onClose={closeModal} />,
        [ModalType.INVEST]: <div>Invest Modal Placeholder</div>,
        [ModalType.VERIFICATION]: <VerificationModal isOpen={true} onClose={closeModal} divination={modalData} />,
        // joinCommunityLottery: <JoinCommunityLotteryModal isOpen={true} onClose={closeModal} />,
        // // domain: <DomainInputModal onClose={closeModal} data={modalData} />,
        // invest: <InvestModal isOpen={true} onClose={closeModal} />
    };

    return modals[activeModal as keyof typeof modals] || null;
};