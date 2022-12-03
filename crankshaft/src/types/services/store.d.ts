import { Service } from './service';
export declare class Store extends Service {
    get(pluginId: string, key: string): Promise<string | undefined>;
    set(pluginId: string, key: string, value: string): Promise<{}>;
}
