'use client'
import React, { useState, useEffect } from 'react';
import LinuxTerminal from './LinuxTerminal';

// Define the available pages for navigation
export type PageRoute = '/about' | '/projects' | '/events' | '/resources' | '/';

interface BlogLayoutProps {
  children?: React.ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageRoute>('/');
  const [isTerminalVisible, setIsTerminalVisible] = useState(false);

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

  // Handle navigation from terminal
  const handleTerminalNavigation = (path: string) => {
    // Convert path to a valid route
    let route: PageRoute = '/';
    
    if (path === '/about' || path.startsWith('/about/')) {
      route = '/about';
    } else if (path === '/projects' || path.startsWith('/projects/')) {
      route = '/projects';
    } else if (path === '/events' || path.startsWith('/events/')) {
      route = '/events';
    } else if (path === '/resources' || path.startsWith('/resources/')) {
      route = '/resources';
    }
    
    setCurrentPage(route);
    // Close terminal after navigation
    setIsTerminalOpen(false);
  };

  // Render the appropriate content based on the current page
  const renderPageContent = () => {
    switch (currentPage) {
      case '/about':
        return (
          <div className="prose lg:prose-xl">
            <h2 className="text-3xl font-bold mb-6">About OWASP Cebu</h2>
            <p className="text-lg text-gray-700 mb-4">
              OWASP Cebu's mission is to promote web application security awareness and best practices in the Cebu region.
            </p>
            
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Our Team</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg mb-2">Jhury Kevin Lastre</h3>
                  <p className="text-gray-600 text-sm mb-2">Chapter Leader</p>
                  <p className="text-gray-700">Software Engineer @ TaxMaverick Software</p>
                  <p className="text-gray-700">Masters in Information Security @ Kookmin University, South Korea</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg mb-2">Vincent Abella</h3>
                  <p className="text-gray-600 text-sm mb-2">Chapter Leader</p>
                  <p className="text-gray-700">Software Developer @ Mod Technologies</p>
                  <p className="text-gray-700">Masters in Information Security @ Kookmin University, South Korea</p>
                </div>
              </div>
            </div>
          </div>
        );
      case '/projects':
        return (
          <div className="prose lg:prose-xl">
            <h2 className="text-3xl font-bold mb-6">Our Projects</h2>
            <p className="text-lg text-gray-700 mb-4">
              OWASP Cebu is involved in various security projects aimed at improving web application security in the region.
            </p>
            
            <div className="my-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3 text-indigo-800">Current Projects</h3>
              <p className="text-gray-700">
                Security awareness training, vulnerability assessment workshops, and secure coding practices seminars.
              </p>
            </div>
            
            <div className="my-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3 text-indigo-800">Upcoming Projects</h3>
              <p className="text-gray-700">
                CTF competitions, security hackathons, and community outreach programs.
              </p>
            </div>
          </div>
        );
      case '/events':
        return (
          <div className="prose lg:prose-xl">
            <h2 className="text-3xl font-bold mb-6">Events</h2>
            <p className="text-lg text-gray-700 mb-4">
              Join us for our upcoming events and workshops focused on web application security.
            </p>
            
            <div className="my-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3 text-indigo-800">Upcoming Events</h3>
              <p className="text-gray-700">
                Stay tuned for our upcoming security workshops and community meetups.
              </p>
              <p className="text-gray-700 mt-4">
                Something will be here soon.
              </p>
            </div>
          </div>
        );
      case '/resources':
        return (
          <div className="prose lg:prose-xl">
            <h2 className="text-3xl font-bold mb-6">Resources</h2>
            <p className="text-lg text-gray-700 mb-4">
              Explore our collection of security resources and tools.
            </p>
            
            <div className="my-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3 text-indigo-800">Recommended Tools</h3>
              <p className="text-gray-700">
                Recommended security tools: OWASP ZAP, Burp Suite, Metasploit, Nmap, and Wireshark.
              </p>
            </div>
            
            <div className="my-8 p-6 bg-white rounded-xl shadow-md border border-gray-100">
              <h3 className="text-xl font-semibold mb-3 text-indigo-800">Security Guides</h3>
              <p className="text-gray-700">
                OWASP Top 10, Secure Coding Guidelines, and Web Application Security Testing Guide.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="prose lg:prose-xl">
            {/* Featured Card */}
            <div className="mb-12 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-8 border border-indigo-100 shadow-sm">
              <h2 className="text-3xl font-bold text-indigo-900 mb-4">Welcome to OWASP Cebu</h2>
              <p className="text-lg text-gray-700 mb-4">
                OWASP Cebu is a chapter of OWASP, the Open Web Application Security Project. 
                We are a community of security professionals, developers, and enthusiasts 
                dedicated to improving cybersecurity in Cebu.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Explore our resources using the navigation above or try our interactive terminal
                by clicking the icon in the bottom right corner.
              </p>
              <button className="mt-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Join Our Community
              </button>
            </div>

            {/* Content Cards */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-indigo-800">Upcoming Events</h3>
                <p className="text-gray-700">
                  Stay tuned for our upcoming security workshops and community meetups.
                </p>
                <a href="#" className="inline-block mt-4 text-indigo-600 hover:text-indigo-800">View all events →</a>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-3 text-indigo-800">Latest Projects</h3>
                <p className="text-gray-700">
                  Security awareness training, vulnerability assessment workshops, and secure coding practices seminars.
                </p>
                <a href="#" className="inline-block mt-4 text-indigo-600 hover:text-indigo-800">Explore projects →</a>
              </div>
            </div>

            {/* Team Section */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Our Team</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg mb-2">Jhury Kevin Lastre</h3>
                  <p className="text-gray-600 text-sm mb-2">Chapter Leader</p>
                  <p className="text-gray-700">Software Engineer @ TaxMaverick Software</p>
                  <p className="text-gray-700">Masters in Information Security @ Kookmin University, South Korea</p>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg mb-2">Vincent Abella</h3>
                  <p className="text-gray-600 text-sm mb-2">Chapter Leader</p>
                  <p className="text-gray-700">Software Developer @ Mod Technologies</p>
                  <p className="text-gray-700">Masters in Information Security @ Kookmin University, South Korea</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">OWASP Cebu</h1>
            <p className="text-xl max-w-2xl mx-auto opacity-90">
              Empowering the Cebu community with web application security knowledge and best practices
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0 font-bold text-indigo-600">
              OWASP Cebu
            </div>
            <div className="hidden md:flex space-x-8">
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setCurrentPage('/about'); }}
                className={`transition-colors ${currentPage === '/about' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                About
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setCurrentPage('/projects'); }}
                className={`transition-colors ${currentPage === '/projects' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                Projects
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setCurrentPage('/events'); }}
                className={`transition-colors ${currentPage === '/events' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                Events
              </a>
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); setCurrentPage('/resources'); }}
                className={`transition-colors ${currentPage === '/resources' ? 'text-indigo-600 font-medium' : 'text-gray-600 hover:text-indigo-600'}`}
              >
                Resources
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {children || renderPageContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">OWASP Cebu</h3>
                <p className="text-gray-400">
                  Promoting web application security awareness and best practices in the Cebu region.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setCurrentPage('/about'); }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setCurrentPage('/projects'); }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Projects
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setCurrentPage('/events'); }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Events
                    </a>
                  </li>
                  <li>
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); setCurrentPage('/resources'); }}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Resources
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Connect</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Email</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400">© {new Date().getFullYear()} OWASP Cebu. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Terminal Toggle Button with tooltip */}
      <button
        onClick={toggleTerminal}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50 flex items-center justify-center group"
        aria-label="Toggle Terminal"
      >
        <span className="absolute w-full h-full rounded-full bg-indigo-400 opacity-75 animate-ping group-hover:opacity-0"></span>
        <span className="absolute bottom-full right-0 mb-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
            className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
              isTerminalVisible ? 'opacity-100' : 'opacity-0'
            }`}
          ></div>
          
          {/* Terminal container with transition */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-8 pointer-events-none">
            <div 
              className={`bg-black/90 w-full max-w-5xl h-[60vh] rounded-lg shadow-2xl overflow-hidden relative pointer-events-auto transition-all duration-300 ${
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
                <LinuxTerminal onNavigate={handleTerminalNavigation} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogLayout; 