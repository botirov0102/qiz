
import React from 'react';

export const Header: React.FC = () => (
  <header className="py-6 px-4 md:px-8 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="bg-pink-500 p-2 rounded-lg">
        <i className="fas fa-heart text-white text-xl"></i>
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
        AI Partner Matcher
      </h1>
    </div>
    <nav className="hidden md:flex gap-6 text-slate-400 font-medium">
      <a href="#" className="hover:text-pink-500 transition-colors">How it works</a>
      <a href="#" className="hover:text-pink-500 transition-colors">Gallery</a>
      <a href="#" className="hover:text-pink-500 transition-colors">Pricing</a>
    </nav>
  </header>
);

export const Footer: React.FC = () => (
  <footer className="py-8 px-4 border-t border-slate-800 text-center text-slate-500 text-sm">
    <p>© 2024 AI Partner Matcher. Powered by Gemini 2.5 Flash Image.</p>
    <div className="mt-4 flex justify-center gap-4">
      <i className="fab fa-twitter hover:text-white cursor-pointer transition-colors"></i>
      <i className="fab fa-instagram hover:text-white cursor-pointer transition-colors"></i>
      <i className="fab fa-discord hover:text-white cursor-pointer transition-colors"></i>
    </div>
  </footer>
);
