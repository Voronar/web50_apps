import { DWN_PROTO, DWN_PROTO_NAME, LocalDwnEndpoints } from "@web50/dwn_utils";
import { Web5 } from "web50";

const oyt_did = 'did:ion:EiCajQAHe-mZDR0rnf4gcWlkq3GnWyu6z-5yblB-OruMzQ:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJhdXRoeiIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJ1QnpxTlE4UnRhR3hGMWF5OEt5b2xweUhqOG1QY0JzWE01eHpZUUZpQktzIiwieSI6IlJEX1VnTFFpV0hFNzZkQlROMU1iN2NCMzFha1VsYldnQWcwOUJMMWVrS1EifSwicHVycG9zZXMiOlsiYXV0aGVudGljYXRpb24iXSwidHlwZSI6Ikpzb25XZWJLZXkyMDIwIn0seyJpZCI6ImVuYyIsInB1YmxpY0tleUp3ayI6eyJjcnYiOiJzZWNwMjU2azEiLCJrdHkiOiJFQyIsIngiOiJoZjVlVFN5LUxTS2h6TEoyb1Y5cDdPMWlVMXJ2bF9tZE9jVFNxbnVSZHV3IiwieSI6Ilg3Y0EyREh5N0RnQ3d0UUI5SUp5TTJTNjhMLU5OZDd5TVFfVURxTWhrZTgifSwicHVycG9zZXMiOlsia2V5QWdyZWVtZW50Il0sInR5cGUiOiJKc29uV2ViS2V5MjAyMCJ9XSwic2VydmljZXMiOlt7ImlkIjoiZHduIiwic2VydmljZUVuZHBvaW50Ijp7Im1lc3NhZ2VBdXRob3JpemF0aW9uS2V5cyI6WyIjYXV0aHoiXSwibm9kZXMiOlsiaHR0cDovLzEyNy4wLjAuMTozMDAwIl0sInJlY29yZEVuY3J5cHRpb25LZXlzIjpbIiNlbmMiXX0sInR5cGUiOiJEZWNlbnRyYWxpemVkV2ViTm9kZSJ9XX19XSwidXBkYXRlQ29tbWl0bWVudCI6IkVpQU9MSVBGb21GWHFyaTZIVThyNjdwNVZacUpzRW5sV1RKY0pOWmhfc1NIV0EifSwic3VmZml4RGF0YSI6eyJkZWx0YUhhc2giOiJFaURLcVlIVGlKanRzS3NlM3dhaVYtVlpZMFNkeTczMkdQZ3dUM05mcXJuNm9RIiwicmVjb3ZlcnlDb21taXRtZW50IjoiRWlBN25wWWF5bW05RFdQenJlTXFSalg0MGhJVVdIaVBMRlN5amdkTGpZOVFidyJ9fQ';

async function run_claude_dwn() {
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
      console.log(await re.data.text());
    }

  }, 2000);

}

run_claude_dwn().catch(console.error);
