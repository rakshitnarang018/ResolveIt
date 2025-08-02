import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ArrowRightIcon, ScaleIcon, CheckIcon, StarIcon, UsersIcon, ShieldCheckIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Head>
        <title>ResolveIt - Fair Dispute Resolution</title>
        <meta name="description" content="A platform for fair and transparent dispute resolution through mediation." />
      </Head>

      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="bg-gradient-to-r from-primary to-blue-500 p-1.5 rounded-lg">
                  <ScaleIcon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                  ResolveIt
                </span>
              </div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-6">
                <Link href="#features" className="text-gray-600 hover:text-primary font-medium transition-colors text-sm">Features</Link>
                <Link href="#how-it-works" className="text-gray-600 hover:text-primary font-medium transition-colors text-sm">How It Works</Link>
                <Link href="#testimonials" className="text-gray-600 hover:text-primary font-medium transition-colors text-sm">Reviews</Link>
                
                {isAuthenticated ? (
                  <Link 
                    href={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                    className="bg-gradient-to-r from-primary to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all text-sm"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link href="/login" className="text-gray-600 hover:text-primary font-medium text-sm">Login</Link>
                    <Link 
                      href="/register" 
                      className="bg-gradient-to-r from-primary to-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all text-sm"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-1">
                  {mobileMenuOpen ? (
                    <XMarkIcon className="h-5 w-5 text-gray-600" />
                  ) : (
                    <Bars3Icon className="h-5 w-5 text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-3 border-t border-gray-100">
                <div className="flex flex-col space-y-2">
                  <Link href="#features" className="text-gray-600 hover:text-primary font-medium py-1 text-sm">Features</Link>
                  <Link href="#how-it-works" className="text-gray-600 hover:text-primary font-medium py-1 text-sm">How It Works</Link>
                  <Link href="#testimonials" className="text-gray-600 hover:text-primary font-medium py-1 text-sm">Reviews</Link>
                  {!isAuthenticated && (
                    <>
                      <Link href="/login" className="text-gray-600 hover:text-primary font-medium py-1 text-sm">Login</Link>
                      <Link href="/register" className="bg-gradient-to-r from-primary to-blue-500 text-white px-4 py-2 rounded-lg font-medium text-center text-sm mt-2">Get Started</Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-14 min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left Content */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    🏆 India's #1 Dispute Resolution Platform
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
                    Resolve Disputes
                    <span className="block bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                      Fairly & Fast
                    </span>
                  </h1>
                  <p className="text-base text-gray-600 leading-relaxed max-w-lg">
                    Connect with expert mediators and resolve your conflicts with complete transparency. Save time, money and relationships with our AI-powered matching system.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {isAuthenticated ? (
                    <Link 
                      href={user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                      className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      Go to Dashboard
                      <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : (
                    <>
                      <Link 
                        href="/register"
                        className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-blue-500 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                      >
                        Start Free Case
                        <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <Link 
                        href="/login"
                        className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-700 font-bold rounded-lg shadow-md border border-gray-200 hover:border-blue-300 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center space-x-6 pt-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">25K+</div>
                    <div className="text-xs text-gray-600">Cases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">98.5%</div>
                    <div className="text-xs text-gray-600">Success</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">24/7</div>
                    <div className="text-xs text-gray-600">Support</div>
                  </div>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-2xl blur-2xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                  alt="Professional mediation"
                  className="relative rounded-2xl shadow-xl w-full h-auto object-cover"
                />
                {/* Floating Stats */}
                <div className="absolute -top-3 -left-3 bg-white rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <CheckIcon className="h-4 w-4 text-green-600" />
                    <div>
                      <div className="font-bold text-gray-900 text-xs">Case Resolved!</div>
                      <div className="text-xs text-gray-600">In 5 days</div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-3 -right-3 bg-white rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <div>
                      <div className="font-bold text-gray-900 text-xs">5.0 Rating</div>
                      <div className="text-xs text-gray-600">Expert</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                Why <span className="text-primary">ResolveIt</span> is Different
              </h2>
              <p className="text-base text-gray-600 max-w-2xl mx-auto">
                Experience the future of dispute resolution with our cutting-edge platform
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "AI-Powered Matching",
                  description: "Our AI analyzes your case and matches you with the perfect mediator based on expertise and success rate.",
                  image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                  icon: "🤖"
                },
                {
                  title: "Complete Transparency",
                  description: "Track every step with real-time updates, document sharing, and complete visibility into the process.",
                  image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                  icon: "👁️"
                },
                {
                  title: "Expert Mediators",
                  description: "Access to 500+ certified mediators with proven track records across various dispute categories.",
                  image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                  icon: "⚖️"
                }
              ].map((feature, index) => (
                <div key={index} className="group bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="text-2xl mb-3">{feature.icon}</div>
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-32 object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"
                  />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
              <p className="text-base text-gray-600">Get your dispute resolved in 3 simple steps</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Submit Your Case",
                  description: "Upload your dispute details and documents. Our AI analyzes your case for the best resolution path.",
                  image: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                },
                {
                  step: "02",
                  title: "Get Expert Match",
                  description: "Our AI matches you with the most suitable mediator based on case type and success history.",
                  image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                },
                {
                  step: "03",
                  title: "Resolve & Celebrate",
                  description: "Work with your mediator through video calls and structured negotiations to reach a solution.",
                  image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl font-black text-blue-100 mb-3">{item.step}</div>
                  <img 
                    src={item.image}
                    alt={item.title}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                What Our <span className="text-primary">Clients</span> Say
              </h2>
              <p className="text-base text-gray-600">Join thousands who resolved their disputes successfully</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: "Rajesh Kumar",
                  role: "Business Owner, Mumbai",
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                  testimonial: "ResolveIt saved my business partnership! Professional mediator helped us reach a solution in 10 days.",
                  rating: 5
                },
                {
                  name: "Priya Sharma",
                  role: "Freelancer, Delhi",
                  image: "https://images.unsplash.com/photo-1494790108755-2616b612b691?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                  testimonial: "Transparent process and got my payment within 2 weeks. Smooth and stress-free experience.",
                  rating: 5
                },
                {
                  name: "Amit Patel",
                  role: "Developer, Bangalore",
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
                  testimonial: "AI matching connected me with a property specialist. Saved lakhs in legal fees!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <img 
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-4 w-4" />
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-700 leading-relaxed">"{testimonial.testimonial}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 bg-gradient-to-r from-primary to-blue-500">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
              Ready to Resolve Your Dispute?
            </h2>
            <p className="text-base text-blue-100 mb-6 max-w-2xl mx-auto">
              Join 25,000+ satisfied customers who chose the smart way to resolve conflicts.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/register"
                  className="group inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-bold rounded-lg shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
                >
                  Start Your Case Now
                  <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/login"
                  className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-white font-bold rounded-lg border-2 border-white/30 hover:bg-white/10 transform hover:scale-105 transition-all duration-300"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}