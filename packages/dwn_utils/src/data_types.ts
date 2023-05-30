import { Encoder } from "@tbd54566975/dwn-sdk-js";

/**
 * Credit for toType() function:
 *   Angus Croll
 *   https://github.com/angus-c
 *   https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
 */
const toType = (obj: any) => {
  return ({} as any).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
};

/**
 * Set/detect the media type and return the data as bytes.
 */
export const dataToBlob = (data: any, dataFormat?: string) => {
  let dataBlob: Blob;

  // Check for Object or String, and if neither, assume bytes.
  const detectedType = toType(data);
  if (dataFormat === 'text/plain' || detectedType === 'string') {
    dataBlob = new Blob([data], { type: 'text/plain' });
  } else if (dataFormat === 'application/json' || detectedType === 'object') {
    const dataBytes = Encoder.objectToBytes(data);
    dataBlob = new Blob([dataBytes], { type: 'application/json' });
  } else if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
    dataBlob = new Blob([data], { type: 'application/octet-stream' });
  } else if (data instanceof Blob) {
    dataBlob = data;
  } else {
    throw new Error('data type not supported.');
  }

  dataFormat = dataFormat || dataBlob.type || 'application/octet-stream';

  return { dataBlob, dataFormat };
};
