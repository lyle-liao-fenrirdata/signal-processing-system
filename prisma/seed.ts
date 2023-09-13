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

    const colorArray = Object.keys(Color) as (keyof typeof Color)[]

    await Promise.all([
        await prisma.auditItemLog.deleteMany({}),
        await prisma.auditGroupLog.deleteMany({}),
        await prisma.auditLog.deleteMany({}),
    ])
    await prisma.auditItem.deleteMany({})
    await prisma.auditGroup.deleteMany({})
    await prisma.audit.deleteMany({})

    await prisma.audit.createMany({
        data: [
            { createdById: admin.id, createdAt: new Date(new Date().setDate(new Date().getDate() - 2)), comment: "text comment" },
            { createdById: admin.id, createdAt: new Date(new Date().setDate(new Date().getDate() - 1)), comment: "try it first" },
            { createdById: admin.id, isActive: true, comment: "測試留言功    能!!!" },
        ]
    })

    const inactiveAuditIds = await prisma.audit.findMany({
        where: { isActive: false },
        select: {
            id: true,
        }
    });
    await Promise.all(inactiveAuditIds.map(async ({ id: auditId }, index) => {
        await prisma.auditGroup.createMany({
            data: Array.from({ length: index + 2 }, (_, i) => ({
                name: `Fake ${auditId}-${i + 1}`,
                auditId,
                color: colorArray[(index + i + 1) % colorArray.length],
                order: i + 1
            }))
        })
    }))

    const inactiveAuditGroups = await prisma.auditGroup.findMany({
        where: {
            audit: {
                isActive: false,
            },
        },
        select: {
            id: true,
            name: true,
            color: true,
            order: true,
        }
    })
    await Promise.all(inactiveAuditGroups.map(async ({ id: auditGroupId, name, color }, index) => {
        await prisma.auditItem.createMany({
            data: Array.from({ length: (index % 3) + 2 }, (_, i) => ({
                name: `Item ${i + 1} of ${name} in ${color}`,
                auditGroupId,
                order: i + 1
            }))
        })
    }))

    const activeAuditIds = await prisma.audit.findMany({
        where: { isActive: true },
        select: {
            id: true,
        }
    });
    if (!activeAuditIds[0]) return;
    const activeAuditId = activeAuditIds[0].id
    const auditGroupData = [
        {
            name: "解析系統狀況",
            color: Color.Blue,
            items: [
                { name: "解析節點，是否均在線" },
                { name: "解析容器，是否均在運行" },
                { name: "解析節點，是否負載過高" },
                { name: "解析容器，是否負載過高" },
            ]
        },
        {
            name: "解析結果狀況",
            color: Color.Green,
            items: [
                { name: "(如在錄製)接收檔案，是否持續更新" },
                { name: "(如在錄製)接收檔案，是否持續解析" },
                { name: "查詢解析衛星、極化、中心頻率、側錄時間，是否符合" },
            ]
        },
        {
            name: "錄製系統狀況",
            color: Color.Purple,
            items: [
                { name: "錄製節點，是否均在線" },
                { name: "錄製容器，是否均在運行" },
                { name: "錄製節點，是否負載過高" },
                { name: "錄製容器，是否負載過高" },
                { name: "(如有變更)錄製硬體設定，是否更新" }
            ]
        },
        {
            name: "錄製設備狀況",
            color: Color.Orange,
            items: [
                { name: "(如有變更)錄製資訊設定，是否更新" },
                { name: "(如在錄製)錄製流路，是否於解析系統中設定相符" },
                { name: "(如在錄製)錄製流路，是否可於解析系統中查詢結果" },
            ]
        }
    ]
    await prisma.auditGroup.createMany({
        data: auditGroupData.map(({ name, color }, i) => ({
            name,
            auditId: activeAuditId,
            color,
            order: i + 1
        }))
    })

    const activeAuditGroups = await Promise.all(auditGroupData
        .map(async ({ name, items }) => {
            const group = await prisma.auditGroup.findFirst({
                where: { name },
                select: {
                    id: true,
                }
            })
            return {
                group,
                items,
            }
        }))
    await Promise.all(activeAuditGroups.map(async ({ items, group }) => {
        await prisma.auditItem.createMany({
            data: items.map(({ name }, i) => ({
                name,
                auditGroupId: group!.id,
                order: i + 1
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