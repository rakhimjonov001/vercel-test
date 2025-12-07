import { Prisma } from "@/app/generated/prisma/browser";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
	adapter,
});

const userData: Prisma.UserCreateInput[] = [
	{
		name: "Jasur",
		email: "jasur@prisma.io",
		posts: {
			create: [
				{
					title: "Join the Prisma Discord",
					content: "https://pris.ly/discord",
					published: true,
				},
				{
					title: "Prisma on YouTube",
					content: "https://pris.ly/youtube",
				},
			],
		},
	},
	{
		name: "Samir",
		email: "samka@prisma.io",
		posts: {
			create: [
				{
					title: "Follow Prisma on Twitter",
					content: "https://www.twitter.com/prisma",
					published: true,
				},
			],
		},
	},
];

async function main() {
	console.log('Start seeding...');
	
	for (const u of userData) {
		const user = await prisma.user.create({ data: u });
		console.log(`Created user with id: ${user.id}`);
	}
	
	console.log('Seeding finished.');
}

main()
	.catch((e) => {
		console.error('Error during seeding:', e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});