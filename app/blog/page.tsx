import prisma from "@/lib/prisma";

export default async function Home() {
	const users = await prisma.user.findMany();

	return (
		<div>
			<h1 className="text-4xl font-bold mb-8 font-[family-name:var(--font-geist-sans)] text-[#333333]">
				Superblog
			</h1>
			<ol className="list-decimal list-inside font-[family-name:var(--font-geist-sans)]">
				{users.map((user) => (
					<li key={user.id} className="mb-2">
						{user.name} {user.email}
					</li>
				))}
			</ol>
		</div>
	);
}
