import { SMM } from '../SMM';
import { MenuInjector, MenuItem } from './menu-manager';
export declare class MenuInjectorDesktop implements MenuInjector {
    private readonly smm;
    private menuContainer;
    private modsButton;
    private pageContainer;
    private itemNodes;
    constructor(smm: SMM);
    createMenuItem({ id, label, render }: MenuItem): void;
    removeMenuItem(id: string): void;
    getRootForMenuItem(id: string): HTMLDivElement;
    private injectMenuStyles;
    private createModsButton;
    private createMenuPage;
}
