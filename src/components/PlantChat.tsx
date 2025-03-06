
import { useState, useEffect } from "react";
import { Send, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
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

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Generate context-aware responses based on the detected disease
    setTimeout(() => {
      let botResponse = "";
      
      if (diseaseInfo) {
        if (input.toLowerCase().includes("treatment") || input.toLowerCase().includes("cure")) {
          botResponse = `For ${diseaseInfo.name}, I recommend: 1) Remove affected leaves, 2) Apply appropriate fungicide, 3) Ensure proper air circulation around plants. Would you like more specific treatment options?`;
        } else if (input.toLowerCase().includes("prevent") || input.toLowerCase().includes("avoid")) {
          botResponse = `To prevent ${diseaseInfo.name} in the future: 1) Maintain proper plant spacing, 2) Water at the base of plants, 3) Use disease-resistant varieties when available, 4) Practice crop rotation.`;
        } else if (input.toLowerCase().includes("cause") || input.toLowerCase().includes("why")) {
          botResponse = `${diseaseInfo.name} is typically caused by fungal pathogens that thrive in humid conditions. The spores can spread through water splashing, wind, or infected tools.`;
        } else {
          botResponse = `I understand you want to know more about ${diseaseInfo.name}. ${diseaseInfo.description} What specific aspect would you like to know about - treatment, prevention, or causes?`;
        }
      } else {
        botResponse = "Please upload a plant image first so I can identify any diseases and provide targeted advice.";
      }

      const botReplyMessage: Message = {
        id: messages.length + 2,
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botReplyMessage]);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md mx-auto h-[500px] border bg-card/50 backdrop-blur-sm">
      <CardHeader className="border-b p-4 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <Leaf className="h-4 w-4 text-green-400" />
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
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/70 backdrop-blur-sm"
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

      <CardFooter className="border-t p-4 bg-muted/30">
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
            className="flex-1 bg-background/30 backdrop-blur-sm"
            disabled={!diseaseInfo}
          />
          <Button type="submit" size="icon" disabled={!diseaseInfo}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
