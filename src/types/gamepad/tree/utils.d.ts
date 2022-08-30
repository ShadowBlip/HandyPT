import { GamepadGroup, GamepadItem, GamepadTreeChild } from '.';
export declare const isGroup: (child: GamepadTreeChild) => child is GamepadGroup;
export declare const isItem: (child: GamepadTreeChild) => child is GamepadItem;
export declare const selectInGroup: (groupName: string) => string;
export declare const selectGroup: (groupName: string) => string;
export declare const children: (parentGroup: string) => (child: GamepadTreeChild) => boolean;
export declare const siblings: (child: GamepadTreeChild) => (child: GamepadTreeChild) => boolean;
