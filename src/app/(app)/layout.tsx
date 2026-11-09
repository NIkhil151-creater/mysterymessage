import type { Metadata } from "next";
import { Poppins, Instrument_Sans, Noto_Serif } from "next/font/google";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";

const notoSerifHeading = Noto_Serif({ subsets: ['latin'], variable: '--font-heading' });

const instrumentSans = Instrument_Sans({ subsets: ['latin'], variable: '--font-sans' });

const poppins = Poppins({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Mystery Message",
	description: "Share honest messages anonymously with Mystery Message.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" className={cn("dark", "h-full", "antialiased", poppins.className, "font-sans", instrumentSans.variable, notoSerifHeading.variable)}>
			<body className="min-h-full flex flex-col">
				<Navbar />
				{children}
			</body>
		</html>
	);
}
