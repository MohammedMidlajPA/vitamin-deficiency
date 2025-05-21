
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Pill, Shield, Zap, Users, Sparkles, Star, Check, Award, Flower, Database, HeartPulse } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

const BackgroundImages = [
  "/images/plant-bg-1.jpg",
  "/images/plant-bg-2.jpg",
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Health Enthusiast",
    content: "Vitamin AI helped me identify my vitamin D deficiency quickly! The treatment advice made a huge difference in my energy levels.",
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Nutrition Coach",
    content: "As a professional, I'm impressed with the accuracy. It's like having a nutrition lab in my pocket.",
    avatar: "MC"
  },
  {
    name: "Emily Rodriguez",
    role: "Fitness Trainer",
    content: "The instant results and supplement recommendations have been invaluable for helping my clients optimize their nutrition.",
    avatar: "ER"
  }
];

const Home = () => {
  const navigate = useNavigate();
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Background Images with Overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/95 to-indigo-900/95" />
        {BackgroundImages.map((img, index) => (
          <div 
            key={index}
            className={`absolute inset-0 opacity-20 bg-no-repeat bg-cover mix-blend-overlay transition-opacity duration-1000 ease-in-out ${index === 0 ? 'animate-fade-in' : ''}`}
            style={{ backgroundImage: `url(${img})`, animationDelay: `${index * 0.5}s` }}
          />
        ))}
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Pill className="h-4 w-4 text-blue-300" />
              </div>
              <div className="text-xl font-semibold text-white">Vitamin <span className="text-blue-300">AI</span></div>
            </div>
            <div className="flex items-center gap-4">
              <SignedIn>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-blue-200 hover:bg-white/10"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-blue-200 hover:bg-white/10"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Enhanced */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-blue-500/10 blur-md animate-pulse"></div>
                <div className="h-16 w-16 rounded-full bg-blue-500/30 flex items-center justify-center mb-6 relative">
                  <Pill className="h-8 w-8 text-blue-300" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-indigo-200 to-blue-100">
              Vitamin AI
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Your intelligent companion for vitamin deficiency detection and personalized nutrition advice, 
              powered by advanced artificial intelligence
            </p>
            <div className="flex gap-3 flex-wrap justify-center pt-4">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full text-sm text-blue-200">
                <Check className="h-4 w-4 text-green-400" /> 
                <span>Advanced AI Detection</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full text-sm text-blue-200">
                <Check className="h-4 w-4 text-green-400" /> 
                <span>Personalized Nutrition Advice</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full text-sm text-blue-200">
                <Check className="h-4 w-4 text-green-400" /> 
                <span>Instant Results</span>
              </div>
            </div>
            <div className="pt-8">
              <SignedIn>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 shadow-lg shadow-blue-700/20"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2" />
                </Button>
              </SignedIn>
              <SignedOut>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-lg px-8 shadow-lg shadow-blue-700/20"
                  onClick={() => navigate("/login")}
                >
                  Get Started
                  <ArrowRight className="ml-2" />
                </Button>
              </SignedOut>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-yellow-400" />
            <span>Key Features</span>
          </h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">
            Cutting-edge technology to identify and address vitamin deficiencies
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-lg space-y-4 hover:bg-white/5 transition-colors border border-blue-500/10 bg-black/20 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
              <Shield className="w-7 h-7 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold text-white text-center">Smart Detection</h3>
            <p className="text-blue-200 text-center">
              Advanced AI technology to identify potential vitamin deficiencies based on your symptoms
            </p>
          </div>
          <div className="glass-panel p-8 rounded-lg space-y-4 hover:bg-white/5 transition-colors border border-blue-500/10 bg-black/20 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
              <Zap className="w-7 h-7 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold text-white text-center">Instant Results</h3>
            <p className="text-blue-200 text-center">
              Get immediate analysis and personalized nutrition recommendations within seconds
            </p>
          </div>
          <div className="glass-panel p-8 rounded-lg space-y-4 hover:bg-white/5 transition-colors border border-blue-500/10 bg-black/20 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
              <HeartPulse className="w-7 h-7 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold text-white text-center">Expert Advice</h3>
            <p className="text-blue-200 text-center">
              Access AI-powered nutrition guidance and supplement recommendations for optimal health
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">Three simple steps to identify and address vitamin deficiencies</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 bg-black/20 border-blue-500/20 hover:border-blue-500/40 transition-all backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-blue-300">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Complete Assessment</h3>
              <p className="text-blue-200">Answer questions about your symptoms, energy levels, and diet to help our AI analyze your health</p>
            </div>
          </Card>
          <Card className="p-6 bg-black/20 border-blue-500/20 hover:border-blue-500/40 transition-all backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-blue-300">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Analysis</h3>
              <p className="text-blue-200">Our advanced AI analyzes your symptoms to identify potential vitamin and mineral deficiencies</p>
            </div>
          </Card>
          <Card className="p-6 bg-black/20 border-blue-500/20 hover:border-blue-500/40 transition-all backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-blue-300">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Get Solutions</h3>
              <p className="text-blue-200">Receive detailed nutrition recommendations and chat with our AI assistant for personalized advice</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Testimonials */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-2">
            <Award className="h-6 w-6 text-yellow-400" />
            <span>What Our Users Say</span>
          </h2>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto">Real experiences from health-conscious individuals just like you</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="glassmorphism p-8 rounded-lg bg-black/30 backdrop-blur-md border border-blue-500/10 min-h-[200px]">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`transition-opacity duration-500 ${index === currentTestimonialIndex ? 'opacity-100' : 'opacity-0 hidden'}`}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-lg text-white/90 italic">"{testimonial.content}"</p>
                  <div className="mt-4">
                    <div className="flex items-center justify-center mb-1">
                      <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center text-white font-medium">
                        {testimonial.avatar}
                      </div>
                    </div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-blue-300">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonialIndex(index)}
                className={`h-2 w-2 rounded-full transition-all ${
                  index === currentTestimonialIndex ? 'bg-blue-400 w-6' : 'bg-blue-800/50'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="glass-panel p-8 rounded-lg bg-gradient-to-br from-black/40 to-blue-900/10 backdrop-blur-md border border-blue-500/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-3xl font-bold text-blue-300 mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span>95%</span>
              </div>
              <p className="text-blue-200">Detection Accuracy</p>
            </div>
            <div className="p-4 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-3xl font-bold text-blue-300 mb-2 flex items-center justify-center gap-2">
                <Database className="h-5 w-5 text-yellow-400" />
                <span>30+</span>
              </div>
              <p className="text-blue-200">Vitamin Deficiencies</p>
            </div>
            <div className="p-4 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-3xl font-bold text-blue-300 mb-2 flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-yellow-400" />
                <span>24/7</span>
              </div>
              <p className="text-blue-200">Nutrition Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="glass-panel p-12 rounded-lg text-center max-w-3xl mx-auto bg-gradient-to-br from-blue-900/20 to-indigo-800/20 backdrop-blur-md border border-blue-500/10">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to optimize your nutrition?</h2>
          <p className="text-xl text-blue-200 mb-8">
            Join thousands of health-conscious individuals who trust Vitamin AI for deficiency detection
          </p>
          <SignedIn>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 shadow-lg shadow-blue-700/20"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
              <ArrowRight className="ml-2" />
            </Button>
          </SignedIn>
          <SignedOut>
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-lg px-8 shadow-lg shadow-blue-700/20"
              onClick={() => navigate("/login")}
            >
              Get Started Today
              <ArrowRight className="ml-2" />
            </Button>
          </SignedOut>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black/30 border-t border-white/10 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-blue-200 text-sm">© 2025 Vitamin AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
