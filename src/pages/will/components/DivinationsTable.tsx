import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink, CheckCircle2 } from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { ModalType } from "@/types/common";
import { scrollTxLink } from "@/utils/commonUtils";

export enum KnownStatus {
    Unknown = 0,
    KnownRight = 1,
    KnownWrong = 2,
    Deprecated = 3,
}

export interface DivinationsTableColumn {
    key: string;
    header: string;
    cell: (divination: any, commonData?: any) => React.ReactNode;
    className?: string;
}

export interface DivinationsTableProps {
    isLoading: boolean;
    isError: boolean;
    error?: any;
    data: any[];
    columns: DivinationsTableColumn[];
    emptyMessage?: string;
    loadingMessage?: string;
    errorMessage?: string;
    hasNextPage?: boolean;
    isFetchingNextPage?: boolean;
    fetchNextPage?: () => void;
    showMoreButtonText?: string;
    loadingButtonText?: string;
    commonData?: any;
}

export const DivinationsTable: React.FC<DivinationsTableProps> = ({
    isLoading,
    isError,
    error,
    data,
    columns,
    emptyMessage = "No divinations found",
    loadingMessage = "Loading...",
    errorMessage = "Error loading divinations",
    hasNextPage = false,
    isFetchingNextPage = false,
    fetchNextPage,
    showMoreButtonText = "Show More",
    loadingButtonText = "Loading...",
    commonData,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const { openModal } = useUIStore();

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
                        {columns.map((column) => (
                            <TableHead 
                                key={column.key} 
                                className={`text-center text-gray-300 ${column.className || ''}`}
                            >
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {isLoading ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center py-4">
                                <div className="flex justify-center items-center">
                                    <Loader2 className="h-6 w-6 text-gray-400 animate-spin mr-2" />
                                    <span className="text-white/70">{loadingMessage}</span>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center text-red-400 py-4">
                                {errorMessage} {error?.message}
                            </TableCell>
                        </TableRow>
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="text-center text-white/70 py-4">
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((divination, index) => (
                            <TableRow
                                key={index}
                                className="border-b border-gray-800/50 hover:bg-gray-800/30"
                            >
                                {columns.map((column) => (
                                    <TableCell key={`${index}-${column.key}`}>
                                        {column.cell(divination, commonData)}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {hasNextPage && fetchNextPage && (
                <div className="mt-4 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
                    >
                        {isFetchingNextPage ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                <span>{loadingButtonText}</span>
                            </>
                        ) : (
                            showMoreButtonText
                        )}
                    </Button>
                </div>
            )}
        </div>
    );
};

// Common column configurations
export const getCommonColumns = (commonData: any, openModal: (type: ModalType, data?: any) => void, options?: { showVerifyButton?: boolean }) => {
    const willColumn = {
        key: "will",
        header: commonData?.diviFields?.diviWill || "Will",
        cell: (divination: any) => (
            <span className="text-white">{divination.will.substring(0, 10)}...</span>
        ),
    };

    const timeColumn = {
        key: "time",
        header: commonData?.diviFields?.diviTime || "Time",
        cell: (divination: any) => (
            <span className="text-white/70">{new Date(divination.created_at).toLocaleDateString()}</span>
        ),
    };

    const guaColumn = {
        key: "gua",
        header: commonData?.diviFields?.diviGuaProof || "Divination Proof",
        cell: (divination: any) => (
            <div className="text-white/70">
                <span className="text-xl text-bold">{divination.gua.symbol()}</span>
                <span className="text-xs"> with {divination.gua.getMutationsCount()} changes </span>
            </div>
        ),
    };

    const daoTxColumn = {
        key: "dao_tx",
        header: commonData?.diviFields?.daoTx || "DAO Transaction",
        cell: (divination: any) => (
            <div className="text-white/70">
                {divination.dao_tx ? (
                    <a
                        href={scrollTxLink(divination.dao_tx)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-1"
                    >
                        {divination.dao_tx.substring(0, 6)} ... &nbsp;
                        <ExternalLink className="h-3 w-3 inline-block mb-1 text-blue-400" />
                    </a>
                ) : (
                    <span className="text-gray-500 italic text-center block"> - </span>
                )}
            </div>
        ),
    };

    const statusColumn = {
        key: "status",
        header: commonData?.diviFields?.knowDaoStatus || "Proof Verification",
        cell: (divination: any, commonData: any) => (
            <span className={`px-2 py-1 rounded-full text-xs ${
                divination.known_status === KnownStatus.Unknown
                    ? "bg-gray-500/20 text-gray-300"
                    : divination.known_status === KnownStatus.KnownRight
                        ? "bg-green-500/20 text-green-300"
                        : "bg-blue-500/20 text-blue-300"
            }`}>
                {commonData?.epistemicEnums?.[divination.known_status === undefined ? 0 : divination.known_status] || 
                 (divination.known_status === KnownStatus.Unknown ? "Unknown" : "Completed")}
            </span>
        ),
    };

    const actionColumn = {
        key: "action",
        header: commonData?.diviFields?.action || "Action",
        cell: (divination: any, commonData: any) => (
            <div className="flex space-x-2 justify-center">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800/50"
                    onClick={() => openModal(ModalType.ENLIGHTENMENT, divination)}
                >
                    {commonData?.buttons?.details || "View Details"}
                </Button>
                
                {options?.showVerifyButton && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-300 hover:bg-blue-800/30"
                        onClick={() => openModal(ModalType.VERIFICATION, divination)}
                    >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {commonData?.buttons?.verify || "Verify"}
                    </Button>
                )}
            </div>
        ),
    };

    return {
        willColumn,
        timeColumn,
        guaColumn,
        daoTxColumn,
        statusColumn,
        actionColumn
    };
};

export default DivinationsTable; 