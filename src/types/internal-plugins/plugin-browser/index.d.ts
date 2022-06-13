import { SMM } from '../../SMM';
export declare const load: (smm: SMM) => void;
export interface Plugin {
    id: string;
    name: string;
    version: string;
    author: string;
    source: string;
    archive: string;
    sha256: string;
}
