
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="w-full max-w-md p-8 glass-panel rounded-lg backdrop-blur-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Vitamin AI</h1>
          <p className="text-purple-200">Your AI-powered vitamin deficiency detection assistant</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-violet-600 hover:bg-violet-700 text-sm normal-case",
              card: "bg-transparent shadow-none",
              headerTitle: "text-white",
              headerSubtitle: "text-purple-200",
              socialButtonsBlockButton: 
                "bg-white/10 border border-white/20 hover:bg-white/20 text-white",
              formFieldLabel: "text-purple-200",
              formFieldInput: 
                "bg-white/10 border border-white/20 text-white placeholder:text-purple-300",
              footerActionLink: "text-violet-400 hover:text-violet-300",
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;
