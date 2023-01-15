import { AppPropertiesMenu } from './app-properties-menu';
import { GamepadHandler } from './gamepad';
import { ButtonInterceptors } from './gamepad/button-interceptors';
import { InGameMenu } from './in-game-menu';
import { MenuManager } from './menu-manager';
import { Apps } from './services/apps';
import { Exec } from './services/exec';
import { FS } from './services/fs';
import { Inject } from './services/inject';
import { IPC } from './services/ipc';
import { Network } from './services/network';
import { Plugins } from './services/plugins';
import { Store } from './services/store';
import { Toast } from './services/toast';
import { UI } from './services/ui';
import { AppPropsApp } from './types/global';
declare type PluginId = string;
declare type SMMEvent = EventSwitchToUnknownPage | EventSwitchToHome | EventSwitchToCollections | EventSwitchToAppDetails | EventSwitchToAppProperties | EventLockScreenOpened | EventLockScreenClosed;
declare class EventSwitchToUnknownPage extends CustomEvent<void> {
    constructor();
}
declare class EventSwitchToHome extends CustomEvent<void> {
    constructor();
}
declare class EventSwitchToCollections extends CustomEvent<void> {
    constructor();
}
declare type eventDetailsSwitchToAppDetails = {
    appId: string;
    appName: string;
};
declare class EventSwitchToAppDetails extends CustomEvent<eventDetailsSwitchToAppDetails> {
    constructor(detail: eventDetailsSwitchToAppDetails);
}
declare class EventSwitchToAppProperties extends CustomEvent<AppPropsApp> {
    constructor(detail: AppPropsApp);
}
declare class EventLockScreenOpened extends CustomEvent<void> {
    constructor();
}
declare class EventLockScreenClosed extends CustomEvent<void> {
    constructor();
}
export declare type Entry = 'library' | 'menu' | 'quickAccess' | 'appProperties';
export declare class SMM extends EventTarget {
    readonly entry: Entry;
    private _currentTab?;
    private _currentAppId?;
    private _currentAppName?;
    private _onLockScreen;
    readonly Network: Network;
    readonly Toast: Toast;
    readonly MenuManager: MenuManager;
    readonly InGameMenu: InGameMenu;
    readonly AppPropertiesMenu: AppPropertiesMenu;
    readonly FS: FS;
    readonly Plugins: Plugins;
    readonly IPC: IPC;
    readonly UI: UI;
    readonly Exec: Exec;
    readonly Inject: Inject;
    readonly Store: Store;
    readonly ButtonInterceptors: ButtonInterceptors;
    readonly Apps: Apps;
    readonly serverPort: string;
    private currentPlugin?;
    private attachedEvents;
    constructor(entry: Entry);
    get currentTab(): "home" | "collections" | "appDetails" | undefined;
    get currentAppId(): string | undefined;
    get onLockScreen(): boolean;
    switchToUnknownPage(): void;
    switchToHome(): void;
    switchToCollections(): void;
    switchToAppDetails(appId: string, appName: string): void;
    switchToAppProperties(app: AppPropsApp, title: string): void;
    lockScreenOpened(): void;
    lockScreenClosed(): void;
    loadPlugins(): Promise<void>;
    loadPlugin(pluginId: PluginId): Promise<void>;
    unloadPlugin(pluginId: PluginId): Promise<void>;
    addEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
    dispatchEvent(event: SMMEvent): boolean;
    closeActivePluginPage(): void;
    private _activeGamepadHandler?;
    get activeGamepadHandler(): GamepadHandler | undefined;
    _setActiveGamepadHandler(gamepadHandler: GamepadHandler | undefined): void;
}
export {};
