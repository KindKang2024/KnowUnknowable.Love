import React, {useEffect, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {CheckCircle2, ExternalLink, Eye, Loader2} from "lucide-react";
import {ScrollIcon} from "@/components/icons";
import {useUIStore} from "@/stores/uiStore";
import {ModalType} from "@/types/common";
import {getTxLink} from "@/utils/commonUtils";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {DivinationEntry} from "@/services/api";
import {CommonData} from "@/i18n/data_types";

export enum KnownStatus {
    Unknown = 0,
    KnownRight = 1,
    KnownWrong = 2,
    Deprecated = 3,
}

export interface DivinationsTableColumn {
    key: string;
    header: string;
    cell: (divination: any, commonData?: CommonData) => React.ReactNode;
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
    commonData?: CommonData;
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
export const getCommonColumns = (commonData: CommonData, chainId: number, openModal: (type: ModalType, data: DivinationEntry, onModalCallback?: (data: DivinationEntry) => void) => void, options?: {
    showVerifyButton?: boolean,
    showConnectDaoButton?: boolean,
    onModalCallback?: (data: DivinationEntry) => void
}) => {
    const willColumn = {
        key: "will",
        header: commonData?.diviFields?.diviWill || "Will",
        cell: (divination: any) => {
            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <span className="text-white cursor-help block truncate max-w-[80px] sm:max-w-[80px] md:max-w-[120px] lg:max-w-[180px]">
                                {divination.will}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="max-w-xs break-words whitespace-pre-wrap text-left">{divination.will}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
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
                <div className="text-xl text-bold">{divination.gua.symbol()}</div>
                <div className="text-xs whitespace-nowrap"> {divination.gua.getMutationsCount()}{commonData.changingLines}</div>
            </div>
        ),
    };

    const daoTxColumn = {
        key: "dao_tx",
        header: commonData?.diviFields?.daoTx || "DAO Transaction",
        className: "w-[140px]",
        cell: (divination: any) => (
            <div className="text-white/70 w-full">
                {divination.dao_tx ? (
                    <a
                        href={getTxLink(divination.dao_tx, chainId)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                        <span className="font-mono">{divination.dao_tx.substring(0, 6)}...</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                    </a>
                ) : (
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full px-1.5 py-1 h-7 bg-indigo-950/30 hover:bg-indigo-900/40 text-indigo-300 border-indigo-700/50 transition-all duration-300"
                        onClick={() => openModal(ModalType.CONNECT_DAO, divination, (data: DivinationEntry) => {
                            Object.assign(divination, data);
                        })}
                    >
                        <span className="w-full flex items-center justify-around">
                            <span className="text-xs font-medium truncate">
                                {commonData?.buttons?.connectDao || "Connect DAO"}
                            </span>
                            <ScrollIcon className="h-3 w-3 flex-shrink-0 ml-2 text-yellow-300" />
                        </span>
                    </Button>
                )}
            </div>
        ),
    };

    const statusColumn = {
        key: "status",
        header: commonData?.diviFields?.knowDaoStatus || "Proof Verification",
        cell: (divination: any, commonData: any) => (
            <span className={`px-2 py-1 rounded-full text-xs ${divination.known_status === KnownStatus.Unknown
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
            <div className="flex flex-col space-y-2 justify-center">
                <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800/50 w-full"
                    onClick={() => openModal(ModalType.ENLIGHTENMENT, divination)}
                >
                    <Eye className="h-4 w-4 mr-1" />
                    {commonData?.buttons?.details || "View Details"}
                </Button>

                {options?.showVerifyButton && divination.dao_tx && divination.known_status === KnownStatus.Unknown && (
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-300 hover:bg-blue-800/30 w-full"
                        onClick={() => {
                            // created_at if before one week, show toast can not verify
                            // if (new Date(divination.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000) {
                            //     toast({ variant: "destructive", title: "Verification Failed", description: "You can verify after one week, need time to deepseek the DAO" });
                            // } else {
                            //     openModal(ModalType.VERIFICATION, divination);
                            // }

                            openModal(ModalType.VERIFICATION, divination);
                        }}
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