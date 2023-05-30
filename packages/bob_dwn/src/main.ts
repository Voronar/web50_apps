import { DWN_PROTO, DWN_PROTO_NAME, DwnProtoMessage, LocalDwnEndpoints } from "@web50/dwn_utils";
import { Web5 } from "web50";

async function run_bob_dwn() {
  const { web5, did: profileDid } = await Web5.connect({
    techPreview: {
      dwnEndpoints: LocalDwnEndpoints,
    },
  });

  console.log(profileDid);

  const proto_exists = await web5.dwn.protocols.query({
    message: {
      filter: {
        protocol: DWN_PROTO_NAME,
      },
    },
  });


  if (proto_exists.protocols.length == 0) {
    const proto = await web5.dwn.protocols.configure({
      message: {
        definition: DWN_PROTO,
      },
    });

    console.dir(proto);
  }

  setInterval(async () => {
    const res = await web5.dwn.records.query({
      message: {
        filter: {
          protocol: DWN_PROTO_NAME,
        },
      },
    });

    for (let re of res.records ?? []) {
      const msg: DwnProtoMessage = await re.data.json();
      console.log(re.id);
      console.dir(msg);
    }

  }, 2000);

}

run_bob_dwn().catch(console.error);
