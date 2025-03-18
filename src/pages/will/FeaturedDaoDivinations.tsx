import React from "react";
import { useFeaturedDaoDivinations } from "@/services/api";
import { useUIStore } from "@/stores/uiStore";
import { usePageCommonData } from "@/i18n/DataProvider";
import DivinationsTable, { getCommonColumns, KnownStatus } from "@/pages/will/components/DivinationsTable";

export const FeaturedDaoDivinations = () => {
    const commonData = usePageCommonData();

    // Fetch latest public divinations
    const {
        data: featuredResponse,
        isLoading,
        isError,
        error
    } = useFeaturedDaoDivinations();

    const { openModal } = useUIStore();

    // Flatten pages data for rendering
    const flattenedDivinations = featuredResponse?.pages?.flatMap(page => page.data) || [];

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

    // Configure specific columns for this table
    const columns = [
        willColumn,
        timeColumn,
        visibilityColumn,
        statusColumn,
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
            data={flattenedDivinations}
            columns={columns}
            emptyMessage={commonData?.noDivinationsFound || "No featured divinations found"}
            loadingMessage={commonData?.manifesting || "Loading..."}
            errorMessage={commonData?.errorManifesting || "Error loading divinations"}
            commonData={commonData}
        />
    );
};

export default FeaturedDaoDivinations; 