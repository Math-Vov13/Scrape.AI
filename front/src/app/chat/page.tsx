"use client";

import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Send, Star, Settings, Clock, ChevronDown, ChevronUp, Bot, User } from "lucide-react";
import { useAuth } from '../../context/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';

type ToolCalled = {
  id: string;             // Unique identifier for the tool call
  name: string;           // Name of the tool called
  description: string;    // Description of what the tool does
  params: Record<string, any>; // Parameters passed to the tool
}

interface Message {
  // Base
  id: string;             // Unique identifier for each message
  content: string;        // The text content of the message
  isUser: boolean;        // True if the message is from the user, false if from AI
  timestamp: string;      // Timestamp of when the message was sent, formatted as "HH:MM"

  // Tools
  tools?: string[];         // List of tools used in the message, if any
  toolCalls?: ToolCalled[]; // List of tool calls made in the message, if any

  // Writting metadata
  timeFirstToken?: number; // First token of the message, if available
  timeTaken?: number;      // Time taken to generate the message in milliseconds
  error?: boolean;         // Error message if any
  isStreaming?: boolean;   // True if the message is currently being streamed
  isWaiting?: boolean;     // True if the AI is still processing the message
}

type ChatHistory = {
  id: string;             // Unique identifier for the chat history
  role: string;           // Role of the user in the chat (e.g., "user", "admin")
  content: string;        // Array of messages in the chat history
  createdAt: Date;        // Timestamp of when the chat history was created
}

const startConversation = [
  ", comment puis-je vous aider aujourd'hui ?",
  ", que puis-je faire pour vous ?",
  ". Comment puis-je vous assister ?",
  ", avez-vous une question ou un sujet en tête ?",
  ", je suis là pour répondre à vos questions.",
  ", je suis là pour répondre à vos questions. Souhaitez-vous un résumé des dernières actualités dans votre entreprise aujourd'hui ?",
  ". Voulez-vous que je vous rappelle vos prochaines tâches à accomplir ?",
  ", quelles sont vos envies ou priorités pour aujourd’hui ? Je peux vous aider à les organiser.",
  ", avez-vous besoin d’accéder à des informations sur un document spécifique ? Ou juste discuter de vos envies ?",
  ", je suis prêt à vous assister ! Par où démarrons-nous aujourd'hui ?",
]

