
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Shield, Zap, Users, Sparkles, Star, Check, Award, Plant, Database, HeartPulse } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";

const PlantImages = [
  "/images/plant-bg-1.jpg",
  "/images/plant-bg-2.jpg",
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Home Gardener",
    content: "PlantGuard AI saved my tomato plants! It quickly identified early blight and the treatment advice worked perfectly.",
    avatar: "SJ"
  },
  {
    name: "Michael Chen",
    role: "Botanist",
    content: "As a professional, I'm impressed with the accuracy. It's like having a lab assistant in my pocket.",
    avatar: "MC"
  },
  {
    name: "Emily Rodriguez",
    role: "Urban Farmer",
    content: "The instant results and treatment options have been invaluable for maintaining our community garden.",
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
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-purple-900/95 to-violet-900/95" />
        {PlantImages.map((img, index) => (
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
              <div className="h-8 w-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                <Leaf className="h-4 w-4 text-violet-300" />
              </div>
              <div className="text-xl font-semibold text-white">PlantGuard AI</div>
            </div>
            <div className="flex items-center gap-4">
              <SignedIn>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-violet-200 hover:bg-white/10"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-violet-200 hover:bg-white/10"
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
                <div className="absolute -inset-4 rounded-full bg-violet-500/10 blur-md animate-pulse"></div>
                <div className="h-16 w-16 rounded-full bg-violet-500/30 flex items-center justify-center mb-6 relative">
                  <Leaf className="h-8 w-8 text-violet-300" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200">
              PlantGuard AI
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Your intelligent companion for plant disease detection and treatment, 
              powered by advanced artificial intelligence
            </p>
            <div className="flex gap-3 flex-wrap justify-center pt-4">
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full text-sm text-violet-200">
                <Check className="h-4 w-4 text-green-400" /> 
                <span>Advanced AI Detection</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full text-sm text-violet-200">
                <Check className="h-4 w-4 text-green-400" /> 
                <span>Expert Treatment Advice</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full text-sm text-violet-200">
                <Check className="h-4 w-4 text-green-400" /> 
                <span>Instant Results</span>
              </div>
            </div>
            <div className="pt-8">
              <SignedIn>
                <Button
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 text-lg px-8 shadow-lg shadow-violet-700/20"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2" />
                </Button>
              </SignedIn>
              <SignedOut>
                <Button
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 text-lg px-8 shadow-lg shadow-violet-700/20"
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
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            Cutting-edge technology to keep your plants healthy and thriving
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-8 rounded-lg space-y-4 hover:bg-white/5 transition-colors border border-violet-500/10 bg-black/20 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
              <Plant className="w-7 h-7 text-violet-300" />
            </div>
            <h3 className="text-xl font-semibold text-white text-center">Smart Detection</h3>
            <p className="text-purple-200 text-center">
              Advanced AI technology to identify plant diseases with high accuracy from a simple photo
            </p>
          </div>
          <div className="glass-panel p-8 rounded-lg space-y-4 hover:bg-white/5 transition-colors border border-violet-500/10 bg-black/20 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
              <Zap className="w-7 h-7 text-violet-300" />
            </div>
            <h3 className="text-xl font-semibold text-white text-center">Instant Results</h3>
            <p className="text-purple-200 text-center">
              Get immediate analysis and personalized treatment recommendations within seconds
            </p>
          </div>
          <div className="glass-panel p-8 rounded-lg space-y-4 hover:bg-white/5 transition-colors border border-violet-500/10 bg-black/20 backdrop-blur-sm">
            <div className="w-14 h-14 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
              <HeartPulse className="w-7 h-7 text-violet-300" />
            </div>
            <h3 className="text-xl font-semibold text-white text-center">Expert Advice</h3>
            <p className="text-purple-200 text-center">
              Access AI-powered treatment guidelines and preventive measures for healthy plants
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">Three simple steps to identify and treat plant diseases</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 bg-black/20 border-violet-500/20 hover:border-violet-500/40 transition-all backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-violet-300">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Upload Photo</h3>
              <p className="text-purple-200">Take a clear photo of your plant's affected area and upload it to our platform</p>
            </div>
          </Card>
          <Card className="p-6 bg-black/20 border-violet-500/20 hover:border-violet-500/40 transition-all backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-violet-300">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Analysis</h3>
              <p className="text-purple-200">Our advanced AI analyzes the image to identify potential diseases and issues</p>
            </div>
          </Card>
          <Card className="p-6 bg-black/20 border-violet-500/20 hover:border-violet-500/40 transition-all backdrop-blur-sm">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-violet-300">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Get Solutions</h3>
              <p className="text-purple-200">Receive detailed treatment recommendations and chat with our AI assistant</p>
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
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">Real experiences from plant enthusiasts just like you</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <div className="glassmorphism p-8 rounded-lg bg-black/30 backdrop-blur-md border border-violet-500/10 min-h-[200px]">
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
                      <div className="w-10 h-10 rounded-full bg-violet-500/30 flex items-center justify-center text-white font-medium">
                        {testimonial.avatar}
                      </div>
                    </div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-violet-300">{testimonial.role}</p>
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
                  index === currentTestimonialIndex ? 'bg-violet-400 w-6' : 'bg-violet-800/50'
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="glass-panel p-8 rounded-lg bg-gradient-to-br from-black/40 to-violet-900/10 backdrop-blur-md border border-violet-500/10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-3xl font-bold text-violet-300 mb-2 flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                <span>95%</span>
              </div>
              <p className="text-purple-200">Detection Accuracy</p>
            </div>
            <div className="p-4 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-3xl font-bold text-violet-300 mb-2 flex items-center justify-center gap-2">
                <Database className="h-5 w-5 text-yellow-400" />
                <span>1000+</span>
              </div>
              <p className="text-purple-200">Plant Species</p>
            </div>
            <div className="p-4 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-3xl font-bold text-violet-300 mb-2 flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-yellow-400" />
                <span>24/7</span>
              </div>
              <p className="text-purple-200">AI Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="glass-panel p-12 rounded-lg text-center max-w-3xl mx-auto bg-gradient-to-br from-purple-900/20 to-violet-800/20 backdrop-blur-md border border-violet-500/10">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to protect your plants?</h2>
          <p className="text-xl text-purple-200 mb-8">
            Join thousands of gardeners who trust PlantGuard AI for early disease detection
          </p>
          <SignedIn>
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-lg px-8 shadow-lg shadow-violet-700/20"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
              <ArrowRight className="ml-2" />
            </Button>
          </SignedIn>
          <SignedOut>
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-lg px-8 shadow-lg shadow-violet-700/20"
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
            <p className="text-purple-200 text-sm">© 2023 PlantGuard AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
