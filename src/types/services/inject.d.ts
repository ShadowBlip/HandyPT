import { AppPropsApp } from '../types/global';
import { Service } from './service';
export declare class Inject extends Service {
    injectAppProperties(app: AppPropsApp, title: string): Promise<{}>;
}
