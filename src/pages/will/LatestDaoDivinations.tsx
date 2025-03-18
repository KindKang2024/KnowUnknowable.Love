import React from "react";
import { useLatestDaoInActionDivinations } from "@/services/api";
import { useUIStore } from "@/stores/uiStore";
import { usePageCommonData } from "@/i18n/DataProvider";
import DivinationsTable, { getCommonColumns, KnownStatus } from "@/pages/will/components/DivinationsTable";

export const LatestDaoDivinations = () => {
    const commonData = usePageCommonData();

    // Fetch latest public divinations
    const {
        data: latestPublicDivinations = [],
        isLoading,
        isError,
        error
    } = useLatestDaoInActionDivinations();

    const { openModal } = useUIStore();

    // Get common column configurations
    const { willColumn, timeColumn, statusColumn, actionColumn } = getCommonColumns(commonData, openModal);

    // Custom column configurations for this table
    const visibilityColumn = {
        key: "visibility",
        header: "Type",
        cell: (divination: any) => (
            <span className="text-white/70">{divination.visibility === 1 ? (commonData?.public || "Public") : (commonData?.private || "Private")}</span>
        ),
    };

    // Status column overridden to handle numeric KnownStatus instead of string
    const fixedStatusColumn = {
        ...statusColumn,
        cell: (divination: any) => (
            <span className={`px-2 py-1 rounded-full text-xs ${
                divination.known_status === KnownStatus.Unknown
                    ? "bg-gray-500/20 text-gray-300"
                    : divination.known_status === KnownStatus.KnownRight
                        ? "bg-green-500/20 text-green-300"
                        : "bg-blue-500/20 text-blue-300"
            }`}>
                {commonData?.epistemicEnums?.[divination.known_status] || 
                 (divination.known_status === KnownStatus.Unknown ? "Unknown" : "Completed")}
            </span>
        ),
    };

    // Configure specific columns for this table
    const columns = [
        willColumn,
        timeColumn,
        visibilityColumn,
        fixedStatusColumn,
        actionColumn
    ];

    const modifiedWillColumn = {
        ...willColumn,
        cell: (divination: any) => (
            <span className="text-white">{divination.will.substring(0, 30)}...</span>
        ),
    };

    // Update columns with modified willColumn
    columns[0] = modifiedWillColumn;

    return (
        <DivinationsTable
            isLoading={isLoading}
            isError={isError}
            error={error}
            data={latestPublicDivinations}
            columns={columns}
            emptyMessage={commonData?.noDivinationsFound || "No divinations found"}
            loadingMessage={commonData?.manifesting || "Loading..."}
            errorMessage={commonData?.errorManifesting || "Error loading divinations"}
            commonData={commonData}
        />
    );
};

export default LatestDaoDivinations; 