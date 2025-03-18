import React from "react";
import { DEFAULT_PAGE_SIZE, useMyDivinations } from "@/services/api";
import { useUIStore } from "@/stores/uiStore";
import { usePageCommonData } from "@/i18n/DataProvider";
import DivinationsTable, { getCommonColumns } from "@/pages/will/components/DivinationsTable";

export const MyDivinations = () => {
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

    // Get common column configurations with verify button
    const { willColumn, timeColumn, guaColumn, daoTxColumn, statusColumn, actionColumn } = 
        getCommonColumns(commonData, openModal, { showVerifyButton: false });

    // Configure specific columns for this table
    const columns = [
        willColumn,
        timeColumn,
        guaColumn,
        daoTxColumn,
        statusColumn,
        actionColumn
    ];

    return (
        <DivinationsTable
            isLoading={isLoading}
            isError={isError}
            error={error}
            data={flattenedDivinations}
            columns={columns}
            emptyMessage={commonData.noDivinationsFound}
            loadingMessage={commonData.manifesting}
            errorMessage={commonData.errorManifesting}
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            showMoreButtonText={commonData.showMore}
            loadingButtonText={commonData.loading}
            commonData={commonData}
        />
    );
};

export default MyDivinations;