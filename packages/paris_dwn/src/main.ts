import { DWN_PROTO, DWN_PROTO_NAME, DwnProtoMessage, LocalDwnEndpoints, makeProtoCreateRecord, makeProtoUpdateRecord } from "@web50/dwn_utils";
import { Web5 } from "web50";
import { config } from 'dotenv';

config({
  path: '../../.env',
});

// See the actual one in Claude's DWN console output and change it in .env
const claude_did = process.env.CLAUDE_DID ?? '';

async function run_paris_dwn() {
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

  const claude_data = await web5.dwn.records.query({
    from: claude_did,
    message: {
      filter: {
        protocol: DWN_PROTO_NAME,
      },
    },
  });

  const [claude_record] = claude_data?.records ?? [undefined];

  if (claude_record) {
    console.log(`Updating record: ${claude_record.id}`);
    let msg: DwnProtoMessage = await claude_record.data.json();

    if (msg.collection.length == 2) {
      msg.collection[0] = `Edited later by Paris.`;
    } else {
      msg.collection.push('New pushed data by Paris');
    }

    const { record } = await makeProtoUpdateRecord(web5, claude_record.id, msg, claude_did);
    console.dir(record);

    const res = await record?.send(claude_did);

    console.dir(res);
  } else {
    const data: DwnProtoMessage = {
      collection: ['New record by Paris'],
    };

    const { record } = await makeProtoCreateRecord(web5, data, claude_did);
    const res = await record?.send(claude_did);

    console.dir(res);
  }

}

run_paris_dwn().catch(console.error);
