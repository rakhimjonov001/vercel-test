import Link from "next/link";
import React from "react";

interface layoutProps {
	children: React.ReactNode;
}

export default function layout({ children }: layoutProps) {
	return (
		<div className="flex min-h-screen">
			<aside className="w-64 bg-gray-100 p-6 space-y-4">
				<nav className="flex flex-col space-y-3">
					<Link
						href="/about"
						className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors"
					>
						Overview
					</Link>
					<Link
						href="/about/team"
						className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors"
					>
						Explore our team mates
					</Link>
					<Link
						href="/about/history"
						className="text-lg font-semibold text-gray-700 hover:text-blue-600 transition-colors"
					>
						Explore our big history
					</Link>
				</nav>
			</aside>
			<main className="flex-1 p-6">{children}</main>
		</div>
	);
}

// presentation
// parallel routes
// sql - no sql // relation // geo-sql //
// self hosted system
// OAuth
// ORM // prisma and others
// ISG ISR etc
