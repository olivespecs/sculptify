import React from 'react';

interface HeaderProps {
  onGetStartedClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onGetStartedClick }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-800">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.528-1.036.92-2.17.92-3.375C14.836 4.728 13.18 3 11.42 3S8 4.728 8 6.765c0 1.205.393 2.34.92 3.375l2.496 3.03zM11.42 15.17L6.75 21A2.652 2.652 0 013 17.25l5.877-5.877m0 0l2.496-3.03" />
          </svg>
          <span className="text-xl font-bold text-gray-800">Sculptify</span>
        </a>
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-gray-900">Home</a>
          <a href="#" className="hover:text-gray-900">Gallery</a>
          <a href="#" className="hover:text-gray-900">About</a>
        </div>
        <button
          onClick={onGetStartedClick}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-900 transition-colors"
        >
          Get Started
        </button>
      </nav>
    </header>
  );
};
