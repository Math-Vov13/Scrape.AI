"use client";
import React, { useState, useEffect } from 'react';
import { Search, FileText, Zap, Shield, Users, ArrowRight, CheckCircle, Star, Brain, Database } from 'lucide-react';
import Link from 'next/link';

export default function ScrapeAILanding() {
    const [isVisible, setIsVisible] = useState(false);
    const [currentFeature, setCurrentFeature] = useState(0);

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const features = [
        {
            icon: <Search className="w-8 h-8" />,
            title: "Intelligent Search",
            description: "Instantly find information across all your company documents"
        },
        {
            icon: <Brain className="w-8 h-8" />,
            title: "Contextual AI",
            description: "Precise answers based on your enterprise context and data"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Maximum Security",
            description: "Your data remains private and secure within your infrastructure"
        }
    ];

    const benefits = [
        "80% reduction in information search time",
        "Improved team productivity and efficiency",
        "Instant access to company knowledge base",
        "Seamless integration with existing tools"
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-40"></div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse delay-1000"></div>

            {/* Navigation */}
            <nav className="relative z-10 p-6 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                        <Database className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                        Scrape.AI
                    </span>
                </div>
                <div className="flex space-x-6">
                    <Link href="/features">
                        <button className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                            Features
                        </button>
                    </Link>
                    <Link href="/pricing">
                        <button className="text-gray-300 hover:text-orange-400 transition-colors duration-200">
                            Pricing
                        </button>
                    </Link>
                    <Link href="/chat">
                        <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-black px-6 py-2 rounded-full hover:from-orange-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-105 font-semibold">
                            Free Demo
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className={`relative z-10 text-center px-6 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-orange-200 bg-clip-text text-transparent leading-tight">
                        Unlock the Power of
                        <span className="block bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                            Your Enterprise Data
                        </span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                        Scrape.AI transforms your company files into an intelligent AI assistant.
                        <br />
                        Ask a question, get precise answers instantly.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <Link href="/chat">
                            <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-black px-8 py-4 rounded-full text-lg font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-105 shadow-2xl shadow-orange-500/25">
                                Start Free Trial
                                <ArrowRight className="inline-block ml-2 w-5 h-5" />
                            </button>
                        </Link>
                        <Link href="/pricing">
                            <button className="border border-orange-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500/10 hover:border-orange-300 transition-all duration-200">
                                Watch Demo
                            </button>
                        </Link>
                    </div>

                    {/* Demo Preview */}
                    <div className="bg-black/60 backdrop-blur-lg rounded-2xl p-6 max-w-2xl mx-auto border border-orange-500/30 shadow-2xl">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <span className="text-gray-400 text-sm">Scrape.AI Assistant</span>
                        </div>
                        <div className="text-left space-y-4">
                            <div className="bg-orange-500/20 p-3 rounded-lg border border-orange-500/30">
                                <p className="text-orange-300 text-sm">Employee:</p>
                                <p className="text-white">"What's our remote work policy for 2025?"</p>
                            </div>
                            <div className="bg-amber-500/20 p-3 rounded-lg border border-amber-500/30">
                                <p className="text-amber-300 text-sm">Assistant:</p>
                                <p className="text-white">According to HR-Policy-2025.pdf, your remote work policy allows up to 3 days per week from home...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="relative z-10 px-6 py-20">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                        Powerful Features
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-black/40 backdrop-blur-lg rounded-xl p-8 border border-orange-500/20 hover:border-orange-500/50 transition-all duration-300 transform hover:scale-105 ${currentFeature === index ? 'ring-2 ring-orange-500/50 bg-orange-500/5' : ''}`}
                            >
                                <div className="text-orange-400 mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="relative z-10 px-6 py-20 bg-black/30">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-12 bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
                        Why Choose Scrape.AI?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center space-x-3 bg-black/50 p-4 rounded-lg border border-orange-500/20 hover:border-orange-500/40 transition-all duration-200">
                                <CheckCircle className="w-6 h-6 text-orange-400 flex-shrink-0" />
                                <span className="text-gray-200">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="relative z-10 px-6 py-16">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div className="bg-black/40 p-6 rounded-xl border border-orange-500/20">
                            <div className="text-3xl font-bold text-orange-400 mb-2">500+</div>
                            <div className="text-gray-300">Companies</div>
                        </div>
                        <div className="bg-black/40 p-6 rounded-xl border border-orange-500/20">
                            <div className="text-3xl font-bold text-orange-400 mb-2">10M+</div>
                            <div className="text-gray-300">Documents Processed</div>
                        </div>
                        <div className="bg-black/40 p-6 rounded-xl border border-orange-500/20">
                            <div className="text-3xl font-bold text-orange-400 mb-2">99.9%</div>
                            <div className="text-gray-300">Uptime</div>
                        </div>
                        <div className="bg-black/40 p-6 rounded-xl border border-orange-500/20">
                            <div className="text-3xl font-bold text-orange-400 mb-2">80%</div>
                            <div className="text-gray-300">Time Saved</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Proof */}
            <div className="relative z-10 px-6 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-400 mb-8">Trusted by leading companies worldwide</p>
                    <div className="flex justify-center items-center space-x-12 opacity-60">
                        <div className="w-32 h-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded flex items-center justify-center">
                            <span className="text-lg font-bold text-orange-400">TECHCORP</span>
                        </div>
                        <div className="w-32 h-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded flex items-center justify-center">
                            <span className="text-lg font-bold text-orange-400">INNOVATE</span>
                        </div>
                        <div className="w-32 h-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded flex items-center justify-center">
                            <span className="text-lg font-bold text-orange-400">GLOBAL</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Final CTA */}
            <div className="relative z-10 px-6 py-20 text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6 text-white">
                        Ready to Transform Your Enterprise Search?
                    </h2>
                    <p className="text-xl text-gray-300 mb-8">
                        Join the companies that have already revolutionized their productivity with Scrape.AI
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/chat">
                            <button className="bg-gradient-to-r from-orange-500 to-amber-500 text-black px-10 py-4 rounded-full text-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-105 shadow-2xl shadow-orange-500/25">
                                Start Free Trial
                                <ArrowRight className="inline-block ml-2 w-6 h-6" />
                            </button>
                        </Link>
                        <Link href="/contact">
                            <button className="border border-orange-400 px-10 py-4 rounded-full text-xl font-semibold hover:bg-orange-500/10 hover:border-orange-300 transition-all duration-200">
                                Contact Sales
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-8 border-t border-orange-500/20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center">
                                <Database className="w-5 h-5 text-black" />
                            </div>
                            <span className="text-lg font-bold text-white">Scrape.AI</span>
                        </div>
                        <div className="flex space-x-6 text-gray-400 text-sm">
                            <button className="hover:text-orange-400 transition-colors">Privacy Policy</button>
                            <button className="hover:text-orange-400 transition-colors">Terms of Service</button>
                            <button className="hover:text-orange-400 transition-colors">Support</button>
                        </div>
                        <div className="text-gray-400 text-sm">
                            © 2025 Scrape.AI. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}