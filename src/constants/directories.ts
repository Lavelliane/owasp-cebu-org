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
            content: "Our team consists of security professionals, developers, and enthusiasts dedicated to improving cybersecurity in Cebu."
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
            content: "Monthly meetups on the last Saturday of each month. Special workshops announced quarterly."
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
            content: "Email: cebu@owasp.org\nTwitter: @OWASPCebu\nMeetup: meetup.com/owasp-cebu"
          }
        }
      }
    }
  }
};

export type FileStructure = {
  name: string;
  type: "file" | "directory";
  path: string;
  content?: string;
  children?: Record<string, FileStructure>;
};

