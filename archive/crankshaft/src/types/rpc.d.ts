export declare class RpcRequestError extends Error {
    readonly status?: number;
    constructor(status?: number);
}
export declare class RpcRequestCancelledError extends Error {
    constructor();
}
export declare const rpcRequest: <Params, Response_1>(method: string, params: Params) => {
    getRes: () => Promise<Response_1>;
    cancel: () => void;
};
