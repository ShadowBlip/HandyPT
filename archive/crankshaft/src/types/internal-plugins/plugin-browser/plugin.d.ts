import { FunctionComponent } from 'preact';
import { Plugin as InstalledPlugin } from '../../services/plugins';
import { SMM } from '../../smm';
import { FetchedPlugin } from './fetch-plugins';
export declare const Plugin: FunctionComponent<FetchedPlugin & {
    first: boolean;
    smm: SMM;
    installedPlugin?: InstalledPlugin;
    updatePlugins: () => Promise<void>;
}>;
