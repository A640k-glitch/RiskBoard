export function Logo({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4 20h16" strokeOpacity="0.1" />
      <path d="M4 20V4h6c3 0 5 2 5 5s-2 5-5 5H4" />
      <path d="M12 14l8 6" />
      <circle cx="12" cy="9" r="2" strokeOpacity="0.3" />
    </svg>
  );
}
