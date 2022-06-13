import { Plugin } from '.';
import { SMM } from '../../SMM';
export declare const useInstallPlugin: (smm: SMM, plugin: Plugin, updatePlugins: () => Promise<void>) => () => void;
