import React from 'react';
import Head from 'next/head';

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: PricingFeature[];
  highlighted?: boolean;
  ctaText: string;
}

interface ServiceCard {
  icon: string;
  title: string;
  description: string;
  pricing: string;
}

const PricingPage: React.FC = () => {
  const pricingPlans: PricingPlan[] = [
    {
      name: "Standard",
      price: "€15",
      period: "per user/month",
      description: "Ideal for small teams",
      features: [
        { text: "Up to 5 connectors", included: true },
        { text: "Email support", included: true },
        { text: "Monthly report", included: true },
        { text: "Priority support", included: false },
        { text: "Unlimited connectors", included: false },
        { text: "Full integration", included: false }
      ],
      ctaText: "Get Started"
    },
    {
      name: "Premium",
      price: "€25",
      period: "per user/month",
      description: "For growing teams",
      features: [
        { text: "Unlimited connectors", included: true },
        { text: "Priority support", included: true },
        { text: "Weekly report", included: true },
        { text: "Advanced API", included: true },
        { text: "Dedicated 24/7 support", included: false },
        { text: "Custom features", included: false }
      ],
      highlighted: true,
      ctaText: "Try Premium"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact sales",
      description: "Complete solution for large organizations",
      features: [
        { text: "Full integration", included: true },
        { text: "Dedicated 24/7 support", included: true },
        { text: "Custom features", included: true },
        { text: "Customized training", included: true },
        { text: "Guaranteed SLA", included: true },
        { text: "On-premise deployment", included: true }
      ],
      ctaText: "Contact Us"
    }
  ];

  const services: ServiceCard[] = [
    {
      icon: "🔄",
      title: "SaaS Subscription",
      description: "Monthly or annual subscription model based on the number of active users, with tiered pricing allowing companies to choose the plan that fits their needs.",
      pricing: "Starting at €15/user/month"
    },
    {
      icon: "🔗",
      title: "Integration Services",
      description: "One-time fees to connect ScrapeAI to existing systems, configure custom connectors, and ensure optimal implementation tailored to the client's infrastructure.",
      pricing: "€2000 - €8000 depending on complexity"
    },
    {
      icon: "👥",
      title: "Professional Services",
      description: "Strategic consulting, in-depth training, and development of custom features for clients with specific needs.",
      pricing: "€1200/day consulting"
    }
  ];

  return (
    <>
      <Head>
        <title>Pricing - ScrapeAI</title>
        <meta
          name="description"
          content="Discover our ScrapeAI offerings to optimize your company's resource sharing with our interactive chatbot."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="bg-black text-white py-8">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl">
                  S
                </div>
                <span className="text-2xl font-bold text-white">ScrapeAI</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="hover:text-orange-400 text-gray-300 transition-colors">Home</a>
                <a href="/" className="hover:text-orange-400 text-gray-300 transition-colors">Features</a>
                <a href="#" className="text-orange-400">Pricing</a>
                <a href="/contact" className="hover:text-orange-400 text-gray-300 transition-colors">Contact</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your <span className="text-orange-500">ScrapeAI Plan</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Optimize your company's resource sharing with our interactive chatbot. Flexible solutions that adapt to your needs.
            </p>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Our <span className="text-orange-500">Services</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500"
                >
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
                  <div className="text-orange-600 font-semibold">{service.pricing}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-white mb-4">
              Subscription <span className="text-orange-500">Plans</span>
            </h2>
            <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
              Choose the plan that best suits your needs. All our plans include access to our interactive chatbot.
            </p>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div
                  key={index}
                  className={`relative rounded-2xl p-8 ${
                    plan.highlighted
                      ? 'bg-gradient-to-b from-orange-50 to-white border-2 border-orange-500 shadow-2xl scale-105'
                      : 'bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl'
                  } transition-all duration-300`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-gray-900' : 'text-white'}`}>
                      {plan.name}
                    </h3>
                    <p className={plan.highlighted ? 'text-gray-600 mb-4' : 'text-gray-300 mb-4'}>
                      {plan.description}
                    </p>
                    <div className="mb-2">
                      <span className={plan.highlighted ? 'text-gray-900 text-4xl font-bold' : 'text-white text-4xl font-bold'}>
                        {plan.price}
                      </span>
                    </div>
                    <p className={plan.highlighted ? 'text-gray-500 text-sm' : 'text-gray-400 text-sm'}>
                      {plan.period}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            feature.included ? 'bg-green-100 text-green-600' : 'bg-gray-700 text-gray-500'
                          }`}
                        >
                          {feature.included ? '✓' : '×'}
                        </div>
                        <span className={plan.highlighted ? (feature.included ? 'text-gray-900' : 'text-gray-500') : (feature.included ? 'text-white' : 'text-gray-500')}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      plan.highlighted
                        ? 'bg-orange-500 hover:bg-orange-600 text-white'
                        : 'bg-gray-900 hover:bg-black text-white'
                    }`}
                  >
                    {plan.ctaText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Revenue Distribution Chart */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Revenue <span className="text-orange-500">Distribution</span>
            </h2>
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <div className="relative w-64 h-64 mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                      {/* SaaS Subscriptions - 60% */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="40"
                        strokeDasharray="301.59 502.65"
                        className="opacity-80"
                      />
                      {/* Integration Services - 25% */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#ea580c"
                        strokeWidth="40"
                        strokeDasharray="125.66 502.65"
                        strokeDashoffset="-301.59"
                        className="opacity-80"
                      />
                      {/* Professional Services - 15% */}
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#9a3412"
                        strokeWidth="40"
                        strokeDasharray="75.4 502.65"
                        strokeDashoffset="-427.25"
                        className="opacity-80"
                      />
                    </svg>
                  </div>
                </div>
                <div className="md:w-1/2 md:pl-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-gray-300">SaaS Subscriptions (60%)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-orange-600 rounded"></div>
                      <span className="text-gray-300">Integration Services (25%)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-orange-800 rounded"></div>
                      <span className="text-gray-300">Professional Services (15%)</span>
                    </div>
                  </div>
                  <p className="text-gray-400 mt-6">
                    Our diversified business model ensures stable growth with recurring revenue complemented by value-added services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to optimize your resource sharing?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join the companies that trust ScrapeAI to improve their efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                14-Day Free Trial
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                Request a Demo
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black text-white py-12">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center font-bold">
                    S
                  </div>
                  <span className="text-xl font-bold">ScrapeAI</span>
                </div>
                <p className="text-gray-400">
                  The intelligent solution to optimize resource sharing in your company.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-white">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Partners</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 ScrapeAI. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PricingPage;
