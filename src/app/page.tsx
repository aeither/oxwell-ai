import { HyperText } from "@/components/magicui/hyper-text";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
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
							{/* <Link href="/chat">
								<ShinyButton className="flex flex-row">
									Launch App
								</ShinyButton>
							</Link> */}
							<Button
								variant="secondary"
								disabled
								className="cursor-not-allowed"
							>
								Coming Soon
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
						<HyperText duration={20}>Financial Literacy &</HyperText>

						<HyperText duration={20}>Investment Insights Platform</HyperText>
					</h1>
					<p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto mb-8">
						Gain valuable financial knowledge and investment insights through
						our blockchain-based platform. Learn, earn, and share expert
						insights.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						{/* <Link href="/chat"> */}
						{/* <ShinyButton> */}
						{/* Get Started */}
						{/* <ArrowRight className="ml-2 h-5 w-5" /> */}
						{/* </ShinyButton> */}
						{/* </Link> */}
						<Button variant="secondary" disabled className="cursor-not-allowed">
							Coming Soon
						</Button>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section id="features" className="py-20 px-4">
				<div className="container mx-auto">
					<HyperText className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
						Powerful Features
					</HyperText>
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								title: "Knowledge Sharing",
								description:
									"Create and share educational content and valuable investment insights with the community.",
							},
							{
								title: "On-chain Certification",
								description:
									"Earn NFT certificates upon completing courses or demonstrating financial knowledge.",
							},
							{
								title: "Social Scoring",
								description:
									"Build reputation through our social scoring system that rewards valuable content creation.",
							},
							{
								title: "Tokenized Incentives",
								description:
									"Receive and give tokens for quality content and active participation in the ecosystem.",
							},
							{
								title: "Smart Contract Integration",
								description:
									"All shared content and certifications are registered on the blockchain for transparency.",
							},
							{
								title: "Learn-to-Earn Model",
								description:
									"Gain knowledge, earn NFT certificates, and receive governance tokens as you learn.",
							},
						].map((feature) => (
							<div
								key={`feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
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
						<HyperText>How it Works</HyperText>
					</h2>
					<div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						{[
							{
								step: "01",
								title: "Create & Learn",
								description:
									"Access educational content or create your own investment insights to share",
							},
							{
								step: "02",
								title: "Earn & Certify",
								description:
									"Receive NFT certificates and tokens for your participation and contributions",
							},
							{
								step: "03",
								title: "Share & Grow",
								description:
									"Build reputation by sharing quality content and grow your financial knowledge",
							},
						].map((step, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
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
							{new Date().getFullYear()} Oxwell. All rights reserved.
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
