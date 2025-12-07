"use client";

import Link from "next/link";
import React, { useState } from "react";

interface UserProps {
	user: any;
}

const User: React.FC<UserProps> = ({ user }) => {
	const [selected, setSelected] = useState(false);

	return (
		<li
			key={user.id}
			className="flex flex-col items-start gap-2 border w-fit m-5 p-5"
		>
			<Link href={`/users/${user.id}`}>Open profile page</Link>
			<span
				onClick={() => setSelected(!selected)}
				className={`${selected && "line-through"} text-white text-xl`}
			>
				{user.name}
			</span>
		</li>
	);
};

export default User;
