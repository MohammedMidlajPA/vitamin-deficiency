
import { useState, useEffect, useCallback } from "react";
import { Send, Leaf, Sparkles, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isLoading?: boolean;
  error?: boolean;
}

interface PlantChatProps {
  diseaseInfo?: {
    name: string;
    description: string;
  } | null;
}

export const PlantChat = ({ diseaseInfo }: PlantChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { toast } = useToast();
  const GEMINI_API_KEY = "AIzaSyBUAjQKVgmRNp0qys1aJ4oEOsL-KlUyobw";

  useEffect(() => {
    if (diseaseInfo) {
      setMessages([
        {
          id: 1,
          content: `I've detected ${diseaseInfo.name}. How can I help you with treatment options or more information?`,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([
        {
          id: 1,
          content: "Hello! I'm your plant disease assistant. Please upload an image to detect plant diseases first.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
    setApiError(null);
  }, [diseaseInfo]);

  const generateGeminiResponse = useCallback(async (userMessage: string) => {
    try {
      console.log("Generating response with Gemini API for:", userMessage);
      setApiError(null);
      
      // Create a more detailed context about the plant disease
      const plantContext = diseaseInfo 
        ? `You are a plant disease expert specialized in ${diseaseInfo.name}. 
           Disease details: ${diseaseInfo.description || 'No detailed description available.'} 
           Your role is to provide accurate information about this plant disease, including symptoms, causes, prevention, and treatment options.`
        : "You are a plant disease expert who can help identify and treat plant diseases.";

      const prompt = `
      ${plantContext}
      
      IMPORTANT RULES:
      1. ONLY answer questions related to plants, gardening, and plant diseases. 
      2. If the question is not about plants, politely refuse to answer and redirect to plant-related topics.
      3. Keep responses focused on the detected plant disease: ${diseaseInfo?.name || 'unknown'}.
      4. Be helpful, accurate, and provide detailed treatment options when possible.
      5. If you don't know something specific about this plant disease, be honest about it.
      6. Format your response with markdown for better readability if appropriate.
      7. Keep responses under 500 tokens.
      
      User question: ${userMessage}
      `;

      console.log("Sending request to Gemini API with prompt:", prompt.slice(0, 100) + "...");

      // Set a timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_MEDIUM_AND_ABOVE"
            }
          ]
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API error with status ${response.status}:`, errorText);
        setApiError(`API error ${response.status}: ${errorText.slice(0, 100)}`);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response from Gemini API:", data);
      
      if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]) {
        const responseText = data.candidates[0].content.parts[0].text;
        // Check if the response indicates the API refused to answer (off-topic)
        if (responseText.toLowerCase().includes("i can only answer questions about plants") || 
            responseText.toLowerCase().includes("i cannot provide information")) {
          return "I apologize, but I can only answer questions related to plants and gardening. Please ask about plant diseases, treatments, or gardening tips.";
        }
        return responseText;
      } else {
        console.error("Unexpected response format from Gemini API:", data);
        setApiError("Unexpected API response format");
        throw new Error("Unexpected response format from Gemini API");
      }
    } catch (error: any) {
      console.error('Error with Gemini API:', error);
      if (error.name === 'AbortError') {
        setApiError("Request timed out");
        return "The request to our plant disease database took too long. Please try again with a more specific question.";
      }
      setApiError(error.message || "Unknown error");
      return "I'm having trouble accessing plant disease information right now. Please try asking a different question or try again in a moment.";
    }
  }, [diseaseInfo, GEMINI_API_KEY]);

  const retryLastMessage = async () => {
    if (messages.length < 2) return;
    
    // Find the last user message
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.sender === "user");
    if (lastUserMessageIndex === -1) return;
    
    const lastUserMessage = [...messages].reverse()[lastUserMessageIndex];
    
    // Remove the error bot message
    setMessages(prev => prev.filter(m => !m.error));
    
    // Process the last user message again
    await handleUserMessage(lastUserMessage.content);
  };

  const handleUserMessage = async (userContent: string) => {
    setApiError(null);
    setIsProcessing(true);

    const userMessage: Message = {
      id: messages.length + 1,
      content: userContent,
      sender: "user",
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: messages.length + 2,
      content: "Thinking...",
      sender: "bot",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);

    try {
      let response = "";
      
      if (!diseaseInfo) {
        response = "Please upload a plant image first so I can identify any diseases and provide targeted advice.";
      } else {
        console.log("Generating response for input:", userContent);
        response = await generateGeminiResponse(userContent);
        console.log("Generated response:", response);
      }

      setMessages((prev) => 
        prev.map(msg => 
          msg.isLoading ? {
            ...msg,
            content: response,
            isLoading: false,
          } : msg
        )
      );
    } catch (error) {
      console.error("Error generating response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate a response. Please try again.",
      });
      
      setMessages((prev) => 
        prev.map(msg => 
          msg.isLoading ? {
            ...msg,
            content: "I encountered an error processing your question. Please try again or ask something different.",
            isLoading: false,
            error: true,
          } : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = () => {
    if (!input.trim() || isProcessing) return;
    const userContent = input.trim();
    setInput("");
    handleUserMessage(userContent);
  };

  return (
    <Card className="w-full max-w-md mx-auto h-[500px] border border-violet-500/20 bg-card/50 backdrop-blur-sm shadow-lg">
      <CardHeader className="border-b p-4 bg-black/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-violet-500/30 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-violet-300" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Plant Disease Assistant</h2>
            <p className="text-sm text-muted-foreground">
              {diseaseInfo ? `Advice for ${diseaseInfo.name}` : "Upload an image first"}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4 h-[350px]">
        {apiError && (
          <Alert className="mb-4 bg-red-500/10 border-red-500/30 text-red-200">
            <AlertDescription>
              API error: {apiError} 
              <Button variant="link" className="p-0 h-auto text-red-200 underline ml-2" onClick={retryLastMessage}>
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%] break-words",
                  message.sender === "user"
                    ? "bg-violet-600 text-white"
                    : message.isLoading
                    ? "bg-violet-500/20 text-violet-100 animate-pulse"
                    : message.error
                    ? "bg-red-900/30 text-red-100 backdrop-blur-sm border border-red-500/30"
                    : "bg-black/40 text-white backdrop-blur-sm border border-violet-500/10"
                )}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  {message.error && (
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={retryLastMessage}>
                      <RefreshCcw className="h-3 w-3 text-red-200" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <CardFooter className="border-t p-4 bg-black/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 w-full"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={diseaseInfo ? "Ask about treatments or prevention..." : "Upload a plant image first..."}
            className="flex-1 bg-background/30 backdrop-blur-sm border-violet-500/20 focus:border-violet-400"
            disabled={!diseaseInfo || isProcessing}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!diseaseInfo || isProcessing}
            className="bg-violet-600 hover:bg-violet-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
