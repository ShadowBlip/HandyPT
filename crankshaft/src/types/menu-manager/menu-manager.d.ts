import { SMM } from '../smm';
declare type MenuItemRender = (smm: SMM, root: HTMLElement) => void | Promise<void>;
export interface MenuItem {
    id: string;
    label: string;
    fontSize?: number;
    render: MenuItemRender;
}
export interface MenuInjector {
    createMenuItem: (item: MenuItem) => void;
    removeMenuItem: (id: string) => void;
    closeActivePage?: () => void | Promise<void>;
}
export declare class MenuManager {
    private smm;
    menuItems: MenuItem[];
    private injector;
    constructor(smm: SMM);
    reload(): void;
    addMenuItem(item: MenuItem): void;
    removeMenuItem(id: string): void;
    closeActivePage(): Promise<void>;
}
export {};
