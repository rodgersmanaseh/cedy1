import ReactMarkdown from "react-markdown";
import { createElement } from "react";

export interface MarkdownRenderOptions {
  components?: Record<string, React.ComponentType<any>>;
  className?: string;
}

// Custom components for rendering markdown with better styling
export const markdownComponents = {
  h1: ({ children, ...props }: any) =>
    createElement("h1", {
      className: "text-3xl font-bold mb-6 text-foreground",
      ...props
    }, children),
  
  h2: ({ children, ...props }: any) =>
    createElement("h2", {
      className: "text-2xl font-semibold mb-4 mt-8 text-foreground",
      ...props
    }, children),
  
  h3: ({ children, ...props }: any) =>
    createElement("h3", {
      className: "text-xl font-medium mb-3 mt-6 text-foreground",
      ...props
    }, children),
  
  p: ({ children, ...props }: any) =>
    createElement("p", {
      className: "mb-4 leading-relaxed text-muted-foreground",
      ...props
    }, children),
  
  ul: ({ children, ...props }: any) =>
    createElement("ul", {
      className: "mb-4 pl-6 list-disc",
      ...props
    }, children),
  
  ol: ({ children, ...props }: any) =>
    createElement("ol", {
      className: "mb-4 pl-6 list-decimal",
      ...props
    }, children),
  
  li: ({ children, ...props }: any) =>
    createElement("li", {
      className: "mb-2",
      ...props
    }, children),
  
  blockquote: ({ children, ...props }: any) =>
    createElement("blockquote", {
      className: "border-l-4 border-primary pl-4 italic text-muted-foreground my-4",
      ...props
    }, children),
  
  code: ({ children, className, ...props }: any) => {
    const isInline = !className;
    return createElement(isInline ? "code" : "pre", {
      className: isInline 
        ? "bg-muted px-1 py-0.5 rounded text-sm font-mono"
        : "bg-muted p-4 rounded-lg overflow-x-auto",
      ...props
    }, isInline ? children : createElement("code", { className }, children));
  },
  
  a: ({ children, ...props }: any) =>
    createElement("a", {
      className: "text-primary hover:text-primary/80 underline",
      target: "_blank",
      rel: "noopener noreferrer",
      ...props
    }, children),
  
  img: ({ alt, src, ...props }: any) =>
    createElement("img", {
      className: "max-w-full h-auto rounded-lg my-4",
      alt,
      src,
      loading: "lazy",
      ...props
    }),
  
  hr: ({ ...props }: any) =>
    createElement("hr", {
      className: "my-8 border-border",
      ...props
    }),
  
  table: ({ children, ...props }: any) =>
    createElement("div", {
      className: "overflow-x-auto my-4"
    }, createElement("table", {
      className: "min-w-full border-collapse border border-border",
      ...props
    }, children)),
  
  th: ({ children, ...props }: any) =>
    createElement("th", {
      className: "border border-border px-4 py-2 bg-muted font-semibold text-left",
      ...props
    }, children),
  
  td: ({ children, ...props }: any) =>
    createElement("td", {
      className: "border border-border px-4 py-2",
      ...props
    }, children),
};

// Function to estimate reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).filter(word => word.length > 0);
  return Math.max(1, Math.ceil(words.length / wordsPerMinute));
}

// Function to extract excerpt from markdown content
export function extractExcerpt(content: string, maxLength: number = 160): string {
  // Remove markdown syntax and get plain text
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/`(.*?)`/g, '$1') // Remove inline code
    .replace(/>\s+/g, '') // Remove blockquotes
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  // Find the last complete sentence within the limit
  const truncated = plainText.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSentence > maxLength * 0.8) {
    return plainText.substring(0, lastSentence + 1);
  } else if (lastSpace > maxLength * 0.8) {
    return plainText.substring(0, lastSpace) + '...';
  }

  return truncated + '...';
}

// Function to generate a URL-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

// Function to parse frontmatter from markdown
export function parseFrontmatter(content: string): { frontmatter: Record<string, any>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content };
  }

  const [, frontmatterString, markdownContent] = match;
  
  try {
    // Simple YAML-like parsing for frontmatter
    const frontmatter: Record<string, any> = {};
    const lines = frontmatterString.split('\n');
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex === -1) continue;
      
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes if present
      const cleanValue = value.replace(/^["']|["']$/g, '');
      
      // Try to parse as JSON for arrays/objects, otherwise keep as string
      try {
        frontmatter[key] = JSON.parse(cleanValue);
      } catch {
        frontmatter[key] = cleanValue;
      }
    }
    
    return { frontmatter, content: markdownContent };
  } catch (error) {
    console.error('Error parsing frontmatter:', error);
    return { frontmatter: {}, content };
  }
}

// Markdown renderer component
export function MarkdownRenderer({ 
  content, 
  components = {}, 
  className = "article-content" 
}: {
  content: string;
  components?: Record<string, React.ComponentType<any>>;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown 
        components={{ ...markdownComponents, ...components }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
