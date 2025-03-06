
import { useState, useEffect } from "react";
import { Send, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isLoading?: boolean;
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
  const { toast } = useToast();
  const GEMINI_API_KEY = "AIzaSyBUAjQKVgmRNp0qys1aJ4oEOsL-KlUyobw";

  useEffect(() => {
    // Reset chat and set initial message when disease info changes
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
  }, [diseaseInfo]);

  const generateGeminiResponse = async (userMessage: string) => {
    try {
      const plantContext = diseaseInfo 
        ? `You are a plant disease expert specialized in ${diseaseInfo.name}. ${diseaseInfo.description || ''}` 
        : "You are a plant disease expert.";

      const prompt = `
      ${plantContext}
      
      IMPORTANT RULES:
      1. ONLY answer questions related to plants, gardening, and plant diseases. 
      2. If the question is not about plants, politely refuse to answer.
      3. Keep responses focused on the detected plant disease: ${diseaseInfo?.name || 'unknown'}.
      4. Be helpful, accurate and concise in your responses.
      5. If you don't know something specific about this plant disease, be honest about it.
      
      User question: ${userMessage}
      `;

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
            maxOutputTokens: 500,
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
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("Unexpected response format from Gemini API");
      }
    } catch (error) {
      console.error('Error with Gemini API:', error);
      return "I'm having trouble connecting to my knowledge base right now. Please try again later.";
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;
    setIsProcessing(true);

    const userMessage: Message = {
      id: messages.length + 1,
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    // Add a loading message that will be replaced
    const loadingMessage: Message = {
      id: messages.length + 2,
      content: "Thinking...",
      sender: "bot",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");

    try {
      let response = "";
      
      if (!diseaseInfo) {
        response = "Please upload a plant image first so I can identify any diseases and provide targeted advice.";
      } else {
        // Use Gemini API for response generation
        response = await generateGeminiResponse(input.trim());
      }

      // Replace the loading message with the actual response
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
      
      // Replace loading message with error
      setMessages((prev) => 
        prev.map(msg => 
          msg.isLoading ? {
            ...msg,
            content: "I'm sorry, I encountered an error while processing your question. Please try again.",
            isLoading: false,
          } : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
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
                    : "bg-black/40 text-white backdrop-blur-sm border border-violet-500/10"
                )}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
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
