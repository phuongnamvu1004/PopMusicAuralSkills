import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Introduction } from './components/content/Introduction';
import { Chapter1Text } from './components/content/Chapter1Text';
import { Chapter1Exercise } from './components/content/Chapter1Exercise';
import { Chapter2Text } from './components/content/Chapter2Text';
import { Chapter2Exercise } from './components/content/Chapter2Exercise';
import { Chapter3Text } from './components/content/Chapter3Text';
import { Chapter3Exercise } from './components/content/Chapter3Exercise';

export type ContentType = 'intro' | 'ch1-text' | 'ch1-exercise' | 'ch2-text' | 'ch2-exercise' | 'ch3-text' | 'ch3-exercise';

export default function App() {
  const [activeContent, setActiveContent] = useState<ContentType>('intro');

  const renderContent = () => {
    switch (activeContent) {
      case 'intro':
        return <Introduction />;
      case 'ch1-text':
        return <Chapter1Text />;
      case 'ch1-exercise':
        return <Chapter1Exercise />;
      case 'ch2-text':
        return <Chapter2Text />;
      case 'ch2-exercise':
        return <Chapter2Exercise />;
      case 'ch3-text':
        return <Chapter3Text />;
      case 'ch3-exercise':
        return <Chapter3Exercise />;
      default:
        return <Introduction />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeContent={activeContent} setActiveContent={setActiveContent} />
      <main className="flex-1 p-8 md:p-12 overflow-auto">
        <div className="animate-fadeIn">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
