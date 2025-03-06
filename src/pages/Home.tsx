
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Shield, Zap, Users, Code, Sparkles } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Card } from "@/components/ui/card";

const PlantImages = [
  "/images/plant-bg-1.jpg",
  "/images/plant-bg-2.jpg",
];

const Home = () => {
  const navigate = useNavigate();

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

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-violet-500/20 flex items-center justify-center mb-6">
                <Leaf className="h-8 w-8 text-violet-300" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-purple-100">
              PlantGuard AI
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 max-w-2xl mx-auto">
              Your intelligent companion for plant disease detection and treatment
            </p>
            <div className="pt-8">
              <SignedIn>
                <Button
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 text-lg px-8"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2" />
                </Button>
              </SignedIn>
              <SignedOut>
                <Button
                  size="lg"
                  className="bg-violet-600 hover:bg-violet-700 text-lg px-8"
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
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Key Features</h2>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">Cutting-edge technology to keep your plants healthy</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel p-6 rounded-lg space-y-4 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
              <Leaf className="w-6 h-6 text-violet-300" />
            </div>
            <h3 className="text-lg font-semibold text-white text-center">Smart Detection</h3>
            <p className="text-purple-200 text-center">
              Advanced AI technology to identify plant diseases with high accuracy
            </p>
          </div>
          <div className="glass-panel p-6 rounded-lg space-y-4 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-violet-300" />
            </div>
            <h3 className="text-lg font-semibold text-white text-center">Instant Results</h3>
            <p className="text-purple-200 text-center">
              Get immediate analysis and personalized treatment recommendations
            </p>
          </div>
          <div className="glass-panel p-6 rounded-lg space-y-4 hover:bg-white/5 transition-colors">
            <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-violet-300" />
            </div>
            <h3 className="text-lg font-semibold text-white text-center">Expert Advice</h3>
            <p className="text-purple-200 text-center">
              Access AI-powered treatment guidelines and preventive measures
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
          <Card className="p-6 bg-black/20 border-violet-500/20 hover:border-violet-500/40 transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-violet-300">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Upload Photo</h3>
              <p className="text-purple-200">Take a clear photo of your plant's affected area and upload it to our platform</p>
            </div>
          </Card>
          <Card className="p-6 bg-black/20 border-violet-500/20 hover:border-violet-500/40 transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-violet-300">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Analysis</h3>
              <p className="text-purple-200">Our advanced AI analyzes the image to identify potential diseases and issues</p>
            </div>
          </Card>
          <Card className="p-6 bg-black/20 border-violet-500/20 hover:border-violet-500/40 transition-all">
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

      {/* Stats Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="glass-panel p-8 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-3xl font-bold text-violet-300 mb-2">95%</div>
              <p className="text-purple-200">Detection Accuracy</p>
            </div>
            <div className="p-4 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-3xl font-bold text-violet-300 mb-2">1000+</div>
              <p className="text-purple-200">Plant Species</p>
            </div>
            <div className="p-4 hover:bg-white/5 rounded-lg transition-colors">
              <div className="text-3xl font-bold text-violet-300 mb-2">24/7</div>
              <p className="text-purple-200">AI Support</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="glass-panel p-12 rounded-lg text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to protect your plants?</h2>
          <p className="text-xl text-purple-200 mb-8">
            Join thousands of gardeners who trust PlantGuard AI for early disease detection
          </p>
          <SignedIn>
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-lg px-8"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
              <ArrowRight className="ml-2" />
            </Button>
          </SignedIn>
          <SignedOut>
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-lg px-8"
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
