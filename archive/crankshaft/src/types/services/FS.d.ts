import { Service } from './Service';
export declare class FS extends Service {
    listDir(path: string): Promise<{
        name: string;
        isDir: boolean;
    }[]>;
    mkDir(path: string, parents?: boolean): Promise<{}>;
    readFile(path: string): Promise<string>;
    untar(tarPath: string, destPath: string): {
        getRes: () => Promise<void>;
        cancel: () => void;
    };
    getPluginsPath(): Promise<string>;
}
