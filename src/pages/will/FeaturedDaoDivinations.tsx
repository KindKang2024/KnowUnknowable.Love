import React from "react";
import {useFeaturedDaoDivinations} from "@/services/api";
import {useUIStore} from "@/stores/uiStore";
import {usePageCommonData} from "@/i18n/DataProvider";
import DivinationsTable, {getCommonColumns} from "@/pages/will/components/DivinationsTable";
import {useAccount} from "wagmi";
import {defaultChainWhenNotConnected} from "@/contracts/externalContracts";
import {useIsMobile} from "@/hooks/use-mobile";

export const FeaturedDaoDivinations = () => {
    const commonData = usePageCommonData();
    const isMobile = useIsMobile();
    // Fetch latest public divinations
    const {
        data: featuredResponse,
        isLoading,
        isError,
        error
    } = useFeaturedDaoDivinations();

    const { openModal } = useUIStore();
    const { chainId } = useAccount();
    const targetChainId = chainId || defaultChainWhenNotConnected;

    // Flatten pages data for rendering
    const flattenedDivinations = featuredResponse?.pages?.flatMap(page => page.data) || [];

    // Get common column configurations
    const { willColumn, timeColumn, statusColumn, actionColumn, guaColumn } = getCommonColumns(commonData, targetChainId, openModal);

    // Custom column configurations for this table
    const visibilityColumn = {
        key: "visibility",
        header: "Type",
        cell: (divination: any) => (
            <span className="text-white/70">{divination.visibility === 1 ? (commonData?.public || "Public") : (commonData?.private || "Private")}</span>
        ),
    };

    // Configure specific columns for this table
    const columns = isMobile ? [
        willColumn,
        guaColumn,
        actionColumn
    ] : [
        willColumn,
        guaColumn,
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