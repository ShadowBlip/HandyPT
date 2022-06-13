import { Service } from './Service';
declare type ToastLevel = 'error' | 'info' | 'success';
export declare class Toast extends Service {
    private readonly toastEvents;
    constructor(...args: ConstructorParameters<typeof Service>);
    addToast(message: string, level?: ToastLevel, options?: {
        timeout?: number;
    }): void;
}
export {};
