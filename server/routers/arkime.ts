import { env } from '@/env.mjs';
import { router, userProcedure, loginProcedure } from '../trpc';
import { z } from 'zod';
import { arkimeSearchSessionSchema } from '../schema/arkime.schema';

export type ArkimeRouter = typeof arkimeRouter;

export const arkimeRouter = router({
    searchPayload: userProcedure.input(z.object({
        host: z.string(),
        port: z.string(),
        query: z.string(),
        stopTime: z.string().nullable(),
        startTime: z.string().nullable(),
        arkime_node: z.string().nullable(),
        // ip_src: z.string(),
    })).query(async ({ input: { host, port, query, stopTime, startTime, arkime_node } }) => {
        // const client = new DigestClient('admin', '1qaz2wsx', { algorithm: 'MD5' })
        /**
         * http://192.168.15.13:8000/arkime_api/payload/?
         *      host=http://192.168.15.21&
         *      port=8005&
         *      query=好嗎&
         *      arkime_node=arkime01-node&
         *      ip_src=192.168.15.31
         */
        const url = new URL("/arkime_api/payload/", `${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_ARKIME_PORT}`);
        url.searchParams.append("host", host);
        url.searchParams.append("port", port);
        url.searchParams.append("query", query);
        if (stopTime) url.searchParams.append("stopTime", stopTime);
        if (startTime) url.searchParams.append("startTime", startTime);
        if (arkime_node) url.searchParams.append("arkime_node", arkime_node);
        // url.searchParams.append("ip_src", ip_src);

        const response = await fetch(url, { method: "GET" })
        return await response.json()
    }),
    searchSession: userProcedure.input(arkimeSearchSessionSchema).mutation(async ({ input: { host, expression } }) => {
        /**
         *  http://192.168.16.31:8000/arkime_api/sessions/?
         *      host=http://192.168.16.32&
         *      expression=file = *out*
         */
        try {
            const url = new URL("/arkime_api/sessions/", `${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_ARKIME_PORT}`);
            url.searchParams.append("host", `https://${host}`);
            url.searchParams.append("expression", expression);

            const response = await fetch(url, { method: "GET" })
            return (await response.json()) as ArkimeSessionData
        } catch (error) {
            return { error: String(error), data: undefined }
        }
    }),
    getArkimeHosts: loginProcedure
        .query(async () => {
            try {
                const arkimeUser = new FormData();
                arkimeUser.append("username", "apiuser");
                arkimeUser.append("password", "1qaz@WSX3edc");
                const tokenUrl = new URL("/api/token/", `${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_ARKIME_PORT}`)
                const tokenResponse = await fetch(tokenUrl, { method: "POST", body: arkimeUser })
                const token = await tokenResponse.json() as ArkimeTokenData

                const tokenHeader = new Headers();
                tokenHeader.append("Authorization", `Bearer ${token.access}`);
                const hostsUrl = new URL("/arkime_api/api/arkime-hosts/", `${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_ARKIME_PORT}`)
                const hostsResponse = await fetch(hostsUrl, { method: "GET", headers: tokenHeader })
                const hosts = await hostsResponse.json()

                return hosts as ArkimeHostData
            } catch (error) {
                return { error: String(error), arkime_hosts: [] }
            }
        }),
});

