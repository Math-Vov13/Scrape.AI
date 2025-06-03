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
      price: "15€",
      period: "par utilisateur/mois",
      description: "Idéal pour les petites équipes",
      features: [
        { text: "Jusqu'à 5 connecteurs", included: true },
        { text: "Support par email", included: true },
        { text: "Rapport mensuel", included: true },
        { text: "Support prioritaire", included: false },
        { text: "Connecteurs illimités", included: false },
        { text: "Intégration complète", included: false }
      ],
      ctaText: "Commencer"
    },
    {
      name: "Premium",
      price: "25€",
      period: "par utilisateur/mois",
      description: "Pour les équipes en croissance",
      features: [
        { text: "Connecteurs illimités", included: true },
        { text: "Support prioritaire", included: true },
        { text: "Rapport hebdomadaire", included: true },
        { text: "API avancée", included: true },
        { text: "Support dédié 24/7", included: false },
        { text: "Fonctionnalités sur mesure", included: false }
      ],
      highlighted: true,
      ctaText: "Essayer Premium"
    },
    {
      name: "Enterprise",
      price: "Sur mesure",
      period: "contact commercial",
      description: "Solution complète pour grandes entreprises",
      features: [
        { text: "Intégration complète", included: true },
        { text: "Support dédié 24/7", included: true },
        { text: "Fonctionnalités sur mesure", included: true },
        { text: "Formation personnalisée", included: true },
        { text: "SLA garanti", included: true },
        { text: "Déploiement sur site", included: true }
      ],
      ctaText: "Nous contacter"
    }
  ];

  const services: ServiceCard[] = [
    {
      icon: "🔄",
      title: "Abonnement SaaS",
      description: "Modèle d'abonnement mensuel ou annuel basé sur le nombre d'utilisateurs actifs, avec tarification par paliers permettant aux entreprises de choisir la formule adaptée à leurs besoins.",
      pricing: "À partir de 15€/utilisateur/mois"
    },
    {
      icon: "🔗",
      title: "Services d'Intégration",
      description: "Frais uniques pour connecter Scrape.AI aux systèmes existants, configurer les connecteurs personnalisés et assurer une mise en œuvre optimale adaptée à l'infrastructure du client.",
      pricing: "2000€ - 8000€ selon la complexité"
    },
    {
      icon: "👥",
      title: "Services Professionnels",
      description: "Accompagnement stratégique, formation approfondie et développement de fonctionnalités sur mesure pour les clients ayant des besoins spécifiques.",
      pricing: "1200€/jour de conseil"
    }
  ];

  return (
    <>
      <Head>
        <title>Tarification - ScrapeAI</title>
        <meta name="description" content="Découvrez nos offres ScrapeAI pour optimiser le partage de ressources de votre entreprise avec notre chatbot interactif." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-black text-white py-8">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center font-bold text-xl">
                  S
                </div>
                <span className="text-2xl font-bold">ScrapeAI</span>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="/" className="hover:text-orange-400 transition-colors">Accueil</a>
                <a href="/" className="hover:text-orange-400 transition-colors">Fonctionnalités</a>
                <a href="#" className="text-orange-400">Tarification</a>
                <a href="/contact" className="hover:text-orange-400 transition-colors">Contact</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Choisissez votre <span className="text-orange-500">plan ScrapeAI</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Optimisez le partage de ressources de votre entreprise avec notre chatbot interactif. 
              Des solutions flexibles qui s'adaptent à vos besoins.
            </p>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Nos <span className="text-orange-500">Services</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-orange-500">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                  <div className="text-orange-600 font-semibold">{service.pricing}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Formules d'<span className="text-orange-500">Abonnement</span>
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Choisissez le plan qui correspond le mieux à vos besoins. Tous nos plans incluent l'accès à notre chatbot interactif.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`relative rounded-2xl p-8 ${
                    plan.highlighted 
                      ? 'bg-gradient-to-b from-orange-50 to-white border-2 border-orange-500 shadow-2xl scale-105' 
                      : 'bg-white border border-gray-200 shadow-lg hover:shadow-xl'
                  } transition-all duration-300`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                        Plus populaire
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <p className="text-gray-600 mb-4">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      {plan.price !== "Sur mesure" && <span className="text-gray-600">€</span>}
                    </div>
                    <p className="text-gray-500 text-sm">{plan.period}</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                          feature.included ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {feature.included ? '✓' : '×'}
                        </div>
                        <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    plan.highlighted
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-900 hover:bg-black text-white'
                  }`}>
                    {plan.ctaText}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Revenue Distribution Chart */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Répartition des <span className="text-orange-500">Revenus</span>
            </h2>
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-1/2 mb-8 md:mb-0">
                  <div className="relative w-64 h-64 mx-auto">
                    <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                      {/* Abonnements SaaS - 60% */}
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
                      {/* Services d'intégration - 25% */}
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
                      {/* Services Professionnels - 15% */}
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
                      <span className="text-gray-700">Abonnements SaaS (60%)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-orange-600 rounded"></div>
                      <span className="text-gray-700">Services d'intégration (25%)</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-orange-800 rounded"></div>
                      <span className="text-gray-700">Services Professionnels (15%)</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-6">
                    Notre modèle économique diversifié assure une croissance stable avec des revenus récurrents 
                    complétés par des services à valeur ajoutée.
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
              Prêt à optimiser votre partage de ressources ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez les entreprises qui font confiance à ScrapeAI pour améliorer leur efficacité.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Essai gratuit 14 jours
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                Demander une démo
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
                  La solution intelligente pour optimiser le partage de ressources en entreprise.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Produit</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Intégrations</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Formation</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Entreprise</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Partenaires</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 ScrapeAI. Tous droits réservés.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default PricingPage;