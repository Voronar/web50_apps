import { DWN_PROTO, DWN_PROTO_MESSAGE_DATA_FORMAT, DWN_PROTO_MESSAGE_SCHEMA, DWN_PROTO_NAME, DWN_PROTO_PATH_MESSAGE, LocalDwnEndpoints } from "@web50/dwn_utils";
import { Web5 } from "web50";

// See the actual one in Claude's DWN console output and change it
const claude_did = 'did:ion:EiAVN-IOz4LPsdA0BYgJUifqFqzg1wMV6F7jwzIL7G_62A:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJhdXRoeiIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJuS1YwXzlZTVFXek9yenNYdDlxelMydmUtYkFibW1hblFBS0FLUEM1ZWwwIiwieSI6IlFoMkNUbEZXZW1IaGRwbTdQTVQ1dnVDNl9uRmpZdGU5QTh4S0JPNnZZMjQifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6Ikpzb25XZWJLZXkyMDIwIn0seyJpZCI6ImVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJNaUtpZlhIdWxqdjJ2Y09fQkhaZlNNZy1TSXFTRWh1YTUydEVlVGF1VXVRIiwieSI6IjFycFBUSmNONkMtVXExN1hWRy1nMWZNeHc2OEJKLVlsYjNUVzRxd2JwYWcifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7Im1lc3NhZ2VBdXRob3JpemF0aW9uS2V5cyI6WyIjYXV0aHoiXSwibm9kZXMiOlsiaHR0cDovLzEyNy4wLjAuMTozMDAwIl0sInJlY29yZEVuY3J5cHRpb25LZXlzIjpbIiNlbmMiXX0sInR5cGUiOiJEZWNlbnRyYWxpemVkV2ViTm9kZSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQVp3Wjl5MDg5emFpSkd3UnN6d3JVVlRBS3lLUC1ZaXBYYWUwRGhTQWdFY1EifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaUFLX1B3aXdQWGFidHBDYWJqbDlXRERWeWRnX3lfU2xPMFRTQWd4SDQxc3FBIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlETG5uSGdicWJpWDZpOHdMNVZvZGlmb3FlUWJYQ2hHYnVHWUQ0ZUVBMzllZyJ9fQ';

async function run_dennis_dwn() {
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


  if (proto_exists.protocols.length == 0) {
    const proto = await web5.dwn.protocols.configure({
      message: {
        definition: DWN_PROTO,
      },
    });

    console.dir(proto);
  }


  const { record } = await web5.dwn.records.create({
    data: 'Hello, Claude!',
    message: {
      recipient: claude_did,
      schema: DWN_PROTO_MESSAGE_SCHEMA,
      dataFormat: DWN_PROTO_MESSAGE_DATA_FORMAT,
      protocol: DWN_PROTO_NAME,
      protocolPath: DWN_PROTO_PATH_MESSAGE,
    },
  });

  const res = await record?.send(claude_did);

  console.dir(res);
}

run_dennis_dwn().catch(console.error);