const fakeSessionData = {
    "data": [
        {
            "firstPacket": 1691586303323,
            "totDataBytes": 317,
            "ipProtocol": 6,
            "node": "dca02",
            "lastPacket": 1691586303324,
            "source": {
                "as": {},
                "geo": {},
                "packets": 5,
                "port": 59054,
                "ip": "127.0.0.1",
                "bytes": 346
            },
            "destination": {
                "as": {},
                "geo": {},
                "port": 8088,
                "ip": "127.0.0.1",
                "packets": 5,
                "bytes": 647
            },
            "client": {
                "bytes": 8
            },
            "server": {
                "bytes": 309
            },
            "network": {
                "packets": 10,
                "bytes": 993
            },
            "id": "3@230809-ImOUeDF-ob1JrIeiz8JeMMOq"
        },
        {
            "firstPacket": 1691586303329,
            "totDataBytes": 352,
            "ipProtocol": 6,
            "node": "dca02",
            "lastPacket": 1691586303330,
            "source": {
                "as": {},
                "geo": {},
                "packets": 5,
                "port": 59066,
                "ip": "127.0.0.1",
                "bytes": 381
            },
            "destination": {
                "as": {},
                "geo": {},
                "port": 8088,
                "ip": "127.0.0.1",
                "packets": 5,
                "bytes": 647
            },
            "client": {
                "bytes": 43
            },
            "server": {
                "bytes": 309
            },
            "network": {
                "packets": 10,
                "bytes": 1028
            },
            "id": "3@230809-ImMAdwGmWhhNOq_5BeT3CkKZ"
        },
        {
            "firstPacket": 1691586305336,
            "totDataBytes": 317,
            "ipProtocol": 6,
            "node": "dca02",
            "lastPacket": 1691586305337,
            "source": {
                "as": {},
                "geo": {},
                "packets": 5,
                "port": 57198,
                "ip": "127.0.0.1",
                "bytes": 346
            },
            "destination": {
                "as": {},
                "geo": {},
                "port": 8088,
                "ip": "127.0.0.1",
                "packets": 5,
                "bytes": 647
            },
            "client": {
                "bytes": 8
            },
            "server": {
                "bytes": 309
            },
            "network": {
                "packets": 10,
                "bytes": 993
            },
            "id": "3@230809-ImOz6CcSWftHIJWZX4dknozz"
        },
        {
            "firstPacket": 1691586305342,
            "totDataBytes": 352,
            "ipProtocol": 6,
            "node": "dca02",
            "lastPacket": 1691586305343,
            "source": {
                "as": {},
                "geo": {},
                "packets": 5,
                "port": 57206,
                "ip": "127.0.0.1",
                "bytes": 381
            },
            "destination": {
                "as": {},
                "geo": {},
                "port": 8088,
                "ip": "127.0.0.1",
                "packets": 5,
                "bytes": 647
            },
            "client": {
                "bytes": 43
            },
            "server": {
                "bytes": 309
            },
            "network": {
                "packets": 10,
                "bytes": 1028
            },
            "id": "3@230809-ImNEaGCDMy5FA6Nf2fxgh5OT"
        },
        {
            "firstPacket": 1691586307350,
            "totDataBytes": 317,
            "ipProtocol": 6,
            "node": "dca02",
            "lastPacket": 1691586307351,
            "source": {
                "as": {},
                "geo": {},
                "packets": 5,
                "port": 57220,
                "ip": "127.0.0.1",
                "bytes": 346
            },
            "destination": {
                "as": {},
                "geo": {},
                "port": 8088,
                "ip": "127.0.0.1",
                "packets": 5,
                "bytes": 647
            },
            "client": {
                "bytes": 8
            },
            "server": {
                "bytes": 309
            },
            "network": {
                "packets": 10,
                "bytes": 993
            },
            "id": "3@230809-ImOXLfuUPQlKVpu7464w6EA9"
        },
        {
            "firstPacket": 1691586307356,
            "totDataBytes": 352,
            "ipProtocol": 6,
            "node": "dca02",
            "lastPacket": 1691586307357,
            "source": {
                "as": {},
                "geo": {},
                "packets": 5,
                "port": 57228,
                "ip": "127.0.0.1",
                "bytes": 381
            },
            "destination": {
                "as": {},
                "geo": {},
                "port": 8088,
                "ip": "127.0.0.1",
                "packets": 5,
                "bytes": 647
            },
            "client": {
                "bytes": 43
            },
            "server": {
                "bytes": 309
            },
            "network": {
                "packets": 10,
                "bytes": 1028
            },
            "id": "3@230809-ImOuJUXFLDFB7adSJWy7zt9Z"
        },
        {
            "firstPacket": 1691586309364,
            "totDataBytes": 317,
            "ipProtocol": 6,
            "node": "dca02",
            "lastPacket": 1691586309365,
            "source": {
                "as": {},
                "geo": {},
                "packets": 5,
                "port": 57232,
                "ip": "127.0.0.1",
                "bytes": 346
            },
            "destination": {
                "as": {},
                "geo": {},
                "port": 8088,
                "ip": "127.0.0.1",
                "packets": 5,
                "bytes": 647
            },
            "client": {
                "bytes": 8
            },
            "server": {
                "bytes": 309
            },
            "network": {
                "packets": 10,
                "bytes": 993
            },
            "id": "3@230809-ImMMWH2OZP1MVbl6kHPqL3GK"
        },
        {
            "firstPacket": 1691586309369,
            "totDataBytes": 352,
            "ipProtocol": 6,
            "node": "dca02",
            "lastPacket": 1691586309370,
            "source": {
                "as": {},
                "geo": {},
                "packets": 5,
                "port": 57248,
                "ip": "127.0.0.1",
                "bytes": 381
            },
            "destination": {
                "as": {},
                "geo": {},
                "port": 8088,
                "ip": "127.0.0.1",
                "packets": 5,
                "bytes": 647
            },
            "client": {
                "bytes": 43
            },
            "server": {
                "bytes": 309
            },
            "network": {
                "packets": 10,
                "bytes": 1028
            },
            "id": "3@230809-ImNfqG468RhOh6biEE9Hqua-"
        },
        {
            "firstPacket": 1691586311376,
            "totDataBytes": 317,
            "ipProtocol": 6,
            "node": "dca02",
            "lastPacket": 1691586311378,
            "source": {
                "as": {},
                "geo": {},
                "packets": 5,
                "port": 57254,
                "ip": "127.0.0.1",
                "bytes": 346
            },
            "destination": {
                "as": {},
                "geo": {},
                "port": 8088,
                "ip": "127.0.0.1",
                "packets": 5,
                "bytes": 647
            },
            "client": {
                "bytes": 8
            },
            "server": {
                "bytes": 309
            },
            "network": {
                "packets": 10,
                "bytes": 993
            },
            "id": "3@230809-ImOi_UBnFXhCv6j2d4A6P4ff"
        },
        {
            "firstPacket": 1691586311381,
            "totDataBytes": 352,
            "ipProtocol": 6,
            "node": "dca02",
            "lastPacket": 1691586311383,
            "source": {
                "as": {},
                "geo": {},
                "packets": 5,
                "port": 57260,
                "ip": "127.0.0.1",
                "bytes": 381
            },
            "destination": {
                "as": {},
                "geo": {},
                "port": 8088,
                "ip": "127.0.0.1",
                "packets": 5,
                "bytes": 647
            },
            "client": {
                "bytes": 43
            },
            "server": {
                "bytes": 309
            },
            "network": {
                "packets": 10,
                "bytes": 1028
            },
            "id": "3@230809-ImOguY-eytFOnpoT7kv4svJx"
        }
    ],
    "map": {},
    "graph": {
        "xmin": null,
        "xmax": 1755187200000,
        "interval": 60,
        "sessionsHisto": [],
        "sessionsTotal": 0,
        "source.packetsHisto": [],
        "destination.packetsHisto": [],
        "network.packetsTotal": 0,
        "source.bytesHisto": [],
        "destination.bytesHisto": [],
        "network.bytesTotal": 0,
        "client.bytesHisto": [],
        "server.bytesHisto": [],
        "totDataBytesTotal": 0
    },
    "recordsTotal": 348156,
    "recordsFiltered": 10
}

export type ArkimeSessionData = typeof fakeSessionData | { error: string, data: undefined };

type ArkimeTokenData = {
    refresh: string;
    access: string;
};

const fakeArkimeHostData = {
    "arkime_hosts": [
        {
            "hostname": "dac02",
            "ip": "192.168.16.31"
        }
    ],
}

export type ArkimeHostData = typeof fakeArkimeHostData & {
    comment?: string
} | { error: string, arkime_hosts: typeof fakeArkimeHostData["arkime_hosts"] };;
