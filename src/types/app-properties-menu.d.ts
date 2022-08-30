import { SMM } from './smm';
import { AppPropsApp } from './types/global';
declare type AppPropertiesMenuRender = (smm: SMM, root: HTMLDivElement, app: AppPropsApp) => void | Promise<void>;
interface AppPropertiesMenuItem {
    id: string;
    title: string;
    render?: AppPropertiesMenuRender;
    appIds?: number[];
}
export declare class AppPropertiesMenu {
    private readonly smm;
    private appPropsMenuOpen;
    private gamepad?;
    items: AppPropertiesMenuItem[];
    constructor(smm: SMM);
    addMenuItem(item: AppPropertiesMenuItem): void;
    removeMenuItem(id: string): void;
    private getMenuItems;
}
export {};
