export type JsonRpcId = string | number | null;
export type JsonRpcParams = any;
export type JsonRpcVersion = '2.0';

export interface JsonRpcRequest {
  jsonrpc: JsonRpcVersion;
  id?: JsonRpcId;
  method: string;
  params?: any;
}

export const createJsonRpcRequest = (
  id: JsonRpcId,
  method: string,
  params?: JsonRpcParams,
): JsonRpcRequest => {
  return {
    jsonrpc: '2.0',
    id,
    method,
    params,
  };
};
