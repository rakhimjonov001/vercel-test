import { LoaderPinwheel } from "lucide-react";

export default function Loading() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100 px-4">
			<div className="w-full max-w-md animate-pulse space-y-4">
				<div className="h-6 w-3/4 rounded bg-gray-300"></div>
				<div className="h-4 w-full rounded bg-gray-300"></div>
				<div className="h-4 w-5/6 rounded bg-gray-300"></div>
				<div className="h-4 w-4/6 rounded bg-gray-300"></div>
			</div>

			<div className="flex items-center gap-2 text-gray-500">
				<LoaderPinwheel className="animate-spin h-5 w-5" />
				<span>Loading page…</span>
			</div>
		</div>
	);
}
