import { PrismaClient } from '@prisma/client'
import * as argon2 from "argon2";
const prisma = new PrismaClient()

const defaultPassword = '123456'

async function main() {

    const adminHash = await argon2.hash(defaultPassword);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {
            password: adminHash,
        },
        create: {
            username: 'admin',
            password: 'adminHash',
            role: 'ADMIN',
        },
    })
    const userHash = await argon2.hash(defaultPassword);
    const user = await prisma.user.upsert({
        where: { username: 'user' },
        update: {
            password: userHash,
        },
        create: {
            username: 'user',
            password: userHash,
        },
    })
    console.log({ admin, user })
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