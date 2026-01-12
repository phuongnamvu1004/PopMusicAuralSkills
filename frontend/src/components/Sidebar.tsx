import type { ContentType } from '../App';
import { SidebarSection } from './SidebarSection';
import { SidebarLink } from './SidebarLink';

interface SidebarProps {
  activeContent: ContentType;
  setActiveContent: (content: ContentType) => void;
}

export function Sidebar({ activeContent, setActiveContent }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto shadow-lg">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-sky-700">Aural Skills</h1>
        <p className="text-gray-500 text-sm mt-1">An Interactive Textbook</p>
      </div>

      <nav className="p-4">
        <SidebarLink 
          label="Introduction" 
          active={activeContent === 'intro'}
          onClick={() => setActiveContent('intro')}
        />

        <SidebarSection title="Level 1A">
          <SidebarLink 
            label="1A: 1, 2, 3 Scale Degrees" 
            active={activeContent === 'ch1-text'}
            onClick={() => setActiveContent('ch1-text')}
          />
          <SidebarLink 
            label="1A: Exercises" 
            active={activeContent === 'ch1-exercise'}
            onClick={() => setActiveContent('ch1-exercise')}
          />
        </SidebarSection>

        <SidebarSection title="Level 1B">
          <SidebarLink 
            label="1B: xxx Scale Degrees" 
            active={activeContent === 'ch2-text'}
            onClick={() => setActiveContent('ch2-text')}
          />
          <SidebarLink 
            label="1B: Exercises" 
            active={activeContent === 'ch2-exercise'}
            onClick={() => setActiveContent('ch2-exercise')}
          />
        </SidebarSection>

        <SidebarSection title="Level 1C">
          <SidebarLink 
            label="1C: xxx Scale Degrees" 
            active={activeContent === 'ch3-text'}
            onClick={() => setActiveContent('ch3-text')}
          />
          <SidebarLink 
            label="1C: Exercises" 
            active={activeContent === 'ch3-exercise'}
            onClick={() => setActiveContent('ch3-exercise')}
          />
        </SidebarSection>
      </nav>
    </aside>
  );
}
