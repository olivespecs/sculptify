import React, { useState } from 'react';

interface EditPanelProps {
  onRefine: (prompt: string) => void;
  isEditing: boolean;
}

const quickEdits = [
  "Make it more shiny",
  "Give it a rougher texture",
  "Add subtle gold veins",
  "Add dramatic lighting",
];

export const EditPanel: React.FC<EditPanelProps> = ({ onRefine, isEditing }) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onRefine(customPrompt.trim());
      setCustomPrompt('');
    }
  };

  return (
    <div className="bg-white/60 border border-gray-200 rounded-lg p-4 sm:p-6 space-y-4 shadow-sm backdrop-blur-sm">
      <h3 className="text-lg font-bold text-gray-800 text-center">Refine Your Sculpture</h3>
      <div className="grid grid-cols-2 gap-3">
        {quickEdits.map((prompt) => (
          <button
            key={prompt}
            onClick={() => onRefine(prompt)}
            disabled={isEditing}
            className="w-full bg-gray-100 text-gray-700 font-semibold py-2 px-3 rounded-md text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isEditing}
          >
            {prompt}
          </button>
        ))}
      </div>
      <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3">
        <label htmlFor="custom-prompt" className="sr-only">Custom refinement prompt</label>
        <input
          id="custom-prompt"
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Or type a custom refinement..."
          disabled={isEditing}
          className="flex-grow w-full rounded-md border-gray-300 shadow-sm focus:border-[var(--primary-color)] focus:ring-[var(--primary-color)] text-sm"
        />
        <button
          type="submit"
          disabled={isEditing || !customPrompt.trim()}
          className="bg-gray-800 text-white font-bold py-2 px-4 rounded-md text-sm hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:bg-opacity-50 disabled:cursor-not-allowed"
          aria-busy={isEditing}
        >
          Refine
        </button>
      </form>
    </div>
  );
};
