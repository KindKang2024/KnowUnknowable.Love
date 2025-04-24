import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { CommonData, DAOPageData, DataTypes, DiviPageData, IChing, IChingPageData, WillPageData } from './data_types';
import './i18n'; // Import i18n configuration
import { GrokDivineIcon } from '@/components/icons';

// { [key: string]: IChing }
export type IChingGuaMap = { [key: string]: IChing };

const DataContext = createContext({} as DataTypes);

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const { t, i18n, ready } = useTranslation();

    if (!ready) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <GrokDivineIcon className="w-32 h-32" />
            </div>
        )
    }


    const value = i18n.services.resourceStore.data[i18n.language]?.translation as DataTypes;
    // const value = i18n.services.resourceStore.data["en"]?.translation as DataTypes;

    if (!value) {
        console.error('Translation resources not found', i18n.language);
        return <div>Error loading translations</div>;
    }
    console.log("set value", value);
    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};

export const useIChing = (): IChingGuaMap => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useCommonData must be used within a DataProvider');
    }
    return context.iChing;
};

export const useLocaleData = (): DataTypes => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

// export const useDivineSampleData = (): WillPageData => {
//     const context = useContext(DataContext);
//     if (!context) {
//         throw new Error('useDivinationSuggestions must be used within a DataProvider');
//     }
//     return context.ui.willPageData;
// };


export const usePageWillData = (): WillPageData => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useUI must be used within a DataProvider');
    }
    return context.ui.willPageData;
};

export const usePageDaoData = (): DAOPageData => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useUI must be used within a DataProvider');
    }
    return context.ui.daoPageData;
};

export const usePageDiviData = (): DiviPageData => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useUI must be used within a DataProvider');
    }
    return context.ui.diviPageData;
};

export const usePageIChingData = (): IChingPageData => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useUI must be used within a DataProvider');
    }
    return context.ui.iChingPageData;
};

export const usePageCommonData = (): CommonData => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useUI must be used within a DataProvider');
    }
    return context.ui.commonData;
};


export default DataProvider;