import Link from "next/link";
import React from "react";

interface layoutProps {
	children: React.ReactNode;
}

const layout: React.FC<layoutProps> = ({ children }) => {
	return (
		<div>
			<Link href="/blog/posts/new">create new post</Link>
			{children}
		</div>
	);
};

export default layout;
