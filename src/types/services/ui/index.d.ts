import { Service } from '../Service';
import { createProgressModal } from './progress-modal';
export declare class UI extends Service {
    createProgressModal(...args: Parameters<typeof createProgressModal>): {
        open: (cancel: () => void) => void;
        update: ({ progressPercent, progressBytes, finalSizeBytes, }: import("../Network").DownloadProgress) => void;
        close: () => void;
    };
}
