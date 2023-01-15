import { Entry } from '../smm';
import { Service } from './service';
interface Entrypoint {
    library: boolean;
    menu: boolean;
}
export interface Plugin {
    id: string;
    dir: string;
    config: {
        name: string;
        version: string;
        link: string;
        source: string;
        author: {
            name: string;
            link: string;
        };
        entrypoints: {
            desktop: Entrypoint;
            deck: Entrypoint;
        };
        store: {
            description?: string;
        };
    };
    enabled: boolean;
}
export declare class Plugins extends Service {
    list(): Promise<Record<string, Plugin>>;
    injectPlugins(entry: Entry): Promise<{}>;
    setEnabled(id: string, enabled: boolean): Promise<{}>;
    remove(pluginId: string): Promise<{}>;
    load(pluginId: string): Promise<void>;
    unload(pluginId: string): Promise<void>;
    injectPlugin(pluginId: string): Promise<{}>;
    reloadPlugin(pluginId: string): Promise<void>;
}
export {};
