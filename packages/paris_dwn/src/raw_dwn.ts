import { createJsonRpcRequest, dataToBlob } from "@web50/dwn_utils";
import { PrivateJwk, PublicJwk, RecordsQuery, RecordsRead, RecordsWrite, SignatureInput } from "@tbd54566975/dwn-sdk-js";
import { DidKeyResolver } from '@tbd54566975/dwn-sdk-js';
import { v4 as uuidv4 } from 'uuid';

export type Profile = {
  did: string;
  keyPair: {
    publicJwk: PublicJwk,
    privateJwk: PrivateJwk
  },
  signatureInput: SignatureInput
}

export async function createProfile(): Promise<Profile> {
  const { did, keyPair, keyId } = await DidKeyResolver.generate();

  // signatureInput is required by all dwn message classes. it's used to sign messages
  const signatureInput = {
    privateJwk: keyPair.privateJwk,
    protectedHeader: {
      alg: keyPair.privateJwk.alg || '',
      kid: `${did}#${keyId}`,
    },
  };

  return {
    did,
    keyPair,
    signatureInput
  };
}

export function randomBytes(length: number): Uint8Array {
  const randomBytes = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    randomBytes[i] = Math.floor(Math.random() * 256);
  }

  return randomBytes;
}

const defaultDataFormat = 'application/json';

const aliceProfile = { "did": "did:key:z6MkkC6ujbWy9bFJ1AR5Pcu8SBhhCeggWytnAQk1ZT2t8YXj", "keyPair": { "publicJwk": { "alg": "EdDSA", "kty": "OKP", "crv": "Ed25519", "x": "VUQUdr2EeGQozIZwMGuo8y-wG-wuotEyxqF0CYg2Kbo" }, "privateJwk": { "alg": "EdDSA", "kty": "OKP", "crv": "Ed25519", "x": "VUQUdr2EeGQozIZwMGuo8y-wG-wuotEyxqF0CYg2Kbo", "d": "PDXPyxBu63JkzlOuCLhI4SlCUY-o0Vsx5G_5J0NsBug" } }, "signatureInput": { "privateJwk": { "alg": "EdDSA", "kty": "OKP", "crv": "Ed25519", "x": "VUQUdr2EeGQozIZwMGuo8y-wG-wuotEyxqF0CYg2Kbo", "d": "PDXPyxBu63JkzlOuCLhI4SlCUY-o0Vsx5G_5J0NsBug" }, "protectedHeader": { "alg": "EdDSA", "kid": "did:key:z6MkkC6ujbWy9bFJ1AR5Pcu8SBhhCeggWytnAQk1ZT2t8YXj#did:key:z6MkkC6ujbWy9bFJ1AR5Pcu8SBhhCeggWytnAQk1ZT2t8YXj#z6MkkC6ujbWy9bFJ1AR5Pcu8SBhhCeggWytnAQk1ZT2t8YXj" } } };
const bobProfile = { "did": "did:key:z6MkoYRFZzcgUJpC1QU5J83t8aHtiB7ggQYwAqDG6npyE4EH", "keyPair": { "publicJwk": { "alg": "EdDSA", "kty": "OKP", "crv": "Ed25519", "x": "hwt_CRvo2aIPoLfCTlP0ZklABniimf7kLDbYLtZv7xY" }, "privateJwk": { "alg": "EdDSA", "kty": "OKP", "crv": "Ed25519", "x": "hwt_CRvo2aIPoLfCTlP0ZklABniimf7kLDbYLtZv7xY", "d": "zFjDI6iEMwj_CHd3y9iaJgFoEzEdsRi6YmySr-12Npg" } }, "signatureInput": { "privateJwk": { "alg": "EdDSA", "kty": "OKP", "crv": "Ed25519", "x": "hwt_CRvo2aIPoLfCTlP0ZklABniimf7kLDbYLtZv7xY", "d": "zFjDI6iEMwj_CHd3y9iaJgFoEzEdsRi6YmySr-12Npg" }, "protectedHeader": { "alg": "EdDSA", "kid": "did:key:z6MkoYRFZzcgUJpC1QU5J83t8aHtiB7ggQYwAqDG6npyE4EH#did:key:z6MkoYRFZzcgUJpC1QU5J83t8aHtiB7ggQYwAqDG6npyE4EH#z6MkoYRFZzcgUJpC1QU5J83t8aHtiB7ggQYwAqDG6npyE4EH" } } };

async function raw_start() {
  const alice: Profile = aliceProfile as any;
  const bob: Profile = bobProfile as any;

  const dataBlob = await dataToBlob("hello Bob!", defaultDataFormat).dataBlob.arrayBuffer();

  const recordsWrite = await RecordsWrite.create({
    data: new Uint8Array(dataBlob),
    dataFormat: defaultDataFormat,
    authorizationSignatureInput: alice.signatureInput,
  });

  let rpcRequest = await createJsonRpcRequest(uuidv4(), 'dwn.processMessage', {
    target: alice.did,
    message: recordsWrite.toJSON(),
  });

  let resp = await fetch('http://localhost:3000', {
    method: 'POST',
    headers: {
      'dwn-request': JSON.stringify(rpcRequest),
      'content-type': 'application/octet-stream'
    },
    body: dataBlob,
  });

  console.log(await resp.text());

  // const recordsRead = await RecordsRead.create({
  //   recordId: recordsWrite.message.recordId,
  //   authorizationSignatureInput: oyt.signatureInput,
  // });

  const recordsQ = await RecordsQuery.create({
    authorizationSignatureInput: alice.signatureInput,
    filter: {
      // recordId: recordsWrite.message.recordId,
      dataFormat: defaultDataFormat,
    },
  });

  let rpcReadRequest = await createJsonRpcRequest(uuidv4(), 'dwn.processMessage', {
    target: alice.did,
    message: recordsQ.toJSON(),
  });

  let readResp = await fetch('http://localhost:3000', {
    method: 'POST',
    headers: {
      'dwn-request': JSON.stringify(rpcReadRequest),
    },
  });

  console.log(await readResp.text());
}

// start().catch(console.error);
