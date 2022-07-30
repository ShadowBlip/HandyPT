export declare class ConfirmModalCancelledError extends Error {
    constructor();
}
export declare const confirm: (args: Omit<Parameters<typeof createConfirmModal>[0], 'onConfirm' | 'onCancel'>) => Promise<void>;
export declare const createConfirmModal: ({ message, confirmText, confirmBackgroundColour, cancelText, onConfirm, onCancel, backdrop, }: {
    message: string;
    confirmText?: string | undefined;
    confirmBackgroundColour?: string | undefined;
    cancelText?: string | undefined;
    onConfirm: () => void;
    onCancel: () => void;
    backdrop?: boolean | undefined;
}) => {
    modal: HTMLDivElement;
    backdrop: HTMLDivElement | undefined;
};
