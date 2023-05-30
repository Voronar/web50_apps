import { ProtocolDefinition } from "@tbd54566975/dwn-sdk-js";
import { Web5 } from 'web50';

export const DWN_PROTO_MESSAGE_DATA_FORMAT = 'text/json';
export const DWN_PROTO_MESSAGE_SCHEMA = 'messageSchema';
export const DWN_PROTO_NAME = 'WEB5_DWN_PROTO';
export const DWN_PROTO_PATH_MESSAGE = 'message';

export type DwnProtoMessage = {
  collection: string[],
};

export const DWN_PROTO: ProtocolDefinition = {
  protocol: DWN_PROTO_NAME,
  types: {
    [DWN_PROTO_PATH_MESSAGE]: {
      schema: DWN_PROTO_MESSAGE_SCHEMA,
      dataFormats: [
        DWN_PROTO_MESSAGE_DATA_FORMAT
      ]
    }
  },
  structure: {
    [DWN_PROTO_PATH_MESSAGE]: {
      $actions: [
        {
          who: "anyone",
          can: "write"
        },
        {
          who: "anyone",
          can: "read"
        }
      ]
    }
  }
};

export const LocalDwnEndpoints = ['http://127.0.0.1:3000'];

export async function makeProtoCreateRecord(web5: Web5, data: DwnProtoMessage, recipient: string) {
  const res = await web5.dwn.records.create({
    data,
    message: {
      recipient,
      schema: DWN_PROTO_MESSAGE_SCHEMA,
      dataFormat: DWN_PROTO_MESSAGE_DATA_FORMAT,
      protocol: DWN_PROTO_NAME,
      protocolPath: DWN_PROTO_PATH_MESSAGE,
    },
  });

  return res;
}
