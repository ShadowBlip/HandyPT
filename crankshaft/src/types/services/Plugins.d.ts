import { Entry } from '../SMM';
import { Service } from './Service';
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
    };
    enabled: boolean;
}
export declare class Plugins extends Service {
    list(): Promise<Record<string, Plugin>>;
    injectPlugins(entry: Entry): Promise<{}>;
    setEnabled(id: string, enabled: boolean): Promise<{}>;
    load(pluginName: string): Promise<void>;
    unload(pluginName: string): Promise<void>;
    injectPlugin(pluginId: string): Promise<{}>;
}
export {};
