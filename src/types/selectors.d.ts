export declare const SHARED_SELECTORS: {
    appDetails: string;
    appDetailsHeader: string;
    appDetailsName: string;
};
export declare const DESKTOP_SELECTORS: {
    collections: string;
    appDetailsStoreLink: string;
    selectedEntry: string;
};
export declare const DECK_SELECTORS: {
    appDetailsHeaderImg: string;
    lockScreenContainer: string;
    quickAccessContainer: string;
};
declare const MODE_SELECTORS: {
    mainLibrary: {
        desktop: string;
        deck: string;
    };
    home: {
        desktop: string;
        deck: string;
    };
};
export declare const getSelectorByMode: (name: keyof typeof MODE_SELECTORS) => string;
export {};
