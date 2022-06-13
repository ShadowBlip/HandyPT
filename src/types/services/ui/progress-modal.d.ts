import { DownloadProgress } from '../Network';
export declare const createProgressModal: ({ displayName, fileName, progress, title, }: {
    displayName: string;
    fileName: string;
    progress: boolean;
    title: string;
}) => {
    open: (cancel: () => void) => void;
    update: ({ progressPercent, progressBytes, finalSizeBytes, }: DownloadProgress) => void;
    close: () => void;
};