export default function Home() {
  const { user, logout } = useAuth();

  const [toolsData, setToolsData] = useState<{ [key: string]: { name: string, description: string } }>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [expandedTools, setExpandedTools] = useState<{ [msgId: string]: number | null }>({});
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
        content: `Bonjour **${user?.full_name}**` + startConversation[Math.floor(Math.random() * startConversation.length)],
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/tools_desc.json');
      const jsonData = await response.json();
      setToolsData(jsonData);
    };

    fetchData();
  }, []);

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



  async function sendPrompt(prompt: string, message_id: string) {
    if (!prompt || isBlocking) return;

    // Prepare chat history for the API
    const History: ChatHistory[] = messages.slice(1).map((msg) => ({
      id: msg.id,
      role: msg.isUser ? 'user' : 'assistant',
      content: msg.content,
      createdAt: new Date(),
    }));

    // Add actual user prompt to history
    History.push({
      id: message_id,
      role: 'user',
      content: prompt,
      createdAt: new Date(),
    });

    try {
      const res = await fetch("/api/chat", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ History })
      });

      if (res.status === 401) {
        // Unauthorized, redirect to login
        logout(); // Ensure user is logged out
        throw new Error("Unauthorized. Please log in.");
      }

      if (!res.ok || !res.body) {
        throw new Error(`API error: ${res.status}`);
      }

      return res.body.getReader();

    } catch (err) {
      return err instanceof Error ? err.message : 'An error occurred while sending the prompt.';

    }
  }

  const handleSendMessage = () => {
    const prompt = inputValue.trim();
    if (!prompt || isBlocking) return;

    // When error occurs, remove the last two messages (User response and error message)
    if (messages[messages.length - 1].error === true) {
      setMessages((prev) => prev.slice(0, -2));
    }

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
    const new_MessageId = (Date.now() + 1).toString();


    setMessages(prev => [...prev, {
      id: new_MessageId,
      content: "",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: false, // Initially not streaming
      error: false, // No error initially
      isWaiting: true, // Flag to show waiting indicator
    }]);

    // Call ChatBot streaming API
    (async () => {
      const act_time = new Date(); // Record the time when the API call starts
      const api_response = await sendPrompt(prompt, new_MessageId);
      let messageContent = "";

      if (!api_response || typeof api_response !== 'object') {
        setMessages(prev => prev.map(msg => msg.id === new_MessageId
          ? { ...msg, timeTaken: 0, error: true, isWaiting: false, isStreaming: false, content: api_response || 'Error: We\'re Sorry, an unexpected error happend in background!' }
          : msg
        ));
        setIsWaitingResponse(false);
        return;
      }

      try {
        const decoder = new TextDecoder();
        // Process each chunk as it arrives
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await api_response.read();
          done = doneReading;

          if (value) {
            const text = decoder.decode(value, { stream: !done });
            if (text) {
              if (text.startsWith('[ERROR]')) {
                throw new Error("Internal Error!")
              }

              if (text.startsWith('<||TOOL||>')) {
                const toolData = text.slice(10).replace(/<\|\|END_TOOL\|\|>$/, '').trim();
                const toolCall: ToolCalled = JSON.parse(toolData);
                toolCall.description = toolsData[toolCall.name]?.description || "No description provided";

                setMessages(prev => prev.map(msg =>
                  msg.id === new_MessageId
                    ? {
                      ...msg,
                      toolCalls: msg.toolCalls ? [...msg.toolCalls, toolCall] : [toolCall],
                      isWaiting: false // Remove waiting indicator once streaming starts
                    }
                    : msg
                ));
                continue; // Skip appending text to content
              }

              setMessages(prev => prev.map(msg =>
                msg.id === new_MessageId
                  ? {
                    ...msg,
                    timeFirstToken: msg.timeFirstToken !== undefined ? msg.timeFirstToken : new Date().getTime() - act_time.getTime(),
                    content: msg.content + text,
                    isWaiting: false // Remove waiting indicator once streaming starts
                  }
                  : msg
              ));
              messageContent += text; // Append to the full message content
            }
          }
        }

        if (messageContent === undefined || messageContent.trim() === "") {
          // If no content was received, set an error message
          setMessages(prev => prev.map(msg =>
            msg.id === new_MessageId
              ? { ...msg, timeTaken: 0, error: true, isWaiting: false, isStreaming: false, content: 'Error: We\'re sorry, AI did not give an answer...' }
              : msg
          ));
          return;
        }

        // Mark streaming as complete
        setMessages(prev => prev.map(msg =>
          msg.id === new_MessageId
            ? { ...msg, timeTaken: new Date().getTime() - act_time.getTime(), isWaiting: false, isStreaming: false }
            : msg
        ));
      } catch (err) {
        console.error(err);
        setMessages(prev => prev.map(msg => msg.id === new_MessageId ? { ...msg, timeTaken: new Date().getTime() - act_time.getTime(), error: true, isWaiting: false, isStreaming: false, content: 'Error: We\'re Sorry, an unexpected error happend in background!' } : msg));
      } finally {
        setIsWaitingResponse(false);
      }
    })();
  };

  return (
    <ProtectedRoute validateAdmin={false}>
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
            Connected as <span className="font-semibold text-orange-500 ml-1">"{user?.full_name}"</span>{ "   " }
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href="/login">
                Logout
              </a>
            </Button>
            { user?.admin && (
              <>
              <Settings className="h-5 w-5" />
              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a href="/admin">
                  Go to Admin Panel
                </a>
              </Button>
              </>
            )}
          </div>
        </header>

        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-thin scrollbar-thumb-orange-500/50"
        >
          {messages.map((message) => {
            const expandedTool = expandedTools[message.id] ?? null;

            return (
              <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} group`}>
                <div className={`flex max-w-[85%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} gap-3 items-start`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${message.isUser
                    ? 'bg-gradient-to-r from-orange-600 to-orange-700 shadow-orange-500/30'
                    : 'bg-gradient-to-r from-orange-500 to-orange-600 shadow-orange-500/40'
                    }`}>
                    {message.isUser ? (
                      <User className="w-5 h-5 text-black" />
                    ) : (
                      <Bot className="w-5 h-5 text-black" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    {/* Tool calls section */}
                    {!message.isUser && message.toolCalls && message.toolCalls.length > 0 && (
                      <div className="space-y-2">
                        {message.toolCalls.map((tool, idx) => {
                          const isExpanded = expandedTool === idx;
                          const truncatedName = tool.name.length > 20 ? tool.name.slice(0, 20) + "…" : tool.name;

                          return (
                            <div
                              key={tool.id || idx}
                              className="bg-gray-900/70 backdrop-blur-sm border border-orange-500/30 rounded-lg overflow-hidden shadow-sm hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-200 cursor-pointer"
                              onClick={() =>
                                setExpandedTools((prev) => ({
                                  ...prev,
                                  [message.id]: isExpanded ? null : idx,
                                }))
                              }
                            >
                              <div className="flex items-center justify-between p-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                  <span className="font-medium text-sm text-orange-300">
                                    {isExpanded ? tool.name : truncatedName}
                                  </span>
                                </div>
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4 text-orange-400" />
                                ) : (
                                  <ChevronDown className="w-4 h-4 text-orange-400" />
                                )}
                              </div>

                              {isExpanded && (
                                <div className="px-3 pb-3 border-t border-orange-500/30 bg-black/40">
                                  <div className="pt-2 space-y-2 text-xs">
                                    {tool.description && (
                                      <div>
                                        <span className="font-semibold text-orange-400">Description :</span>
                                        <p className="text-gray-300 mt-1">{tool.description}</p>
                                      </div>
                                    )}
                                    <div>
                                      <span className="font-semibold text-orange-400">Parameters :</span>
                                      <pre className="bg-black/60 rounded p-2 mt-1 overflow-x-auto text-gray-300 border border-orange-500/20">
                                        {JSON.stringify(tool.params, null, 2)}
                                      </pre>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Main message bubble */}
                    <div
                      className={`
                      relative px-4 py-3 rounded-2xl shadow-lg
                      ${message.isUser
                          ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-black ml-auto shadow-orange-500/30'
                          : 'bg-gray-900/80 text-orange-100 border border-orange-500/20 shadow-black/50'
                        }
                      ${message.error ? 'bg-red-900/50 border-red-500/50 text-red-300' : ''}
                    `}
                    >
                      {/* Message content */}
                      <div className={`
                      ${message.isUser ? 'text-black font-medium' : 'text-orange-100'}
                      ${!message.isUser && message.isStreaming ? 'typing-animation' : ''}
                      ${message.error ? 'font-medium' : ''}
                    `}>
                        {!message.isUser && message.isWaiting ? (
                          <div className="flex items-center space-x-1 py-2">
                            <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce"></div>
                            <div className="h-2 w-2 bg-orange-400 rounded-full animate-bounce delay-100"></div>
                            <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce delay-200"></div>
                          </div>
                        ) : (
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        )}
                      </div>

                      {/* Message tail */}
                      <div className={`
                      absolute top-3 w-3 h-3
                      ${message.isUser
                          ? '-right-1 bg-gradient-to-r from-orange-600 to-orange-700 transform rotate-45'
                          : '-left-1 bg-gray-900/80 border-l border-b border-orange-500/20 transform rotate-45'
                        }
                    `}></div>
                    </div>

                    {/* Timestamp and metadata */}
                    <div className={`
                    flex items-center gap-2 text-xs text-gray-400 px-1
                    ${message.isUser ? 'justify-end' : 'justify-start'}
                  `}>
                      <span className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full border border-orange-500/20">
                        {message.timestamp}
                      </span>
                      {!message.isUser && typeof message.timeFirstToken === 'number' && (
                        <span className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 border border-orange-500/20">
                          <Clock className="w-3 h-3 text-orange-400" />
                          <span className="text-orange-100">{(message.timeFirstToken / 1000).toFixed(3)}s</span>
                        </span>
                      )}
                      {!message.isUser && typeof message.timeTaken === 'number' && !message.isStreaming && (
                        <span className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 border border-orange-500/20">
                          <Clock className="w-3 h-3 text-orange-400" />
                          <span className="text-orange-300">{(message.timeTaken / 1000).toFixed(1)}s</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
              placeholder="Ask a question..."
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
