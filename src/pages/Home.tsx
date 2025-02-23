
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Shield, Zap } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-16">
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
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-lg px-8"
              onClick={() => navigate("/login")}
            >
              Get Started
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
