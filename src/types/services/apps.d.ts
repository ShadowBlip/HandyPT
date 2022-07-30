import { Service } from './service';
interface AppDetails {
    appId: number;
    name: string;
    _fullDetails: Record<string, any>;
}
export declare class Apps extends Service {
    constructor(...args: ConstructorParameters<typeof Service>);
    getCachedDetailsForApp(appId: number): Promise<AppDetails | undefined>;
}
export {};
