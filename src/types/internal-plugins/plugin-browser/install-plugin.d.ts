import { SMM } from '../../smm';
import { FetchedPlugin } from './fetch-plugins';
export declare const useInstallPlugin: (smm: SMM, plugin: FetchedPlugin, updatePlugins: () => Promise<void>) => () => void;
