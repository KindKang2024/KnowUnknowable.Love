import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {DEFAULT_PAGE_SIZE, useMyDivinations} from "@/services/api";
import {ExternalLink, Loader2} from "lucide-react";
import {useUIStore} from "@/stores/uiStore";
import {ModalType} from "@/types/common";
import {usePageCommonData} from "@/i18n/DataProvider";
import {scrollTxLink} from "@/utils/commonUtils";

export const MyDivinations = () => {
    const [isVisible, setIsVisible] = useState(false);
    const commonData = usePageCommonData();

    // Fetch my divinations with infinite query
    const {
        data: myDivinations,
        isLoading,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        isError,
        error
    } = useMyDivinations(DEFAULT_PAGE_SIZE);
    const { openModal } = useUIStore();

    // Flatten pages data for rendering
    const flattenedDivinations = myDivinations?.pages?.flatMap(page => page.data) || [];

    // Add fade-in effect when component mounts
    useEffect(() => {
        // Small delay to ensure DOM is ready
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`rounded-xl border border-gray-800 backdrop-blur-sm bg-black/20 p-4 mt-4 transition-opacity duration-300 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-gray-800">
                        <TableHead className="text-center text-gray-300">{commonData.diviFields.diviWill}</TableHead>
                        <TableHead className="text-center text-gray-300">{commonData.diviFields.diviTime}</TableHead>
                        <TableHead className="text-center text-gray-300">{commonData.diviFields.diviGuaProof}</TableHead>
                        <TableHead className="text-center text-gray-300">{commonData.diviFields.daoTx}</TableHead>
                        <TableHead className="text-center text-gray-300">{commonData.diviFields.knowDaoStatus}</TableHead>
                        <TableHead className="text-center text-gray-300">{commonData.diviFields.action}</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow key="loading-row">
                            <TableCell colSpan={5} className="text-center py-4">
                                <div className="flex justify-center items-center">
                                    <Loader2 className="h-6 w-6 text-gray-400 animate-spin mr-2" />
                                    {/* <span className="text-white/70">Loading...</span> */}
                                    <span className="text-white/70">{commonData.manifesting}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow key="error-row">
                            <TableCell colSpan={5} className="text-center text-red-400 py-4">
                                {commonData.errorManifesting} {error.message}
                            </TableCell>
                        </TableRow>
                    ) : flattenedDivinations.length === 0 ? (
                        <TableRow key="empty-row">
                            <TableCell colSpan={5} className="text-center text-white/70 py-4">
                                {commonData.noDivinationsFound}
                            </TableCell>
                        </TableRow>
                    ) : (
                        flattenedDivinations.map((divination, index) => (
                            <TableRow
                                // key={divination.id}
                                key={index}
                                className="border-b border-gray-800/50 hover:bg-gray-800/30"
                            >
                                <TableCell className="text-white">{divination.will.substring(0, 10)}...</TableCell>
                                <TableCell className="text-white/70">{new Date(divination.created_at).toLocaleDateString()}</TableCell>
                                {/* <TableCell className="text-white/70">{divination.visibility === 1 ? commonData.public : commonData.private}</TableCell> */}
                                {/* <TableCell className="text-white/70">{binaryIChingMap[divination.gua.getBinaryString()]?.symbol}</TableCell> */}
                                <TableCell className="text-white/70">
                                    <span className="text-xl text-bold">{divination.gua.symbol()}</span>
                                    <span className="text-xs"> with {divination.gua.getMutationsCount()} changes </span>
                                </TableCell>
                                <TableCell className="text-white/70">
                                    {divination.dao_tx || true ? (
                                        <a
                                            href={scrollTxLink(divination.dao_tx)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="gap-1"
                                        >
                                            {divination.dao_tx ? divination.dao_tx.substring(0, 6) : ''} ... &nbsp;
                                            <ExternalLink className="h-3 w-3 inline-block mb-1 text-blue-400 " />
                                        </a>
                                    ) : (
                                        <span className="text-gray-500 italic text-center block"> - </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${divination.known_status === 1
                                        ? "bg-green-500/20 text-green-300"
                                        : "bg-blue-500/20 text-blue-300"
                                        }`}>
                                        {commonData.epistemicEnums[divination.known_status === undefined ? 0 : divination.known_status]}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
                                        onClick={() => openModal(ModalType.ENLIGHTENMENT, divination)}
                                    >
                                        {commonData.buttons.view}
                                    </Button>

                                    {/* 0: Unknown, 1: Known Right, 2: Known Wrong, 3: Deprecated */}
                                    {divination.known_status === 0 && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
                                        >
                                            {commonData.actionVerify}
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {
                hasNextPage && (
                    <div className="mt-4 flex justify-center">
                        <Button
                            variant="outline"
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
                        >
                            {(() => {
                                if (isFetchingNextPage) {
                                    return (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            <span>{commonData.loading}</span>
                                        </>
                                    );
                                }
                                return commonData.showMore;
                            })()}
                        </Button>
                    </div>
                )
            }
        </div >
    );
};

export default MyDivinations;