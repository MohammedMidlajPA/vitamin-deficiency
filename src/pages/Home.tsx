
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Shield, Zap } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-lg border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold text-white">PlantGuard AI</div>
            <div className="flex items-center gap-4">
              <SignedIn>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-violet-200"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </Button>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
              <SignedOut>
                <Button 
                  variant="ghost" 
                  className="text-white hover:text-violet-200"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </SignedOut>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-purple-100">
              PlantGuard AI
            </h1>
            <p className="text-xl text-purple-100">
              Your intelligent companion for plant disease detection and treatment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
            <div className="glass-panel p-6 rounded-lg space-y-4">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
                <Leaf className="w-6 h-6 text-violet-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Smart Detection</h3>
              <p className="text-purple-200">
                Advanced AI technology to identify plant diseases with high accuracy
              </p>
            </div>
            <div className="glass-panel p-6 rounded-lg space-y-4">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
                <Zap className="w-6 h-6 text-violet-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Instant Results</h3>
              <p className="text-purple-200">
                Get immediate analysis and treatment recommendations
              </p>
            </div>
            <div className="glass-panel p-6 rounded-lg space-y-4">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6 text-violet-300" />
              </div>
              <h3 className="text-lg font-semibold text-white">Expert Advice</h3>
              <p className="text-purple-200">
                Access professional treatment guidelines and preventive measures
              </p>
            </div>
          </div>

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
  );
};

export default Home;
