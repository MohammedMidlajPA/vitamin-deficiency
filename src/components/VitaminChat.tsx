
import { useState, useEffect, useCallback, useRef } from "react";
import { Send, Pill, Sparkles, RefreshCcw, Bot, User, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isLoading?: boolean;
  error?: boolean;
  helpful?: boolean;
}

interface VitaminChatProps {
  deficiencyInfo?: {
    name: string;
    description: string;
  } | null;
}

export const VitaminChat = ({ deficiencyInfo }: VitaminChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentlyTyping, setCurrentlyTyping] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { toast } = useToast();
  const GEMINI_API_KEY = "AIzaSyDWbkSlDbTObn50YlpYcNooLuRP0SVkRCE"; // Your API key
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100);
      }
    }
  }, [messages, typingText]);

  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentlyTyping && typingText) {
      if (typingIndex < typingText.length) {
        typingTimerRef.current = setTimeout(() => {
          setTypingIndex(prev => prev + 1);
        }, 15);
      } else {
        setCurrentlyTyping(false);
        setMessages(prev => 
          prev.map(msg => 
            msg.isLoading ? {
              ...msg,
              content: typingText,
              isLoading: false,
            } : msg
          )
        );
      }
    }
  }, [currentlyTyping, typingIndex, typingText]);

  useEffect(() => {
    if (deficiencyInfo) {
      const welcomeMessage: Message = {
        id: 1,
        content: `I've detected a potential ${deficiencyInfo.name}. How can I help you with information, symptoms, or supplementation options?`,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setTimeout(() => {
        setMessages([welcomeMessage]);
      }, 300);
    } else {
      setMessages([
        {
          id: 1,
          content: "Hello! I'm your nutrition assistant. Please complete the symptom assessment first to detect potential vitamin deficiencies.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
    setApiError(null);
    retryCountRef.current = 0;
  }, [deficiencyInfo]);

  const suggestions = [
    "What are the best foods to address this deficiency?",
    "What symptoms are common with this deficiency?",
    "What supplements do you recommend?",
    "Can this deficiency affect my long-term health?"
  ];

  const generateGeminiResponse = useCallback(async (userMessage: string, retryAttempt = 0) => {
    try {
      console.log(`Generating response with Gemini API for: "${userMessage}" (Attempt: ${retryAttempt + 1})`);
      setApiError(null);
      
      const nutritionContext = deficiencyInfo 
        ? `You are a nutrition expert specialized in ${deficiencyInfo.name}. 
           Deficiency details: ${deficiencyInfo.description || 'No detailed description available.'} 
           Your role is to provide accurate information about this vitamin/mineral deficiency, including symptoms, causes, prevention, and treatment options.
           If asked about this deficiency, provide detailed, specific information that would be helpful to someone seeking to improve their health.
           Format your responses with markdown for better readability.
           Use bullet points for lists of food sources, supplements, or prevention steps.
           Begin your response by directly addressing the user's question.`
        : "You are a nutrition expert who can help identify and treat vitamin deficiencies.";

      const prompt = `
      ${nutritionContext}
      
      IMPORTANT RULES:
      1. ONLY answer questions related to nutrition, vitamins, minerals, and health conditions related to nutritional deficiencies. 
      2. If the question is not about nutrition, politely refuse to answer and redirect to nutrition-related topics.
      3. Keep responses focused on the detected deficiency: ${deficiencyInfo?.name || 'unknown'}.
      4. Be helpful, accurate, and provide detailed dietary and supplement recommendations when possible.
      5. If you don't know something specific about this deficiency, be honest about it.
      6. Format your response with markdown for better readability if appropriate.
      7. Keep responses under 500 tokens.
      8. Always be constructive, even when addressing serious deficiencies.
      9. Organize information clearly with bullet points when listing options.
      10. Be concise but comprehensive.
      
      User question: ${userMessage}
      `;

      console.log("Sending request to Gemini API...");

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
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
        
        if ((response.status === 429 || response.status >= 500) && retryAttempt < 3) {
          const backoffTime = Math.pow(2, retryAttempt) * 1000;
          console.log(`Retrying in ${backoffTime}ms...`);
          
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }
          
          retryTimeoutRef.current = setTimeout(() => {
            generateGeminiResponse(userMessage, retryAttempt + 1);
          }, backoffTime);
          
          return "I'm having trouble accessing nutrition information. Retrying automatically...";
        }
        
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Received response from Gemini API");
      
      if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]) {
        retryCountRef.current = 0;
        
        const responseText = data.candidates[0].content.parts[0].text;
        if (responseText.toLowerCase().includes("i can only answer questions about nutrition") || 
            responseText.toLowerCase().includes("i cannot provide information")) {
          return "I apologize, but I can only answer questions related to nutrition, vitamins, minerals, and related health topics. Please ask about nutritional deficiencies, supplements, or dietary recommendations.";
        }
        return responseText;
      } else {
        console.error("Unexpected response format from Gemini API:", data);
        setApiError("Unexpected API response format");
        throw new Error("Unexpected response format from Gemini API");
      }
    } catch (error: any) {
      console.error('Error with Gemini API:', error);
      retryCountRef.current += 1;
      
      if (error.name === 'AbortError') {
        setApiError("Request timed out");
        return "The request to our nutrition database took too long. Please try again with a more specific question.";
      }
      
      setApiError(error.message || "Unknown error");
      
      if (retryCountRef.current <= 3) {
        return `I'm having trouble accessing nutrition information right now. ${retryAttempt > 0 ? "Still trying..." : "Please try again in a moment."}`;
      } else {
        return "I'm experiencing persistent issues connecting to the nutrition database. Please try a different question or check back later.";
      }
    }
  }, [deficiencyInfo, GEMINI_API_KEY]);

  const retryLastMessage = async () => {
    if (messages.length < 2) return;
    
    const lastUserMessageIndex = [...messages].reverse().findIndex(m => m.sender === "user");
    if (lastUserMessageIndex === -1) return;
    
    const lastUserMessage = [...messages].reverse()[lastUserMessageIndex];
    
    setMessages(prev => prev.filter(m => !m.error));
    
    await handleUserMessage(lastUserMessage.content);
  };

  const handleUserMessage = async (userContent: string) => {
    setApiError(null);
    setIsProcessing(true);
    setShowSuggestions(false);

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
      
      if (!deficiencyInfo) {
        response = "Please complete the symptom assessment first so I can identify potential deficiencies and provide targeted advice.";
      } else {
        console.log("Generating response for input:", userContent);
        response = await generateGeminiResponse(userContent);
        console.log("Generated response:", response.substring(0, 100) + "...");
      }

      setTypingText(response);
      setTypingIndex(0);
      setCurrentlyTyping(true);
      
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

  const markMessageHelpful = (messageId: number, helpful: boolean) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, helpful } : msg
      )
    );
    
    toast({
      title: helpful ? "Feedback Received" : "Feedback Received",
      description: helpful ? "Thanks for the positive feedback!" : "We'll improve our responses based on your feedback.",
    });
  };

  const useSuggestion = (suggestion: string) => {
    setInput(suggestion);
    handleUserMessage(suggestion);
  };

  const getBotIcon = (msg: Message) => {
    if (msg.isLoading) return <div className="animate-pulse"><Bot className="h-4 w-4 text-blue-200" /></div>;
    if (msg.error) return <AlertCircle className="h-4 w-4 text-red-300" />;
    return <Bot className="h-4 w-4 text-blue-200" />;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="w-full max-w-md mx-auto h-[500px] border border-blue-500/20 bg-card/50 backdrop-blur-sm shadow-lg transition-all hover:shadow-blue-500/10">
          <CardHeader className="border-b p-4 bg-black/40">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/30 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0] 
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Sparkles className="h-4 w-4 text-blue-300" />
                </motion.div>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Nutrition Assistant</h2>
                <p className="text-sm text-muted-foreground">
                  {deficiencyInfo ? (
                    <span className="flex items-center gap-1">
                      Advice for <Badge className="bg-blue-600">{deficiencyInfo.name}</Badge>
                    </span>
                  ) : "Complete assessment first"}
                </p>
              </div>
            </div>
          </CardHeader>
          
          <ScrollArea className="flex-1 p-4 h-[350px]" ref={scrollAreaRef}>
            {apiError && (
              <Alert className="mb-4 bg-red-500/10 border-red-500/30 text-red-200 animate-fade-in">
                <AlertDescription className="flex items-center justify-between">
                  <span>API error: {apiError}</span>
                  <Button variant="link" className="p-0 h-auto text-red-200 underline ml-2" onClick={retryLastMessage}>
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "flex",
                      message.sender === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[80%] break-words relative group",
                        message.sender === "user"
                          ? "bg-blue-600 text-white"
                          : message.isLoading
                          ? "bg-blue-500/20 text-blue-100"
                          : message.error
                          ? "bg-red-900/30 text-red-100 backdrop-blur-sm border border-red-500/30"
                          : "bg-black/40 text-white backdrop-blur-sm border border-blue-500/10"
                      )}
                    >
                      <div className="flex gap-2 items-start">
                        {message.sender === "bot" && (
                          <div className="flex-shrink-0 mt-1">
                            {getBotIcon(message)}
                          </div>
                        )}
                        <div>
                          {message.sender === "user" ? (
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                          ) : message.isLoading && currentlyTyping ? (
                            <p className="text-sm whitespace-pre-line">{typingText.substring(0, typingIndex)}<span className="animate-pulse">▌</span></p>
                          ) : (
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                          )}
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
                        {message.sender === "user" && (
                          <div className="flex-shrink-0 mt-1">
                            <User className="h-4 w-4 text-white/70" />
                          </div>
                        )}
                      </div>
                      
                      {message.sender === "bot" && !message.isLoading && !message.error && (
                        <div className="absolute -right-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex flex-col gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 rounded-full bg-green-500/20 hover:bg-green-500/30"
                              onClick={() => markMessageHelpful(message.id, true)}
                            >
                              <ThumbsUp className="h-3 w-3 text-green-300" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 w-6 p-0 rounded-full bg-red-500/20 hover:bg-red-500/30"
                              onClick={() => markMessageHelpful(message.id, false)}
                            >
                              <ThumbsDown className="h-3 w-3 text-red-300" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {showSuggestions && deficiencyInfo && messages.length < 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="mt-4"
              >
                <p className="text-xs text-blue-300 mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2, delay: 0.5 + (index * 0.1) }}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => useSuggestion(suggestion)}
                        className="text-xs bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20 text-blue-100"
                      >
                        {suggestion}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
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
                placeholder={deficiencyInfo ? "Ask about supplements or foods..." : "Complete the assessment first..."}
                className="flex-1 bg-background/30 backdrop-blur-sm border-blue-500/20 focus:border-blue-400"
                disabled={!deficiencyInfo || isProcessing}
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!deficiencyInfo || isProcessing}
                className={cn(
                  "bg-blue-600 hover:bg-blue-700 transition-colors",
                  isProcessing && "animate-pulse"
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
