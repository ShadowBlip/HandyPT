import { Service } from './Service';
export declare class NetworkGetError extends Error {
    readonly status: number;
    constructor(status: number);
}
export declare class NetworkDownloadCancelledError extends Error {
    constructor();
}
export declare class NetworkDownloadTimeoutError extends Error {
    constructor();
}
export interface DownloadProgress {
    finalSizeBytes: number;
    progressBytes: number;
    progressPercent: number;
}
interface DownloadArgs {
    url: string;
    path: string;
    id: string;
    timeoutSeconds: number;
}
export declare class Network extends Service {
    get errors(): {
        NetworkGetError: typeof NetworkGetError;
        NetworkDownloadCancelledError: typeof NetworkDownloadCancelledError;
        NetworkDownloadTimeoutError: typeof NetworkDownloadTimeoutError;
    };
    get<T>(url: string): Promise<T>;
    download({ url, path, timeoutSeconds, progressCallback, checkProgressInterval, }: Omit<DownloadArgs, 'id'> & {
        progressCallback?: (progress: DownloadProgress) => void;
        checkProgressInterval?: number;
    }): {
        cancel: () => void;
        download: () => Promise<void>;
        id: any;
    };
    checkDownloadProgress(id: string): Promise<DownloadProgress>;
}
export {};
