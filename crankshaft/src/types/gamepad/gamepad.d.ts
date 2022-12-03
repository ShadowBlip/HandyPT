import { SMM } from '../smm';
import { GamepadTree } from './tree';
export declare class GamepadHandler {
    private readonly smm;
    private readonly id;
    root: HTMLElement;
    tree: GamepadTree;
    focusPath: string;
    rootExitCallback?: () => void;
    basicHandlerId?: string;
    constructor({ smm, root, rootExitCallback, }: {
        smm: SMM;
        root: HTMLElement;
        rootExitCallback?: GamepadHandler['rootExitCallback'];
    });
    private setup;
    cleanup(): Promise<void>;
    private updateFocused;
    recalculateTree(): void;
    private move;
    private enterGroup;
    private handleButtonPress;
    private handleItemTrigger;
}
