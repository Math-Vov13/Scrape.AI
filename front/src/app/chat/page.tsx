"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThumbsUp, ThumbsDown, RefreshCw, Copy, Plus, Send, Star, Settings } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
// Mistral API key (provided by user)
const MISTRAL_API_KEY = "S2nqvZQmrdaRwhNhgcMT3M7uyHcjAK5D";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
  isStreaming?: boolean;
  isWaiting?: boolean;
}

const startConversation = [
  "Bonjour, comment puis-je vous aider aujourd'hui ?",
  "Salut ! Que puis-je faire pour vous ?",
  "Bienvenue ! Comment puis-je vous assister ?",
  "Bonjour ! Avez-vous une question ou un sujet en tête ?",
  "Salut ! Je suis là pour répondre à vos questions.",
  "Bonjour ! Souhaitez-vous un résumé des dernières actualités dans votre entreprise aujourd'hui ?",
  "Salut ! Voulez-vous que je vous rappelle vos prochaines tâches à accomplir ?",
  "Bonjour ! Quelles sont vos envies ou priorités pour aujourd’hui ? Je peux vous aider à les organiser.",
  "Bienvenue ! Avez-vous besoin d’accéder à des informations sur un document spécifique ?",
  "Hello ! Je suis prêt à vous assister, par où démarrons-nous ?",
]

export default function Home() {
  const { user, logout } = useAuth();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [responseIndex, setResponseIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [isWaitingResponse, setIsWaitingResponse] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const initialInputHeight = useRef<number>(0);
  const isBlocking = isWaitingResponse; // block send until AI finishes

  useEffect(() => {
    setMessages([
      {
        id: "1",
        content: startConversation[Math.floor(Math.random() * startConversation.length)],
        isUser: false,
        timestamp: "16:58",
      },
    ]);
  }, [1]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-focus the input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      // record initial one-line height
      initialInputHeight.current = inputRef.current.clientHeight;
    }
  }, []);

  const handleSendMessage = () => {
    const prompt = inputValue.trim();
    if (!prompt || isBlocking) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: prompt,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    // After clearing, focus back on the textarea
    inputRef.current?.focus();
    // Reset textarea height (auto will fallback to rows=1 height)
    if (inputRef.current) inputRef.current.style.height = 'auto';
    setIsWaitingResponse(true);
    // Create placeholder AI message for streaming
    const aiMessageId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMessageId,
      content: "",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
      isWaiting: true, // Flag to show waiting indicator
    }]);
    // Call Mistral streaming API
    (async () => {
      try {
        const res = await fetch("/api/chat", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt })
        });
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          // Proxy returned an error JSON
          const errJson = await res.json();
          setMessages(prev => prev.map(msg => msg.id === aiMessageId
            ? { ...msg, isStreaming: false, content: errJson.error || 'Erreur serveur' }
            : msg
          ));
          setIsWaitingResponse(false);
          return;
        }
        if (!res.ok || !res.body) {
          throw new Error(`API error: ${res.status}`);
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        // Process each chunk as it arrives
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;

          if (value) {
            const text = decoder.decode(value, { stream: !done });
            if (text) {
              setMessages(prev => prev.map(msg =>
                msg.id === aiMessageId
                  ? {
                    ...msg,
                    content: msg.content + text,
                    isWaiting: false // Remove waiting indicator once streaming starts
                  }
                  : msg
              ));
            }
          }
        }

        // Mark streaming as complete
        setMessages(prev => prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, isStreaming: false }
            : msg
        ));
      } catch (err) {
        console.error(err);
        setMessages(prev => prev.map(msg => msg.id === aiMessageId ? { ...msg, isStreaming: false, content: 'Erreur de réponse.' } : msg));
      } finally {
        setIsWaitingResponse(false);
      }
    })();
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-background relative">
        {/* Admin button */}
        <header className="p-4 flex items-center border-b border-border">
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-secondary rounded-full">
              <Plus className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-secondary rounded-full">
              <Star className="h-5 w-5" />
            </button>
          </div>

          <div className="ml-auto flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href="/login">
                Connexion
              </a>
            </Button>
            <button
              className="p-2 hover:bg-secondary rounded-full"
              onClick={() => window.location.href = '/admin'}
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Chat container */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-auto p-4 space-y-6"
        >
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
              <div className={`${message.isUser ? 'chat-message-user' : 'chat-message-ai'}`}>
                {!message.isUser && (
                  <div className="flex-shrink-0">
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground" />
                  </div>
                )}
                <div className="flex flex-col">
                  <div className={`text-sm ${!message.isUser && message.isStreaming ? 'streaming-cursor' : ''}`}>
                    {!message.isUser && message.isWaiting ? (
                      <div className="flex items-center space-x-1">
                        <div className="h-2 w-2 bg-foreground/70 rounded-full animate-pulse"></div>
                        <div className="h-2 w-2 bg-foreground/70 rounded-full animate-pulse delay-150"></div>
                        <div className="h-2 w-2 bg-foreground/70 rounded-full animate-pulse delay-300"></div>
                      </div>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Input area */}
        <div className="p-4 border-t border-border">
          <div className="flex items-start space-x-2 max-w-3xl mx-auto">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && e.shiftKey && (e.preventDefault(), handleSendMessage())}
              placeholder="Posez une question..."
              className="chat-input resize-none"
              onInput={(e) => {
                const ta = e.currentTarget;
                // resize but never below initial one-line height
                ta.style.height = 'auto';
                const minH = initialInputHeight.current;
                const newH = Math.max(ta.scrollHeight, minH);
                ta.style.height = `${newH}px`;
              }}
              style={{ maxHeight: '7.5rem', overflowY: 'auto' }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isBlocking}
              className="rounded-full p-2 h-10 w-10 flex items-center justify-center"
              variant={inputValue.trim() && !isBlocking ? "default" : "secondary"}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
