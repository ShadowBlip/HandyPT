export declare type GamepadTree = Record<string, GamepadTreeChild>;
export interface GamepadTreeChild {
    type: 'group' | 'item';
    name: string;
    parentGroup: string;
    el: HTMLElement;
    position: number;
    initialFocus: boolean;
}
export interface GamepadGroup extends GamepadTreeChild {
    type: 'group';
}
export interface GamepadItem extends GamepadTreeChild {
    type: 'item';
    receiveCustomEvents: boolean;
}
export * from './build-tree';
export * from './utils';
