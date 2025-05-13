
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { X, Send, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
}

interface ChatInterfaceProps {
  seller: {
    id: string;
    name: string;
    avatar: string;
  };
  onClose: () => void;
}

// Mock current user
const currentUser = {
  id: "current-user",
  name: "Yo",
  avatar: "https://api.dicebear.com/6.x/initials/svg?seed=CurrentUser"
};

// Generate mock messages
const generateMockMessages = (sellerId: string): Message[] => {
  const now = new Date();
  const messages: Message[] = [];
  
  // Add some past messages
  for (let i = 0; i < 5; i++) {
    const isFromSeller = i % 2 === 0;
    const hoursBefore = 24 - i * 4;
    
    messages.push({
      id: `msg-${i}`,
      senderId: isFromSeller ? sellerId : currentUser.id,
      text: isFromSeller 
        ? ["Hola, tengo estas cartas disponibles.", "¿Sigues interesado en las cartas?", "Puedo hacer un precio especial si compras varias.", "Las tengo en near mint.", "¿Podemos coordinar un envío?"][i]
        : ["Hola, me interesan tus cartas de Modern.", "Sí, estoy buscando un playset de Ragavan.", "¿Cuánto sería en total?", "Perfecto, me interesa.", "¿Aceptas Mercado Pago?"][i],
      timestamp: new Date(now.getTime() - hoursBefore * 3600000),
      isRead: true
    });
  }
  
  return messages;
};

const ChatInterface = ({ seller, onClose }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>(() => generateMockMessages(seller.id));
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // Add message from current user
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text: newMessage,
      timestamp: new Date(),
      isRead: false
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");
    
    // Simulate seller reply after short delay
    setTimeout(() => {
      const sellerResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        senderId: seller.id,
        text: "¡Gracias por tu mensaje! Te responderé a la brevedad.",
        timestamp: new Date(),
        isRead: false
      };
      
      setMessages(prev => [...prev, sellerResponse]);
      
      // Show notification
      toast({
        title: "Nuevo mensaje",
        description: `${seller.name}: ${sellerResponse.text}`,
        duration: 3000,
      });
    }, 3000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      return date.toLocaleDateString("es-AR", { day: "numeric", month: "short" });
    }
  };

  return (
    <div className="flex flex-col h-[500px] max-h-[80vh]">
      <DialogHeader className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={seller.avatar} alt={seller.name} />
              <AvatarFallback>{seller.name[0]}</AvatarFallback>
            </Avatar>
            <DialogTitle>{seller.name}</DialogTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </DialogHeader>
      
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {messages.map((message, index) => {
          const isFromSeller = message.senderId === seller.id;
          const showDate = index === 0 || 
            formatDate(messages[index-1].timestamp) !== formatDate(message.timestamp);
          
          return (
            <div key={message.id}>
              {showDate && (
                <div className="flex justify-center my-2">
                  <span className="text-xs bg-muted px-2 py-1 rounded-md">
                    {formatDate(message.timestamp)}
                  </span>
                </div>
              )}
              <div className={`flex ${isFromSeller ? "justify-start" : "justify-end"}`}>
                <div className={`
                  max-w-[80%] p-3 rounded-lg 
                  ${isFromSeller 
                    ? "bg-secondary text-secondary-foreground rounded-tl-none" 
                    : "bg-primary text-primary-foreground rounded-tr-none"}
                `}>
                  <p className="break-words">{message.text}</p>
                  <div className={`text-xs mt-1 ${isFromSeller ? "text-muted-foreground" : "text-primary-foreground/80"}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t mt-auto">
        <form 
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribí un mensaje..."
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
