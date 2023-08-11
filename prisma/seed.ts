import { PrismaClient, Role } from '@prisma/client'
import * as argon2 from "argon2";
const prisma = new PrismaClient()

const defaultPassword = '1qaz@WSX'

async function main() {

    const defaultHash = await argon2.hash(defaultPassword);
    const admin = await prisma.user.upsert({
        where: { account: 'admin' },
        update: {
            password: defaultHash,
        },
        create: {
            username: '測試-管理者',
            account: 'admin',
            password: defaultHash,
            role: 'ADMIN',
        },
    })
    const result = await Promise.all(([{
        username: '測試-管理者',
        account: 'admin',
        role: 'ADMIN',
    },
    {
        username: '測試-使用者',
        account: 'user',
        role: 'USER',
    }, {
        username: '測試-使用者-A',
        account: 'user-a',
        role: 'USER',
    }, {
        username: '測試-使用者-B',
        account: 'user-b',
        role: 'USER',
    }, {
        username: '測試-訪客-1',
        account: 'guest-1',
        role: 'GUEST',
    }, {
        username: '測試-訪客-2',
        account: 'guest-2',
        role: 'GUEST',
    }, {
        username: '測試-訪客-3',
        account: 'guest-3',
        role: 'GUEST',
    }
    ] as { username: string, account: string, role: Role }[]).map(async (item) => await prisma.user.upsert({
        where: { account: item.account },
        update: { ...item, password: defaultHash },
        create: { ...item, password: defaultHash },
    })));

    console.log(result)
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })