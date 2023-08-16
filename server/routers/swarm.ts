import { router, loginProcedure } from '../trpc';
import { env } from '@/env.mjs';
import { DockerNode, DockerService, dockerNodeErrorCodes, dockerServiceErrorCodes } from '@/components/dashboard/dockerTypes';

const mainNodeUrlAndPort = `${env.NEXT_PUBLIC_MAIN_NODE_URL}:${env.NEXT_PUBLIC_SWARM_PORT}`;

// Export type router type signature,
// NOT the router itself.
export type SwarmRouter = typeof swarmRouter;

export const swarmRouter = router({
    getNodes: loginProcedure
        .query(async () => {

            // console.log("MAIN_NODE_URL + NEXT_PUBLIC_SWARM_PORT", mainNodeUrlAndPort);

            // try {
            const nodesResponse = await fetch(`${mainNodeUrlAndPort}/nodes`);

            if (!nodesResponse.ok) {
                return {
                    ok: false,
                    data: dockerNodeErrorCodes[
                        nodesResponse.status.toString() as unknown as keyof typeof dockerNodeErrorCodes
                    ] || "Unknown Error",
                } as { ok: false; data: string }
            }
            const data = (await nodesResponse.json() as DockerNode[]).sort((a, b) => (a.Description.Hostname < b.Description.Hostname ? -1 : 1));

            return { ok: true, data } as { ok: true; data: DockerNode[] };

            // } catch (error) {
            //     console.error("swarmRouter getNodesAndServices error: ", error);
            //     return {
            //         ok: false,
            //         error: new String(error).toString(),
            //     };
            // }

        }),
    getServices: loginProcedure
        .query(async () => {

            // try {
            const servicesResponse = await fetch(`${mainNodeUrlAndPort}/services`);

            if (!servicesResponse.ok) {
                return {
                    ok: false,
                    data: dockerServiceErrorCodes[
                        servicesResponse.status.toString() as unknown as keyof typeof dockerServiceErrorCodes
                    ] || "Unknown Error",
                } as { ok: false; data: string }
            }

            const data = (await servicesResponse.json() as DockerService[]).sort((a, b) => (a.Spec.Name < b.Spec.Name ? -1 : 1));

            return { ok: true, data } as { ok: true; data: DockerService[] };

            // } catch (error) {
            //     console.error("swarmRouter getNodesAndServices error: ", error);
            //     return {
            //         ok: false,
            //         error: new String(error).toString(),
            //     };
            // }

        }),
});
