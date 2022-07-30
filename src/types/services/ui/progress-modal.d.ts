import { DownloadProgress } from '../network';
export declare const createProgressModal: ({ displayName, fileName, progress, title, backdrop, }: {
    displayName: string;
    fileName: string;
    progress: boolean;
    title: string;
    backdrop?: boolean | undefined;
}) => {
    open: (cancel: () => void) => void;
    update: ({ progressPercent, progressBytes, finalSizeBytes, }: DownloadProgress) => void;
    close: () => void;
};
