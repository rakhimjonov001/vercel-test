import React from "react";

const page: React.FC = async ({ params }) => {
	const id = (await params).id;
	const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
	const user = await res.json();

	return (
		<div>
			<h1>Users{" ' "} page</h1>
			<h2>{user.name}</h2>
		</div>
	);
};

export default page;
