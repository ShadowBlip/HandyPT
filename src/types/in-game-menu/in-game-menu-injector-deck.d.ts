import { SMM } from '../SMM';
import { InGameMenu, InGameMenuInjector, InGameMenuItem } from './in-game-menu';
export declare class InGameMenuInjectorDeck implements InGameMenuInjector {
    private readonly smm;
    private readonly inGameMenu;
    constructor(smm: SMM, inGameMenu: InGameMenu);
    createItem(item: InGameMenuItem): void;
    removeItem(id: string): void;
}
