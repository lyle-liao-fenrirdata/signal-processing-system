import { Color, PrismaClient, Role } from '@prisma/client'
import * as argon2 from "argon2";
const prisma = new PrismaClient()

const defaultPassword = '1qaz@WSX'

async function main() {

    const defaultHash = await argon2.hash(defaultPassword);
    const userResults = await Promise.all(([{
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

    console.log(userResults)
    const [admin, user, userA, userB] = userResults

    await prisma.audit.createMany({
        data: [
            { createdById: admin.id, createdAt: new Date(new Date().setDate(new Date().getDate() - 2)) },
            { createdById: admin.id, createdAt: new Date(new Date().setDate(new Date().getDate() - 1)) },
            { createdById: admin.id, isActive: true },
        ]
    })

    const auditIds = await prisma.audit.findMany({
        select: {
            id: true,
        }
    });

    const colorArray = Object.keys(Color) as (keyof typeof Color)[]
    await Promise.all(auditIds.map(async ({ id }, index) => {
        await prisma.auditGroup.createMany({
            data: Array.from({ length: index + 2 }, (_, i) => ({
                name: `Fake ${id}-${i + 1}`,
                auditId: id,
                color: colorArray[(index + i + 1) % colorArray.length],
            }))
        })
    }))

    const auditGroups = await prisma.auditGroup.findMany({
        select: {
            id: true,
            name: true,
            color: true,
        }
    })
    await Promise.all(auditGroups.map(async ({ id, name, color }, index) => {
        await prisma.auditItem.createMany({
            data: Array.from({ length: index + 2 }, (_, i) => ({
                name: `Item ${i + 1} of ${name} in ${color}`,
                auditGroupId: id
            }))
        })
    }))
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