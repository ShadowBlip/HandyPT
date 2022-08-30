import { SMM } from '../smm';
import { MenuInjector, MenuItem, MenuManager } from './menu-manager';
export declare class MenuInjectorDeck implements MenuInjector {
    private readonly smm;
    private readonly menuManager;
    private pageContainer;
    private enteredWithNavigate;
    private active?;
    constructor(smm: SMM, menuManager: MenuManager);
    openPage(id: string): Promise<void>;
    closeActivePage(): Promise<void>;
    createMenuItem({ id, label, fontSize }: MenuItem): void;
    removeMenuItem(id: string): void;
    showPageContainer(): void;
    hidePageContainer(): void;
}
