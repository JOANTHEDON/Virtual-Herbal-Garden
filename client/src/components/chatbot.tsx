import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, X, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  type?: "suggestion" | "plant-info" | "general";
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your virtual herbalist assistant. I can help you learn about medicinal plants, their uses, preparation methods, and AYUSH principles. What would you like to know?",
      sender: "bot",
      timestamp: new Date(),
      type: "general"
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickSuggestions = [
    "What is Turmeric used for?",
    "How to prepare Ginger tea?",
    "Best herbs for immunity",
    "Ayurvedic principles",
    "Plants for stress relief"
  ];

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: currentMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageText = currentMessage;
    setCurrentMessage("");
    setIsTyping(true);

    try {
      // Call backend API to get chatbot response
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: messages.length + 2,
          text: data.response,
          sender: "bot",
          timestamp: new Date(),
          type: "general"
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback to local response
        const botResponse = generateBotResponse(messageText);
        const botMessage: Message = {
          id: messages.length + 2,
          text: botResponse.text,
          sender: "bot",
          timestamp: new Date(),
          type: botResponse.type
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      // Fallback to local response
      const botResponse = generateBotResponse(messageText);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse.text,
        sender: "bot",
        timestamp: new Date(),
        type: botResponse.type
      };
      setMessages(prev => [...prev, botMessage]);
    }

    setIsTyping(false);
  };

  const generateBotResponse = (userInput: string): { text: string; type: "suggestion" | "plant-info" | "general" } => {
    const input = userInput.toLowerCase();
    
    // Plant-specific responses
    if (input.includes("turmeric")) {
      return {
        text: "Turmeric (Curcuma longa) is a powerful anti-inflammatory herb. It's excellent for joint health, immunity, and digestion. You can prepare it as:\n\n• Golden Milk: Mix 1 tsp turmeric powder with warm milk and honey\n• Fresh root juice for maximum potency\n• Turmeric paste for external applications\n\nIn Ayurveda, turmeric balances all three doshas and is considered sacred. Would you like to explore its 3D model or learn about similar herbs?",
        type: "plant-info"
      };
    }
    
    if (input.includes("ginger")) {
      return {
        text: "Ginger (Zingiber officinale) is amazing for digestion and nausea relief! Here's how to prepare ginger tea:\n\n1. Slice 1-inch fresh ginger root\n2. Boil in 2 cups water for 10-15 minutes\n3. Add honey and lemon to taste\n4. Drink warm for best results\n\nGinger is also excellent for circulation, reducing inflammation, and boosting immunity. It's a key herb in both Ayurveda and Traditional Chinese Medicine.",
        type: "plant-info"
      };
    }
    
    if (input.includes("immunity") || input.includes("immune")) {
      return {
        text: "Great question! Here are the top immunity-boosting herbs in AYUSH systems:\n\n🌿 **Tulsi** - Sacred adaptogen, respiratory health\n🌿 **Amla** - Highest natural Vitamin C source\n🌿 **Ashwagandha** - Stress adaptation, strength\n🌿 **Turmeric** - Anti-inflammatory, antioxidant\n🌿 **Ginger** - Digestive fire, circulation\n\nYou can explore these in our Virtual Tours section or view their 3D models in the gallery. Would you like specific preparation methods for any of these?",
        type: "suggestion"
      };
    }
    
    if (input.includes("stress") || input.includes("anxiety")) {
      return {
        text: "For stress relief, Ayurveda recommends these powerful adaptogens:\n\n🧘 **Ashwagandha** - The ultimate stress fighter, take 1-2g powder with warm milk before bed\n🧘 **Brahmi** - Calms the mind, enhances clarity\n🧘 **Tulsi** - Sacred herb, drink as tea throughout the day\n\nThese herbs help your body adapt to stress naturally. Combine with yoga, meditation, and proper sleep for best results. Would you like to learn about specific preparation methods?",
        type: "plant-info"
      };
    }
    
    if (input.includes("ayurveda") || input.includes("ayurvedic")) {
      return {
        text: "Ayurveda is based on balancing three doshas (body energies):\n\n• **Vata** (Air + Space) - Movement, creativity\n• **Pitta** (Fire + Water) - Metabolism, intelligence  \n• **Kapha** (Earth + Water) - Structure, immunity\n\nHerbs are chosen based on:\n- Your constitutional type (Prakriti)\n- Current imbalances (Vikriti)\n- Six tastes (Rasa)\n- Energetic properties (Virya)\n\nOur plant database includes Ayurvedic properties for each herb. Which aspect interests you most?",
        type: "general"
      };
    }
    
    // Default responses
    const defaultResponses = [
      {
        text: "That's a fascinating question about herbal medicine! While I'd love to help you explore this topic, could you be more specific? You can ask me about:\n\n• Specific plants and their uses\n• Preparation methods\n• AYUSH system principles\n• Plant combinations\n• Traditional remedies\n\nWhat aspect of medicinal plants interests you most?",
        type: "general" as const
      },
      {
        text: "I'm here to help you discover the wonderful world of medicinal plants! Our database contains detailed information about traditional herbs used in Ayurveda, Unani, Siddha, and other AYUSH systems.\n\nYou can explore:\n• Interactive 3D plant models\n• Virtual garden tours\n• Traditional preparation methods\n• Scientific research\n\nWhat would you like to learn about?",
        type: "suggestion" as const
      }
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-fresh-green hover:bg-forest text-white shadow-lg z-50 transition-all duration-300 hover:scale-110"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-96 bg-white shadow-2xl border-0 z-50 flex flex-col">
      <CardHeader className="bg-gradient-to-r from-fresh-green to-forest text-white p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Herbal Assistant</CardTitle>
              <p className="text-white/80 text-sm">Your AI herbalist guide</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start space-x-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === "user" 
                    ? "bg-fresh-green text-white" 
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {message.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`rounded-2xl p-3 ${
                  message.sender === "user"
                    ? "bg-fresh-green text-white"
                    : "bg-gray-100 text-gray-800"
                }`}>
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  {message.type && message.sender === "bot" && (
                    <Badge className="mt-2 text-xs bg-white/20 text-white">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {message.type === "plant-info" ? "Plant Info" : message.type === "suggestion" ? "Suggestion" : "Guide"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-600" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Suggestions */}
        {messages.length === 1 && (
          <div className="p-4 border-t bg-gray-50">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-1">
              {quickSuggestions.slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs h-6 px-2 text-fresh-green border-fresh-green hover:bg-fresh-green hover:text-white"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input */}
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Ask about medicinal plants..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 border-gray-200 focus:border-fresh-green"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentMessage.trim() || isTyping}
              className="bg-fresh-green hover:bg-forest text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}