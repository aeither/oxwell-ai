import { Button } from "@/components/ui/button";
import { ArrowRight, Github } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-slate-900">
			{/* Navigation */}
			<header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-sm border-b border-gray-800">
				<div className="container mx-auto px-4">
					<nav className="flex items-center justify-between h-16">
						<div className="flex items-center space-x-8">
							<Link href="/" className="flex items-center space-x-2">
								<Image
									src="https://github.com/user-attachments/assets/1c73a062-68bc-41f4-95e8-85edc219964b"
									alt="Oxwell Logo"
									width={32}
									height={32}
									className="w-8 h-8"
								/>
								<span className="text-white font-semibold text-xl">Oxwell</span>
							</Link>
							<div className="hidden md:flex space-x-6">
								<Link
									href="#features"
									className="text-gray-300 hover:text-white transition-colors"
								>
									Features
								</Link>
								<Link
									href="#how-it-works"
									className="text-gray-300 hover:text-white transition-colors"
								>
									How it Works
								</Link>
								<Link
									href="#about"
									className="text-gray-300 hover:text-white transition-colors"
								>
									About
								</Link>
							</div>
						</div>
						<div className="flex items-center space-x-4">
							<Button className="bg-white text-black hover:bg-gray-200">
								Launch App
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
						</div>
					</nav>
				</div>
			</header>

			{/* Hero Section */}
			<section className="pt-32 pb-20 px-4">
				<div className="container mx-auto text-center">
					<div className="flex justify-center mb-8">
						<Image
							src="https://github.com/user-attachments/assets/1c73a062-68bc-41f4-95e8-85edc219964b"
							alt="Oxwell Logo"
							width={300}
							height={300}
							priority
							className="w-48 h-48 md:w-64 md:h-64"
						/>
					</div>
					<h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
						Your Personal Cross-Chain
						<br />
						DeFi Portfolio Agent
					</h1>
					<p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8">
						Navigate the complex world of decentralized finance with confidence.
						Oxwell ensures your crypto endeavors are always handled with utmost
						expertise.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Button className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-6">
							Get Started
							<ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 px-4">
				<div className="container mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
						Powerful Features
					</h2>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								title: "Token Swaps",
								description:
									"Execute cross-chain token swaps effortlessly between supported chains.",
							},
							{
								title: "Asset Bridging",
								description:
									"Bridge assets between different blockchain networks with ease.",
							},
							{
								title: "Balance Checking",
								description:
									"Real-time monitoring of portfolio balances across various chains in one place.",
							},
							{
								title: "Strategic Trading",
								description:
									"Execute trades based on user commands and market analysis across different DEXs.",
							},
							{
								title: "Natural Language Interface",
								description:
									"Interact with DeFi protocols on multiple chains using simple chat commands.",
							},
							{
								title: "Dexalot Integration",
								description:
									"Support for non-custodial, omni-chain DEX that integrates with multiple mainnets.",
							},
						].map((feature, index) => (
							<div
								key={index}
								className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors"
							>
								<h3 className="text-xl font-semibold text-white mb-3">
									{feature.title}
								</h3>
								<p className="text-gray-400">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* How it Works Section */}
			<section id="how-it-works" className="py-20 px-4 bg-black/30">
				<div className="container mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
						How it Works
					</h2>
					<div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						{[
							{
								step: "01",
								title: "Natural Language Input",
								description:
									"Simply tell Oxwell what you want to do in plain English",
							},
							{
								step: "02",
								title: "Smart Processing",
								description:
									"Oxwell reads onchain data or executes your requested action",
							},
							{
								step: "03",
								title: "Human-Friendly Response",
								description:
									"Get clear, understandable feedback about your transaction",
							},
						].map((step, index) => (
							<div key={index} className="text-center">
								<div className="text-5xl font-bold text-white/10 mb-4">
									{step.step}
								</div>
								<h3 className="text-xl font-semibold text-white mb-2">
									{step.title}
								</h3>
								<p className="text-gray-400">{step.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Screenshots Section */}
			<section className="py-20 px-4">
				<div className="container mx-auto">
					<div className="grid md:grid-cols-2 gap-8">
						<Image
							src="https://github.com/user-attachments/assets/2c8dcd6e-b5d5-4b75-a5b8-dd6eafebf01a"
							alt="Oxwell Interface Screenshot 1"
							width={800}
							height={600}
							className="rounded-xl border border-gray-800"
						/>
						<Image
							src="https://github.com/user-attachments/assets/813805a0-4d52-4a31-b561-1cd63e305d84"
							alt="Oxwell Interface Screenshot 2"
							width={800}
							height={600}
							className="rounded-xl border border-gray-800"
						/>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 px-4 border-t border-gray-800">
				<div className="container mx-auto">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<div className="flex items-center space-x-2 mb-4 md:mb-0">
							<Image
								src="https://github.com/user-attachments/assets/1c73a062-68bc-41f4-95e8-85edc219964b"
								alt="Oxwell Logo"
								width={24}
								height={24}
								className="w-6 h-6"
							/>
							<span className="text-white font-semibold">Oxwell</span>
						</div>
						<div className="text-gray-400 text-sm">
							© {new Date().getFullYear()} Oxwell. All rights reserved.
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}

