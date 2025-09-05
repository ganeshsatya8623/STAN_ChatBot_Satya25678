
import React from 'react';
import type { Message as MessageType } from '../types';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-9 h-9 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8z" />
          </svg>
        </div>
      )}
      <div 
        className={`max-w-lg px-4 py-3 rounded-2xl shadow-md whitespace-pre-wrap ${
          isUser 
            ? 'bg-violet-600 text-white rounded-br-lg' 
            : 'bg-slate-700 text-slate-200 rounded-bl-lg'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};
