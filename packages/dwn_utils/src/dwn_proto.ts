import { ProtocolDefinition } from "@tbd54566975/dwn-sdk-js";

export const DWN_PROTO_MESSAGE_DATA_FORMAT = 'text/plain';
export const DWN_PROTO_MESSAGE_SCHEMA = 'messageSchema';
export const DWN_PROTO_NAME = 'WEB5_DWN_PROTO';
export const DWN_PROTO_PATH_MESSAGE = 'message';

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
