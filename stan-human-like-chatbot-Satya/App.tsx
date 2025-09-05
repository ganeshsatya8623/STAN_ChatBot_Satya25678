
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Chat } from '@google/genai';
import { Header } from './components/Header';
import { ChatWindow } from './components/ChatWindow';
import { ChatInput } from './components/ChatInput';
import type { Message } from './types';
import { initializeChat } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);

  const loadHistory = useCallback(() => {
    try {
      const savedHistory = localStorage.getItem('chatHistory');
      const initialHistory = savedHistory ? JSON.parse(savedHistory) : [];
      setMessages(initialHistory);
      chatRef.current = initializeChat(initialHistory);
    } catch (e) {
      console.error("Failed to load or parse chat history:", e);
      setMessages([]);
      chatRef.current = initializeChat([]);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  // FIX: Refactored handleSendMessage to robustly handle streaming updates,
  // which also resolves the TypeScript type inference error. The previous implementation
  // was prone to race conditions due to its use of a shared index variable
  // across asynchronous state updates.
  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isLoading) return;

    const newUserMessage: Message = { role: 'user', content: userInput };
    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      if (!chatRef.current) {
        throw new Error("Chat not initialized");
      }
      
      const stream = await chatRef.current.sendMessageStream({ message: userInput });

      let botResponse = '';
      let botMessageAdded = false;

      for await (const chunk of stream) {
        botResponse += chunk.text;
        if (!botMessageAdded) {
          botMessageAdded = true;
          // Add the new bot message to the state on the first chunk
          setMessages(prev => [...prev, { role: 'model', content: botResponse }]);
        } else {
          // Update the last message on subsequent chunks
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = botResponse;
            return newMessages;
          });
        }
      }

      if (botMessageAdded) {
        const finalMessages = [...updatedMessages, { role: 'model', content: botResponse }];
        localStorage.setItem('chatHistory', JSON.stringify(finalMessages));
      }

    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error("Error sending message:", e);
      setError(`Sorry, I couldn't get a response. Error: ${errorMessage}`);
      const errorBotMessage: Message = { role: 'model', content: `Sorry, I couldn't get a response. Error: ${errorMessage}` };
      setMessages(prev => [...prev, errorBotMessage]);
      localStorage.setItem('chatHistory', JSON.stringify([...updatedMessages, errorBotMessage]));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewChat = () => {
    localStorage.removeItem('chatHistory');
    setMessages([]);
    chatRef.current = initializeChat([]);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-slate-100 font-sans">
      <Header onNewChat={handleNewChat} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow messages={messages} isLoading={isLoading} />
        {error && <div className="text-center text-red-400 p-2">{error}</div>}
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default App;
