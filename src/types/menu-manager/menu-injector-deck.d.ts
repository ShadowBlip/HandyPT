import { MenuManager } from '.';
import { SMM } from '../SMM';
import { MenuInjector } from './menu-manager';
export declare class MenuInjectorDeck implements MenuInjector {
    private readonly smm;
    private readonly menuManager;
    private page;
    private pageContainer;
    constructor(smm: SMM, menuManager: MenuManager);
    createMenuItem({ id, label, fontSize, }: {
        id: string;
        label: string;
        fontSize?: number | undefined;
    }): void;
    removeMenuItem(id: string): void;
    private createMenuPage;
}
