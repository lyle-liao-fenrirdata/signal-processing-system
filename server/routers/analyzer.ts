import { router, userProcedure } from '../trpc';
import { env } from '@/env.mjs';
import { z } from 'zod';

const mainNodeUrlAndPort = `${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_ELASTIC_PORT}`;

// Export type router type signature,
// NOT the router itself.
export type AnalyzerRouter = typeof analyzerRouter;

export const analyzerRouter = router({
    getIsStoreImage: userProcedure
        .query(async () => {
            try {
                const url = new URL('/pcap_analysis_system_env/_doc/VofzXIsBrVFYlaMTDpW4', mainNodeUrlAndPort)
                const nodesResponse = await fetch(url, {
                    headers: {
                        'Authorization': `Basic ${btoa("pcap_analysis_system_admin:1qaz2wsx")}`
                    },
                });

                if (!nodesResponse.ok) {
                    return {
                        ok: false,
                        data: String(nodesResponse),
                    } as { ok: false; data: string }
                }

                const data = await nodesResponse.json() as {
                    "_index": "pcap_analysis_system_env";
                    "_type": "_doc";
                    "_id": "VofzXIsBrVFYlaMTDpW4";
                    "_version": number;
                    "_seq_no": number;
                    "_primary_term": number;
                    "found": boolean;
                    "_source": {
                        "store_image": boolean;
                    }
                };

                return { ok: true, data } as { ok: true; data: typeof data };

            } catch (error) {
                console.error("analyzerRouter getIsStoreImage error: ", error);
                return {
                    ok: false,
                    data: new String(error).toString(),
                } as { ok: false; data: string };
            }
        }),
    setIsStoreImage: userProcedure
        .input(z.boolean())
        .mutation(async ({ input: store_image }) => {
            try {
                const url = new URL('/pcap_analysis_system_env/_update/VofzXIsBrVFYlaMTDpW4', mainNodeUrlAndPort)
                const nodesResponse = await fetch(url, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json; charset=UTF-8",
                        'Authorization': `Basic ${btoa("pcap_analysis_system_admin:1qaz2wsx")}`
                    },
                    body: JSON.stringify({
                        doc: {
                            store_image,
                        }
                    })
                });

                if (!nodesResponse.ok) {
                    return {
                        ok: false,
                        data: String(nodesResponse),
                    } as { ok: false; data: string }
                }

                const data = await nodesResponse.json() as {
                    "_index": "pcap_analysis_system_env";
                    "_type": "_doc";
                    "_id": "VofzXIsBrVFYlaMTDpW4";
                    "_version": number;
                    "result": "updated" | string;
                    "_shards": {
                        "total": number;
                        "successful": number;
                        "failed": number;
                    },
                    "_seq_no": number;
                    "_primary_term": number;
                };

                return { ok: true, data } as { ok: true; data: typeof data };

            } catch (error) {
                console.error("analyzerRouter getIsStoreImage error: ", error);
                return {
                    ok: false,
                    data: new String(error).toString(),
                } as { ok: false; data: string };
            }
        }),
});
