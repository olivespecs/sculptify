import React from 'react';

interface ResultDisplayProps {
  isLoading: boolean;
  isEditing: boolean;
  generatedImage: string | null;
  error: string | null;
}

const Spinner: React.FC = () => (
  <svg className="animate-spin h-10 w-10 text-[var(--primary-color)] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, isEditing, generatedImage, error }) => {

  const renderContent = () => {
    if (isLoading || isEditing) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500">
          <Spinner />
          <p className="mt-4 text-lg animate-pulse">
            {isEditing ? 'Refining your masterpiece...' : 'Crafting your masterpiece...'}
          </p>
          <p className="text-sm mt-1">This may take a moment.</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-500 p-4">
          <span className="material-symbols-outlined text-5xl">error</span>
          <p className="font-bold mt-2">An Error Occurred</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      );
    }
    if (generatedImage) {
      return <img src={generatedImage} alt="Generated sculpture" className="w-full h-full object-cover" />;
    }
    return (
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7gE_iyx7-vMApA6IEp-ZijnyTwFceDRX-S316zCpmr034OKn2tN7oi1-VI8PVMZKh7RfWpnXu54OK3XxDmRmtaKy61FEa4oork_BK7gmdxBWpAinRUh6DAcjbcNkVmumUK3ELkgEhpe0n1Q-ft9SCCLaaI17cr-sjXzBffk65RfoMJ-4hJZOMPkwxccMto5fjcolYbTj9NsN2q07f8AqHshfKpg1dh4rdi2kVI_fDqYU_3Ck0izUjlMiQ3UAOvA-VL__pN-qxp9y5" alt="A photorealistic marble sculpture" className="w-full h-full object-cover" />
    );
  };

  const getMessage = () => {
    if (error) return "Please try again.";
    if (generatedImage) return "Your generated masterpiece!";
    return "Result will appear here";
  }

  return (
    <div className="flex flex-col">
      <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center">
        {renderContent()}
      </div>
      <div className="h-8 flex items-center justify-center gap-2">
        <p className="text-sm text-gray-500 mt-2 text-center">{getMessage()}</p>
        {generatedImage && !isLoading && !isEditing && !error && (
            <a
              href={generatedImage}
              download="sculptify-masterpiece.png"
              className="mt-2 text-gray-500 hover:text-[var(--primary-color)] transition-colors"
              title="Download Image"
              aria-label="Download Image"
            >
              <span className="material-symbols-outlined">download</span>
            </a>
        )}
      </div>
    </div>
  );
};
