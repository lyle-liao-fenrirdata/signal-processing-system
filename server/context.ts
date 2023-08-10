import { verifyUserJWT } from '@/utils/jwt';
import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';

// interface CreateContextOptions {
//     // session: Session | null
// }

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
// export async function createContextInner(_opts: CreateContextOptions) {
//     return {};
// }

// export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext({ req, res }: trpcNext.CreateNextContextOptions) {
    // for API-response caching see https://trpc.io/docs/caching
    // Create your context based on the request object
    // Will be available as `ctx` in all your resolvers
    // This is just an example of something you'd might want to do in your ctx fn
    async function getUserFromHeader() {
        const token = req.cookies['x-token']
        if (!token) return null;
        const { payload } = await verifyUserJWT(token.split(' ')[1]);
        if (!payload) return null
        return payload;
    }
    const user = await getUserFromHeader();
    return {
        req,
        res,
        user,
    };
    // return await createContextInner({});
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
