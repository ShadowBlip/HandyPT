import { SMM } from '../SMM';
declare type InGameMenuRender = (smm: SMM, root: HTMLElement) => void | Promise<void>;
export interface InGameMenuItem {
    id: string;
    title: string;
    render?: InGameMenuRender;
}
export interface InGameMenuInjector {
    createItem: (item: InGameMenuItem) => void;
    removeItem: (id: string) => void;
}
export declare class InGameMenu {
    private readonly smm;
    items: InGameMenuItem[];
    private injector;
    constructor(smm: SMM);
    addMenuItem(item: InGameMenuItem): void;
    _addMenuItem(item: InGameMenuItem): void;
    removeMenuItem(id: string): void;
    _removeMenuItem(id: string): void;
}
export {};
