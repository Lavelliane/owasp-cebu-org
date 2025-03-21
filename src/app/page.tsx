'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import LinuxTerminal from "./components/LinuxTerminal"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);

  // Load Merriweather font
  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(link)
    }
  }, [])

  // Handle terminal visibility with animation
  useEffect(() => {
    if (isTerminalOpen) {
      // Small delay to ensure CSS transition works properly
      setTimeout(() => setIsTerminalVisible(true), 10);
    } else {
      setIsTerminalVisible(false);
    }
  }, [isTerminalOpen]);

  // Add keyboard shortcut for terminal toggle (Ctrl+`)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+` (backtick)
      if (e.ctrlKey && e.key === '`') {
        toggleTerminal();
      }
      // Also allow Escape key to close the terminal
      if (e.key === 'Escape' && isTerminalOpen) {
        toggleTerminal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isTerminalOpen]);

  const toggleTerminal = () => {
    if (isTerminalOpen) {
      // First hide the terminal with animation
      setIsTerminalVisible(false);
      // Then close it after animation completes
      setTimeout(() => setIsTerminalOpen(false), 300);
    } else {
      setIsTerminalOpen(true);
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black text-white font-merriweather">
      <main className="container mx-auto px-4 py-12">
        {/* Auth buttons */}
        <div className="flex justify-end mb-8">
          {status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              <span>Welcome, {session.user.name}</span>
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link 
                href="/login"
                className="px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition"
              >
                Sign In
              </Link>
              <Link 
                href="/register"
                className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left side content */}
          <div className="flex-1 max-w-xl">
            <div className="flex items-center mb-8">
              <img src="/OWASP_Icon_R_White.png" alt="OWASP Logo" className="h-16 w-auto mr-4" />
              <h1 className="text-4xl font-bold">OWASP Cebu</h1>
            </div>
            
            <h2 className="text-5xl font-bold mb-6 tracking-tight">Redefining Cybersecurity</h2>
            <p className="text-xl mb-8 text-gray-300">
              We are driven by a passion for security excellence and a 
              dedication to developing exceptional cyber defense skills in the Cebu region.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-black px-6 py-3 rounded-md font-medium transition hover:bg-gray-200">
                Learn More
              </button>
              <button className="border border-white px-6 py-3 rounded-md font-medium transition hover:bg-white hover:text-black">
                Join Our Community
              </button>
              <Link href="/ctfs" className="border border-white px-6 py-3 rounded-md font-medium transition hover:bg-white hover:text-black flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                  <line x1="4" y1="22" x2="4" y2="15"></line>
                </svg>
                CTF
              </Link>
              <Link href="/leaderboard" className="border border-white px-6 py-3 rounded-md font-medium transition hover:bg-white hover:text-black flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d="M18 20V10"></path>
                  <path d="M12 20V4"></path>
                  <path d="M6 20v-6"></path>
                </svg>
                Leaderboard
              </Link>
            </div>
          </div>
          
          {/* Right side content */}
          <div className="flex-1 flex justify-center items-center">
            <img 
              src="/OWASP_Icon_R_White.png" 
              alt="OWASP Cebu" 
              className="max-w-full h-auto opacity-60"
              width="400"
            />
          </div>
        </div>
        
        {/* Features section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border border-gray-800 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Security Projects</h3>
            <p className="text-gray-400">
              Explore our various security projects focused on web application security, 
              vulnerability assessment, and secure coding practices.
            </p>
          </div>
          
          <div className="p-6 border border-gray-800 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Events & Workshops</h3>
            <p className="text-gray-400">
              Join our hands-on workshops, CTF competitions, and community meetups to 
              enhance your cybersecurity knowledge.
            </p>
          </div>
          
          <div className="p-6 border border-gray-800 rounded-lg">
            <h3 className="text-2xl font-bold mb-4">Resources</h3>
            <p className="text-gray-400">
              Access security tools, guides, and best practices recommended by 
              our team of security professionals.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-8 mt-24 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/OWASP_Icon_R_White.png" alt="OWASP Logo" className="h-8 w-auto mr-2" />
            <span>© OWASP Cebu Chapter {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-300">About</a>
            <a href="#" className="hover:text-gray-300">Projects</a>
            <a href="#" className="hover:text-gray-300">Events</a>
            <a href="#" className="hover:text-gray-300">Contact</a>
          </div>
        </div>
      </footer>

      {/* Terminal Toggle Button with tooltip */}
      <button
        onClick={toggleTerminal}
        className="fixed bottom-6 right-6 bg-white text-black p-3 rounded-full shadow-lg hover:bg-gray-200 transition-all z-50 flex items-center justify-center group"
        aria-label="Toggle Terminal"
      >
        <span className="absolute w-full h-full rounded-full bg-white/50 opacity-75 animate-ping group-hover:opacity-0"></span>
        <span className="absolute bottom-full right-0 mb-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Toggle Terminal (Ctrl+`)
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3" />
        </svg>
      </button>

      {/* Terminal Modal with transitions */}
      {isTerminalOpen && (
        <div className="fixed inset-0 z-40 transition-all duration-300 ease-in-out">
          {/* Semi-transparent backdrop with transition */}
          <div 
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
              isTerminalVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={toggleTerminal}
          ></div>
          
          {/* Terminal container with transition */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <div 
              className={`bg-black w-full max-w-5xl h-[60vh] rounded-lg shadow-2xl overflow-hidden relative pointer-events-auto transition-all duration-300 ${
                isTerminalVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'
              }`}
            >
              <div className="bg-gray-900 px-4 py-2 flex justify-between items-center">
                <span className="text-gray-300 font-mono">OWASP Cebu Terminal</span>
                <button
                  onClick={toggleTerminal}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close Terminal"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="h-[calc(60vh-40px)]">
                <LinuxTerminal />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
