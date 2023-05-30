import { DWN_PROTO, DWN_PROTO_NAME, DwnProtoMessage, LocalDwnEndpoints, makeProtoCreateRecord } from "@web50/dwn_utils";
import { Web5 } from "web50";
import { config } from 'dotenv';

config({
  path: '../../.env',
});

// See the actual one in bob's DWN console output and change it in .env
const bob_did = process.env.BOB_DID ?? '';

async function run_alice_dwn() {
  const { web5 } = await Web5.connect({
    techPreview: {
      dwnEndpoints: LocalDwnEndpoints,
    },
  });

  const proto_exists = await web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: DWN_PROTO_NAME,
      },
    },
  });

  console.dir(proto_exists);


  if (!proto_exists.protocols.length) {
    const proto = await web5.dwn.protocols.configure({
      message: {
        definition: DWN_PROTO,
      },
    });

    console.dir(proto);
  }

  const bob_data = await web5.dwn.records.query({
    from: bob_did,
    message: {
      filter: {
        protocol: DWN_PROTO_NAME,
      },
    },
  });

  const [bob_record] = bob_data?.records ?? [undefined];

  if (bob_record) {
    console.log(`Updating record: ${bob_record.id}`);
    let msg: DwnProtoMessage = await bob_record.data.json();

    if (msg.collection.length == 2) {
      msg.collection[0] = `Edited later by Alice at ${new Date().toUTCString()}`;
    } else {
      msg.collection.push(`New pushed data by Alice at ${new Date().toUTCString()}`);
    }

    const res = await bob_record.update({
      data: msg,
    });
    console.dir(res);

    console.dir(await bob_record?.send(bob_did));
  } else {
    const data: DwnProtoMessage = {
      collection: [`New record by Alice at ${new Date().toUTCString()}`],
    };

    const { record } = await makeProtoCreateRecord(web5, data, bob_did);
    const res = await record?.send(bob_did);

    console.dir(res);
  }
}

run_alice_dwn().catch(console.error);
