
import React from 'react';

interface HeaderProps {
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onNewChat }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm p-4 flex justify-between items-center border-b border-slate-700 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-tr from-pink-500 to-violet-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V4a2 2 0 012-2h8z" />
            </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-100">STAN Chatbot</h1>
      </div>
      <button
        onClick={onNewChat}
        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors duration-200 text-sm font-semibold"
      >
        New Chat
      </button>
    </header>
  );
};
