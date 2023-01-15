import { SMM } from './types/SMM';

// Compatiblity shim for calling PluginLoader plugins.
export function getCallPlugin(smm: SMM) {
  return (method: string, args: any) => {
    const cmd = { method: method, args: args };
    smm.Exec.run('python', ['pluginloader.py', 'send', JSON.stringify(cmd)]);
  };
}
