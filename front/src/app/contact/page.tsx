"use client";
import React, { useState } from 'react';
import Head from 'next/head';

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  phone: string;
  subject: string;
  message: string;
  interests: string[];
}

interface ContactMethod {
  icon: string;
  title: string;
  description: string;
  value: string;
  action: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    subject: '',
    message: '',
    interests: []
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const contactMethods: ContactMethod[] = [
    {
      icon: '📧',
      title: 'Email',
      description: 'Reach out to us via email for any questions',
      value: 'contact@scrapeai.com',
      action: 'mailto:contact@scrapeai.com'
    },
    {
      icon: '📞',
      title: 'Phone',
      description: 'Call us Monday to Friday from 9am to 6pm',
      value: '+33 1 23 45 67 89',
      action: 'tel:+33123456789'
    },
    {
      icon: '💬',
      title: 'Live Chat',
      description: 'Chat with our support team in real time',
      value: 'Chat available 24/7',
      action: '#'
    },
    {
      icon: '📍',
      title: 'Address',
      description: 'Visit our office',
      value: '123 Rue de la Tech, 75001 Paris',
      action: 'https://maps.google.com'
    }
  ];

  const interestOptions = [
    'SaaS Subscription',
    'Integration Services',
    'Professional Services',
    'Product Demo',
    'Partnership',
    'Technical Support'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for your message! We will get back to you within 24 hours.');
      setIsSubmitting(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        interests: []
      });
    }, 2000);
  };

  return (
    <>
      <Head>
        <title>Contact - ScrapeAI</title>
        <meta
          name="description"
          content="Get in touch with the ScrapeAI team for any questions about our resource-sharing solutions with an interactive chatbot."
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
                <a href="/pricing" className="hover:text-orange-400 text-gray-300 transition-colors">Pricing</a>
                <a href="#" className="text-orange-400">Contact</a>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in Touch with <span className="text-orange-500">Our Team</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              We’re here to answer your questions and help you optimize your company’s resource sharing.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-white mb-12">
              Multiple Ways to <span className="text-orange-500">Contact Us</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500 group"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{method.title}</h3>
                  <p className="text-gray-300 mb-4 text-sm">{method.description}</p>
                  <a
                    href={method.action}
                    className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
                  >
                    {method.value}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Send Us a <span className="text-orange-500">Message</span>
                </h2>
                <p className="text-gray-300">
                  Fill out the form below and we will respond quickly.
                </p>
              </div>

              {submitMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 text-green-800">
                  {submitMessage}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700"
              >
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-300 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-300 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="your@company.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="+33 1 23 45 67 89"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-semibold text-gray-300 mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      placeholder="Your company name"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-gray-300 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select a subject</option>
                      <option value="demo">Product Demo Request</option>
                      <option value="pricing">Pricing Inquiry</option>
                      <option value="integration">Integration Services</option>
                      <option value="support">Technical Support</option>
                      <option value="partnership">Partnership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Interests (optional)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interestOptions.map((interest, index) => (
                      <label key={index} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.interests.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                          className="w-4 h-4 text-orange-500 bg-gray-900 border-gray-600 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-300">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-8">
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe your project or needs in detail..."
                  />
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-8 py-4 rounded-lg font-semibold text-white transition-all duration-300 ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600 hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      'Send Message'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-white mb-12">
                Frequently Asked <span className="text-orange-500">Questions</span>
              </h2>
              <div className="space-y-6">
                <div className="bg-gray-800 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    How long does it take to integrate ScrapeAI?
                  </h3>
                  <p className="text-gray-300">
                    Standard integration usually takes between 2 to 4 weeks depending on your infrastructure’s complexity. Our professional integration services can expedite this process.
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Do you offer a free trial?
                  </h3>
                  <p className="text-gray-300">
                    Yes, we offer a 14-day free trial for all plans. No credit card is required.
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-6 shadow-md">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    What type of support do you offer?
                  </h3>
                  <p className="text-gray-300">
                    We provide email support for all plans, priority support for Premium, and dedicated 24/7 support for Enterprise.
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
              Prefer to Chat Directly?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Schedule a call with our team to see how ScrapeAI can transform your business.
            </p>
            <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Schedule a Call
            </button>
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
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
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

export default ContactPage;
