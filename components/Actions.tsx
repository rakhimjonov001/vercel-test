"use client";
import React, { useState } from "react";

interface ActionsProps {}

const Actions: React.FC<ActionsProps> = () => {
	const [text, setText] = useState("hola amigo");
	return (
		<div>
			<button onClick={() => setText("new text")}>change text</button>
			<h1 className="text-white">{text}</h1>
		</div>
	);
};

export default Actions;
