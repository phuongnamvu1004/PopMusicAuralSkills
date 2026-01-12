interface SidebarLinkProps {
  label: string;
  active?: boolean;
  onClick: () => void;
}

export function SidebarLink({ label, active, onClick }: SidebarLinkProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
        active 
          ? 'bg-sky-100 text-sky-700 shadow-sm' 
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
}
