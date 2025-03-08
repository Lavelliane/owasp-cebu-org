'use client'
import React, { useState, useEffect, useRef, ReactNode } from 'react';

// TypeScript types for the file system
export type FileStructure = {
  name: string;
  type: "file" | "directory";
  path: string;
  content?: string;
  children?: Record<string, FileStructure>;
};

interface TerminalOutput {
  type: 'output' | 'error' | 'command' | 'suggestions';
  content: ReactNode;
}

// Define props interface for LinuxTerminal
interface LinuxTerminalProps {
  onNavigate?: (path: string) => void;
}

// The directory structure provided
export const directories = {
  root: {
    name: "OWASP Cebu",
    type: "directory",
    path: "/",
    children: {
      about: {
        name: "about",
        type: "directory",
        path: "/about",
        children: {
          "mission.txt": {
            name: "mission.txt",
            type: "file",
            path: "/about/mission.txt",
            content: "OWASP Cebu's mission is to promote web application security awareness and best practices in the Cebu region."
          },
          "team.txt": {
            name: "team.txt",
            type: "file",
            path: "/about/team.txt",
            content: `Our team consists of security professionals, developers, and enthusiasts dedicated to improving cybersecurity in Cebu.
                        Chapter Leaders: 
                        Jhury Kevin Lastre (jhurykev.lastre@owasp.org)
                        - Software Engineer @ TaxMaverick Software
                        - Masters in Information Security @ Kookmin University, South Korea
                        Vincent Abella (github: @roastedbeans)
                        - Software Developer @ Mod Technologies
                        - Masters in Information Security @ Kookmin University, South Korea
                        `
          }
        }
      },
      projects: {
        name: "projects",
        type: "directory",
        path: "/projects",
        children: {
          "current.txt": {
            name: "current.txt",
            type: "file",
            path: "/projects/current.txt",
            content: "Security awareness training, vulnerability assessment workshops, and secure coding practices seminars."
          },
          "upcoming.txt": {
            name: "upcoming.txt",
            type: "file",
            path: "/projects/upcoming.txt",
            content: "CTF competitions, security hackathons, and community outreach programs."
          }
        }
      },
      events: {
        name: "events",
        type: "directory",
        path: "/events",
        children: {
          "schedule.txt": {
            name: "schedule.txt",
            type: "file",
            path: "/events/schedule.txt",
            content: "Something will be here soon."
          }
        }
      },
      resources: {
        name: "resources",
        type: "directory",
        path: "/resources",
        children: {
          "tools.txt": {
            name: "tools.txt",
            type: "file",
            path: "/resources/tools.txt",
            content: "Recommended security tools: OWASP ZAP, Burp Suite, Metasploit, Nmap, and Wireshark."
          },
          "guides.txt": {
            name: "guides.txt",
            type: "file",
            path: "/resources/guides.txt",
            content: "OWASP Top 10, Secure Coding Guidelines, and Web Application Security Testing Guide."
          }
        }
      },
      contact: {
        name: "contact",
        type: "directory",
        path: "/contact",
        children: {
          "info.txt": {
            name: "info.txt",
            type: "file",
            path: "/contact/info.txt",
            content: "Email: jhurykev.lastre@owasp.org\nFacebook: OWASP Cebu"
          }
        }
      }
    }
  }
};

// Available commands with descriptions for intellisense
const availableCommands = [
  { command: 'ls', description: 'List directory contents' },
  { command: 'cd', description: 'Change directory' },
  { command: 'pwd', description: 'Print working directory' },
  { command: 'cat', description: 'Display file contents' },
  { command: 'echo', description: 'Display a line of text' },
  { command: 'mkdir', description: 'Create a new directory' },
  { command: 'touch', description: 'Create an empty file' },
  { command: 'rm', description: 'Remove files or directories' },
  { command: 'clear', description: 'Clear the terminal screen' },
  { command: 'whoami', description: 'Display current user' },
  { command: 'date', description: 'Display current date and time' },
  { command: 'help', description: 'Display help message' },
  { command: 'exit', description: 'Exit the terminal (simulation only)' },
  { command: 'logout', description: 'Logout from the terminal (simulation only)' }
];

