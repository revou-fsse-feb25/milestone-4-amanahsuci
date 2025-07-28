import { PrismaClient, TransactionStatus, TransactionType, AccountType, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const adminUser = await prisma.user.create({
        data: {
            name: 'Admin Revo',
            email: 'admin@revobank.com',
            password: 'adminsecure123',
            role: UserRole.admin,
        },
    });

    const user1 = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'johndoe@revobank.com',
            password: 'qwerty123',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Alex Doe',
            email: 'doe.alex@revobank.com',
            password: 'asdfgh123',
        },
    });

    const user3 = await prisma.user.create({
        data: {
            name: 'Ella Doe',
            email: 'elladoe@revobank.com',
            password: 'zxcvbn1123',
        },
    });

    const account1 = await prisma.account.create({
        data: {
            userId: user1.id,
            accountNumber: '000111999222',
            balance: 1000000.0,
            accountType: AccountType.SAVING,
        },
    });

    const account2 = await prisma.account.create({
        data: {
            userId: user2.id,
            accountNumber: '000111999333',
            balance: 750000.0,
            accountType: AccountType.SAVING,
        },
    });

    const account3 = await prisma.account.create({
        data: {
            userId: user3.id,
            accountNumber: '000111999444',
            balance: 500000.0,
            accountType: AccountType.SAVING,
        },
    });

    await prisma.transaction.create({
        data: {
            fromAccountId: account1.id,
            toAccountId: account2.id,
            amount: 200000.0,
            type: TransactionType.TRANSFER,
            status: TransactionStatus.COMPLETED,
            description: 'Transfer from John to Alex',
        },
    });

    await prisma.transaction.create({
        data: {
            fromAccountId: account2.id,
            toAccountId: account3.id,
            amount: 150000.0,
            type: TransactionType.TRANSFER,
            status: TransactionStatus.COMPLETED,
            description: 'Transfer from Alex to Ella',
        },
    });

    await prisma.transaction.create({
        data: {
            fromAccountId: account3.id,
            toAccountId: account1.id,
            amount: 100000.0,
            type: TransactionType.TRANSFER,
            status: TransactionStatus.COMPLETED,
            description: 'Transfer from Ella to John',
        },
    });

    console.log('✅ Seeding completed!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
