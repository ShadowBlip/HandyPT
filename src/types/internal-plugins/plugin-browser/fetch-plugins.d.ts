import { Plugin as InstalledPlugin } from '../../services/plugins';
import { SMM } from '../../smm';
export interface FetchedPlugin {
    id: string;
    name: string;
    version: string;
    link: string;
    source: string;
    minCrankshaftVersion?: string;
    author: {
        name: string;
        link?: string;
    };
    store: {
        description?: string;
    };
    archive: string;
    sha256: string;
    installedPlugin?: InstalledPlugin;
}
export declare const fetchPlugins: (smm: SMM, refresh?: boolean) => Promise<FetchedPlugin[]>;
