import { Service } from './Service';
declare type Handler<T extends any> = (event: {
    name: string;
    data: T;
}) => void;
export declare class IPC extends Service {
    private readonly ws;
    private listeners;
    constructor(...args: ConstructorParameters<typeof Service>);
    send<T extends any>(name: string, data: T): Promise<{}>;
    on<Data extends any>(name: string, handler: Handler<Data>): void;
    off(name: string): void;
}
export {};
