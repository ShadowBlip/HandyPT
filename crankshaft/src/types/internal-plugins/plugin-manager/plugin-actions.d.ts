import { Plugin } from '../../services/plugins';
import { SMM } from '../../smm';
export declare const usePluginActions: ({ plugin, reloadPlugins, smm, }: {
    plugin: Plugin;
    reloadPlugins: () => Promise<void>;
    smm: SMM;
}) => {
    handleLoad: () => Promise<void>;
    handleUnload: () => Promise<void>;
    handleReload: () => Promise<void>;
    handleRemove: () => Promise<void>;
};
