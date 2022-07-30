import { SMM } from '../smm';
declare type buttonInterceptor = Exclude<typeof window['csButtonInterceptors'], undefined>[number];
export declare class ButtonInterceptors {
    private smm;
    constructor(smm: SMM);
    addInterceptor({ id, handler, buttonFilters, }: buttonInterceptor & {
        buttonFilters?: number[];
    }): Promise<void>;
    removeInterceptor(id: string): Promise<void>;
    removeAfter(id: string): Promise<void>;
    interceptorExists(id: string): boolean;
}
export {};
