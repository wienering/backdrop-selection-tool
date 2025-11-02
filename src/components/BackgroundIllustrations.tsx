export default function BackgroundIllustrations() {
  return (
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <svg className="absolute top-20 left-10 w-32 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="30" width="60" height="50" stroke="white" strokeWidth="2" fill="none" rx="4"/>
        <rect x="25" y="35" width="50" height="40" stroke="white" strokeWidth="1.5" fill="none"/>
        <circle cx="50" cy="55" r="8" fill="white"/>
        <rect x="30" y="20" width="40" height="15" stroke="white" strokeWidth="2" fill="none" rx="2"/>
      </svg>
      <svg className="absolute bottom-32 right-20 w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="20" width="80" height="60" stroke="white" strokeWidth="2" fill="none" rx="6"/>
        <path d="M30 30 L50 50 L70 30" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="50" cy="50" r="12" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="50" cy="50" r="4" fill="white"/>
      </svg>
      <svg className="absolute top-40 right-32 w-20 h-32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="10" width="70" height="90" stroke="white" strokeWidth="2" fill="none" rx="4"/>
        <rect x="20" y="20" width="60" height="20" stroke="white" strokeWidth="1.5" fill="white" opacity="0.3"/>
        <rect x="20" y="45" width="60" height="20" stroke="white" strokeWidth="1.5" fill="white" opacity="0.3"/>
        <rect x="20" y="70" width="60" height="20" stroke="white" strokeWidth="1.5" fill="white" opacity="0.3"/>
      </svg>
      <svg className="absolute bottom-20 left-32 w-28 h-28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="2" fill="none"/>
        <circle cx="50" cy="50" r="25" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M50 30 L50 50 L65 50" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="50" cy="50" r="4" fill="white"/>
      </svg>
      <svg className="absolute top-60 left-1/4 w-16 h-20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="35" y="15" width="30" height="50" stroke="white" strokeWidth="2" fill="none" rx="2"/>
        <path d="M45 25 L55 25 M45 35 L55 35 M45 45 L55 45" stroke="white" strokeWidth="2"/>
        <circle cx="50" cy="58" r="3" fill="white"/>
      </svg>
    </div>
  )
}