const LinuxTerminal: React.FC<LinuxTerminalProps> = ({ onNavigate }) => {
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [currentDirectory, setCurrentDirectory] = useState<string>('/');
  const [currentPrompt, setCurrentPrompt] = useState<string>('owasp-cebu@linux:~$');
  const [commandInput, setCommandInput] = useState<string>('');
  const [suggestions, setSuggestions] = useState<{show: boolean, items: {command: string, description: string}[]}>({
    show: false,
    items: []
  });
  const [selectedSuggestion, setSelectedSuggestion] = useState<number>(-1);
  const [terminalOutput, setTerminalOutput] = useState<TerminalOutput[]>([
    {
      type: 'output',
      content: (
        <>
          <pre className="logo">
           <img src="/OWASP_Icon_R_White.png" alt="Logo" width="200" height="auto"/>
          </pre>
          <div>Welcome to OWASP Cebu v1.0.0</div>
          <div>Type &apos;help&apos; to see available commands</div>
          <div>Press TAB to autocomplete when commands are suggested</div>
        </>
      ),
    },
  ]);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  // Keep the file system structure in a ref to avoid unnecessary rerenders
  const fileSystemRef = useRef<FileStructure>({
    name: directories.root.name,
    type: directories.root.type as "directory" | "file",
    path: directories.root.path,
    children: directories.root.children as Record<string, FileStructure>
  });

  // Focus input when clicking on terminal
  useEffect(() => {
    const handleTerminalClick = (): void => {
      inputRef.current?.focus();
    };
    
    const terminalElement = terminalRef.current;
    if (terminalElement) {
      terminalElement.addEventListener('click', handleTerminalClick);
      
      return () => {
        terminalElement.removeEventListener('click', handleTerminalClick);
      };
    }
  }, []);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  // Initial focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update prompt when directory changes
  useEffect(() => {
    let displayPath = currentDirectory;
    if (displayPath === '/') {
      displayPath = '~';
    }
    setCurrentPrompt(`owasp-cebu@linux:${displayPath}$`);
  }, [currentDirectory]);

  // Update suggestions based on command input
  useEffect(() => {
    if (commandInput.trim() === '') {
      setSuggestions({ show: false, items: [] });
      return;
    }

    const args = commandInput.split(' ');
    
    // Command suggestions for the first word
    if (args.length === 1) {
      const cmdPrefix = args[0].toLowerCase();
      const matchingCommands = availableCommands.filter(
        cmd => cmd.command.startsWith(cmdPrefix)
      );
      
      if (matchingCommands.length > 0) {
        setSuggestions({
          show: true,
          items: matchingCommands
        });
        setSelectedSuggestion(0); // Select first suggestion by default
      } else {
        setSuggestions({ show: false, items: [] });
      }
    } else {
      // For now, hide command suggestions when there are multiple arguments
      // Path completion is handled separately in tabComplete()
      setSuggestions({ show: false, items: [] });
    }
  }, [commandInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setCommandInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSuggestions({ show: false, items: [] });
      executeCommand(commandInput);
      setCommandInput('');
      
      if (commandInput !== '') {
        setCommandHistory(prev => [...prev, commandInput]);
        setHistoryIndex(commandHistory.length);
      }
    } else if (e.key === 'ArrowUp') {
      if (suggestions.show) {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.items.length - 1
        );
      } else {
        e.preventDefault();
        if (historyIndex > 0) {
          setHistoryIndex(prev => prev - 1);
          setCommandInput(commandHistory[historyIndex - 1]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      if (suggestions.show) {
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.items.length - 1 ? prev + 1 : 0
        );
      } else {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          setHistoryIndex(prev => prev + 1);
          setCommandInput(commandHistory[historyIndex + 1]);
        } else {
          setHistoryIndex(commandHistory.length);
          setCommandInput('');
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.show && selectedSuggestion >= 0) {
        // Apply the selected command suggestion
        const suggestion = suggestions.items[selectedSuggestion].command;
        setCommandInput(suggestion + ' ');
        setSuggestions({ show: false, items: [] });
      } else {
        // Try path completion
        tabComplete();
      }
    } else if (e.key === 'Escape') {
      // Hide suggestions
      setSuggestions({ show: false, items: [] });
    }
  };

  // Helper functions for file system navigation
  const getItemAtPath = (path: string): FileStructure | null => {
    // Root path special case
    if (path === '/') {
      return fileSystemRef.current;
    }
    
    // Normalize path
    const normalizedPath = path.endsWith('/') && path !== '/' 
      ? path.slice(0, -1) 
      : path;
    
    // Find the item with the matching path
    const findItemByPath = (node: FileStructure, targetPath: string): FileStructure | null => {
      if (node.path === targetPath) {
        return node;
      }
      
      if (node.type === 'directory' && node.children) {
        for (const key in node.children) {
          const child = node.children[key];
          const result = findItemByPath(child, targetPath);
          if (result) {
            return result;
          }
        }
      }
      
      return null;
    };
    
    return findItemByPath(fileSystemRef.current, normalizedPath);
  };

  const resolvePath = (path: string): string => {
    // Handle empty path
    if (!path) return currentDirectory;
    
    // Handle absolute vs relative path
    const fullPath = path.startsWith('/') ? path : `${currentDirectory}${currentDirectory.endsWith('/') ? '' : '/'}${path}`;
    
    // Normalize path (handle ../, ./, and multiple slashes)
    const parts = fullPath.split('/').filter(Boolean);
    const resultParts: string[] = [];
    
    for (const part of parts) {
      if (part === '.') {
        // Current directory, do nothing
      } else if (part === '..') {
        // Parent directory, remove last part if possible
        if (resultParts.length > 0) resultParts.pop();
      } else {
        resultParts.push(part);
      }
    }
    
    return '/' + resultParts.join('/');
  };

  const tabComplete = (): void => {
    const input = commandInput;
    const args = input.split(' ');
    
    // Only auto-complete path for the last argument
    if (args.length >= 1) {
      const lastArg = args[args.length - 1];
      
      // Check if it's a path
      if (lastArg.includes('/') || args.length > 1) {
        const pathToComplete = lastArg || currentDirectory;
        const lastSlashIndex = pathToComplete.lastIndexOf('/');
        
        // Get the directory path and the prefix to match
        const dirPath = lastSlashIndex === -1 ? currentDirectory : 
                        lastSlashIndex === 0 ? '/' : pathToComplete.substring(0, lastSlashIndex);
        const prefix = pathToComplete.substring(lastSlashIndex + 1);
        
        const dir = getItemAtPath(dirPath);
        
        if (dir && dir.type === 'directory' && dir.children) {
          // Find matching items
          const matches = Object.keys(dir.children)
            .filter(name => name.startsWith(prefix));
          
          if (matches.length === 1) {
            // Complete the path
            const completed = matches[0];
            const isDir = dir.children[completed].type === 'directory';
            
            let completedPath;
            if (lastSlashIndex === -1) {
              completedPath = completed + (isDir ? '/' : '');
            } else {
              completedPath = pathToComplete.substring(0, lastSlashIndex + 1) + completed + (isDir ? '/' : '');
            }
            
            args[args.length - 1] = completedPath;
            setCommandInput(args.join(' '));
          } else if (matches.length > 1) {
            // Show options
            addOutput(matches.join('  '), 'output');
          }
        }
      }
    }
  };

  const addOutput = (content: ReactNode, type: 'output' | 'error' | 'command' | 'suggestions' = 'output'): void => {
    setTerminalOutput(prev => [...prev, { type, content }]);
  };

  const clearTerminal = (): void => {
    setTerminalOutput([]);
  };

  const executeCommand = (commandLine: string): void => {
    // Add command to output
    addOutput(
      <span>{currentPrompt} {commandLine}</span>,
      'command'
    );
    
    // Process command
    if (commandLine.trim() === '') {
      // Empty command, do nothing
    } else {
      const args = commandLine.trim().split(/\s+/);
      const command = args[0].toLowerCase();
      
      switch (command) {
        case 'clear':
          clearTerminal();
          break;
        case 'ls':
          listDirectory(args);
          break;
        case 'cd':
          changeDirectory(args[1]);
          break;
        case 'pwd':
          addOutput(currentDirectory);
          break;
        case 'cat':
          catFile(args[1]);
          break;
        case 'echo':
          echoText(args.slice(1));
          break;
        case 'mkdir':
          makeDirectory(args[1]);
          break;
        case 'touch':
          touchFile(args[1]);
          break;
        case 'rm':
          removeFile(args);
          break;
        case 'help':
          showHelp();
          break;
        case 'whoami':
          addOutput('owasp-cebu');
          break;
        case 'date':
          addOutput(new Date().toString());
          break;
        case 'exit':
        case 'logout':
          addOutput('To exit the terminal simulator, close the browser tab or window.');
          break;
        default:
          addOutput(`${command}: command not found`, 'error');
      }
    }
  };

  const listDirectory = (args: string[]): void => {
    let path = currentDirectory;
    let showHidden = false;
    let showDetails = false;
    
    // Process arguments
    for (let i = 1; i < args.length; i++) {
      if (args[i].startsWith('-')) {
        if (args[i].includes('a')) showHidden = true;
        if (args[i].includes('l')) showDetails = true;
      } else {
        path = resolvePath(args[i]);
      }
    }
    
    const dir = getItemAtPath(path);
    
    if (!dir || dir.type !== 'directory' || !dir.children) {
      addOutput(`ls: cannot access '${path}': No such file or directory`, 'error');
      return;
    }
    
    const contents = Object.values(dir.children);
    
    if (showDetails) {
      // Long listing format
      const detailOutput = contents
        .filter(item => showHidden || !item.name.startsWith('.'))
        .map(item => {
          const fileType = item.type;
          const permissions = fileType === 'directory' ? 'drwxr-xr-x' : '-rw-r--r--';
          const owner = 'owasp';
          const group = 'cebu';
          const size = fileType === 'file' && item.content 
            ? item.content.length 
            : 4096;
          const date = new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          let itemDisplay;
          if (fileType === 'directory') {
            itemDisplay = <span className="directory">{item.name}/</span>;
          } else {
            itemDisplay = <span>{item.name}</span>;
          }
          
          return (
            <div key={item.name}>
              {permissions} 1 {owner} {group} {size.toString().padStart(5)} {date} {itemDisplay}
            </div>
          );
        });
      
      addOutput(<>{detailOutput}</>);
    } else {
      // Simple listing
      const items = contents
        .filter(item => showHidden || !item.name.startsWith('.'))
        .map(item => {
          if (item.type === 'directory') {
            return <span key={item.name} className="directory">{item.name}/</span>;
          } else {
            return <span key={item.name}>{item.name}</span>;
          }
        });
      
      // Add spacing between file names
      const spacedItems = items.reduce((acc, item, index) => {
        if (index > 0) {
          acc.push(<span key={`space-${index}`}>&nbsp;&nbsp;</span>);
        }
        acc.push(item);
        return acc;
      }, [] as React.ReactNode[]);
      
      addOutput(<div className="ls-output">{spacedItems}</div>);
    }
  };

  const changeDirectory = (path?: string): void => {
    if (!path) {
      addOutput("cd: missing operand", "error");
      return;
    }

    const resolvedPath = resolvePath(path);
    const item = getItemAtPath(resolvedPath);

    if (!item) {
      addOutput(`cd: ${path}: No such file or directory`, "error");
      return;
    }

    if (item.type !== "directory") {
      addOutput(`cd: ${path}: Not a directory`, "error");
      return;
    }

    setCurrentDirectory(resolvedPath);
    
    // Trigger navigation in the parent component if onNavigate is provided
    if (onNavigate) {
      onNavigate(resolvedPath);
    }
  };

  const catFile = (path?: string): void => {
    if (!path) {
      addOutput('cat: missing file operand', 'error');
      return;
    }
    
    const filePath = resolvePath(path);
    const file = getItemAtPath(filePath);
    
    if (!file) {
      addOutput(`cat: ${path}: No such file or directory`, 'error');
      return;
    }
    
    if (file.type === 'directory') {
      addOutput(`cat: ${path}: Is a directory`, 'error');
      return;
    }
    
    if (file.content) {
      addOutput(<pre>{file.content}</pre>);
    } else {
      addOutput('');
    }
  };

  const echoText = (args: string[]): void => {
    addOutput(args.join(' '));
  };

  const makeDirectory = (path?: string): void => {
    if (!path) {
      addOutput('mkdir: missing operand', 'error');
      return;
    }
    
    // Get parent directory path and new directory name
    const fullPath = resolvePath(path);
    const lastSlashIndex = fullPath.lastIndexOf('/');
    const parentPath = lastSlashIndex === 0 ? '/' : fullPath.substring(0, lastSlashIndex);
    const dirName = fullPath.substring(lastSlashIndex + 1);
    
    const parent = getItemAtPath(parentPath);
    
    if (!parent || parent.type !== 'directory' || !parent.children) {
      addOutput(`mkdir: cannot create directory '${path}': No such file or directory`, 'error');
      return;
    }
    
    if (parent.children[dirName]) {
      addOutput(`mkdir: cannot create directory '${path}': File exists`, 'error');
      return;
    }
    
    // Create directory
    parent.children[dirName] = {
      name: dirName,
      type: 'directory',
      path: fullPath,
      children: {}
    };
    
    // Force a re-render
    setTerminalOutput(prev => [...prev]);
  };

  const touchFile = (path?: string): void => {
    if (!path) {
      addOutput('touch: missing file operand', 'error');
      return;
    }
    
    // Get parent directory path and file name
    const fullPath = resolvePath(path);
    const lastSlashIndex = fullPath.lastIndexOf('/');
    const parentPath = lastSlashIndex === 0 ? '/' : fullPath.substring(0, lastSlashIndex);
    const fileName = fullPath.substring(lastSlashIndex + 1);
    
    const parent = getItemAtPath(parentPath);
    
    if (!parent || parent.type !== 'directory' || !parent.children) {
      addOutput(`touch: cannot touch '${path}': No such file or directory`, 'error');
      return;
    }
    
    // Create or update file
    if (!parent.children[fileName]) {
      parent.children[fileName] = {
        name: fileName,
        type: 'file',
        path: fullPath,
        content: ''
      };
      
      // Force a re-render
      setTerminalOutput(prev => [...prev]);
    }
  };

  const removeFile = (args: string[]): void => {
    if (args.length < 2) {
      addOutput('rm: missing operand', 'error');
      return;
    }
    
    let recursive = false;
    let force = false;
    const files: string[] = [];
    
    // Process arguments
    for (let i = 1; i < args.length; i++) {
      if (args[i].startsWith('-')) {
        if (args[i].includes('r')) recursive = true;
        if (args[i].includes('f')) force = true;
      } else {
        files.push(args[i]);
      }
    }
    
    for (const path of files) {
      const fullPath = resolvePath(path);
      const lastSlashIndex = fullPath.lastIndexOf('/');
      const parentPath = lastSlashIndex === 0 ? '/' : fullPath.substring(0, lastSlashIndex);
      const itemName = fullPath.substring(lastSlashIndex + 1);
      
      const parent = getItemAtPath(parentPath);
      
      if (!parent || parent.type !== 'directory' || !parent.children) {
        if (!force) addOutput(`rm: cannot remove '${path}': No such file or directory`, 'error');
        continue;
      }
      
      if (!parent.children[itemName]) {
        if (!force) addOutput(`rm: cannot remove '${path}': No such file or directory`, 'error');
        continue;
      }
      
      const target = parent.children[itemName];
      
      if (target.type === 'directory' && !recursive) {
        addOutput(`rm: cannot remove '${path}': Is a directory`, 'error');
        continue;
      }
      
      // Remove the file or directory
      delete parent.children[itemName];
      
      // Force a re-render
      setTerminalOutput(prev => [...prev]);
    }
  };

  const showHelp = (): void => {
    const helpText = `
Available commands:
  ls       - List directory contents
  cd       - Change directory
  pwd      - Print working directory
  cat      - Display file contents
  echo     - Display a line of text
  mkdir    - Create a new directory
  touch    - Create an empty file
  rm       - Remove files or directories
  clear    - Clear the terminal screen
  whoami   - Display current user
  date     - Display current date and time
  help     - Display this help message
  exit     - Exit the terminal (simulation only)

Use arrow keys to navigate command history.
Press Tab for command and path autocompletion.
`;
    addOutput(<pre>{helpText}</pre>);
  };

  return (
    <div className="terminal-container">
      <div className="terminal" ref={terminalRef}>
        {terminalOutput.map((output, index) => (
          <div key={index} className={output.type}>
            {output.content}
          </div>
        ))}
        <div className="input-line">
          <span className="prompt">{currentPrompt}</span>
          <span className="command-text">{commandInput}</span>
          <span className="cursor"></span>
        </div>
        {suggestions.show && (
          <div className="suggestions-container">
            {suggestions.items.map((item, index) => (
              <div 
                key={item.command} 
                className={`suggestion-item ${index === selectedSuggestion ? 'selected' : ''}`}
                onClick={() => {
                  setCommandInput(item.command + ' ');
                  setSuggestions({ show: false, items: [] });
                  inputRef.current?.focus();
                }}
              >
                <span className="suggestion-command">{item.command}</span>
                <span className="suggestion-description">{item.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <textarea
        ref={inputRef}
        className="hidden-input"
        value={commandInput}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <style jsx>{`
        .terminal-container {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        
        .terminal {
          background-color: #000;
          color: #00ff00;
          font-family: 'Courier New', monospace;
          padding: 10px;
          flex-grow: 1;
          overflow-y: auto;
          white-space: pre-wrap;
          word-wrap: break-word;
          position: relative;
        }
        
        .input-line {
          display: flex;
          align-items: center;
        }
        
        .prompt {
          color: #00ff00;
          margin-right: 8px;
        }
        
        .command-text {
          color: #00ff00;
        }
        
        .cursor {
          width: 8px;
          height: 16px;
          background-color: #00ff00;
          display: inline-block;
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .output {
          color: #ffffff;
          margin-top: 5px;
          margin-bottom: 10px;
        }
        
        .error {
          color: #ff0000;
        }
        
        .hidden-input {
          position: absolute;
          left: -9999px;
        }
        
        .directory {
          color: #1e90ff;
        }
        
        .executable {
          color: #32cd32;
        }
        
        .logo {
          color: #00ccff;
          margin-bottom: 10px;
          line-height: 1.2;
        }
        
        .ls-output {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .suggestions-container {
          position: absolute;
          background-color: #1e1e1e;
          border: 1px solid #444;
          border-radius: 4px;
          max-height: 200px;
          overflow-y: auto;
          width: auto;
          min-width: 300px;
          z-index: 100;
          margin-top: 5px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }
        
        .suggestion-item {
          padding: 8px 12px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
        }
        
        .suggestion-item:hover, .suggestion-item.selected {
          background-color: #333;
        }
        
        .suggestion-command {
          color: #4fc3f7;
          font-weight: bold;
          margin-right: 10px;
        }
        
        .suggestion-description {
          color: #aaa;
        }
      `}</style>
    </div>
  );
};

export default LinuxTerminal;