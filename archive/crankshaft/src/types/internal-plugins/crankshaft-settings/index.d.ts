import { FunctionComponent } from 'preact';
import { SMM } from '../../smm';
export declare const load: (smm: SMM) => void;
export declare const Setting: FunctionComponent<{
    name: string;
    first?: boolean;
    gpGroupName: string;
}>;
