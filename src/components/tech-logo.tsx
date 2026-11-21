"use client";

import { useEffect, useState } from "react";

/**
 * Library-hosted SVGs only. No local /stack/*.svg, inline custom art, or data URLs.
 * Icons use Simple Icons / Devicon and retain the existing monochrome CSS filters.
 */
const simpleIcons: Record<string, string> = {
  JavaScript: "javascript",
  TypeScript: "typescript",
  Python: "python",
  PHP: "php",
  "C++": "cplusplus",
  Dart: "dart",
  HTML: "html5",
  React: "react",
  "Next.js": "nextdotjs",
  "Tailwind CSS": "tailwindcss",
  Bootstrap: "bootstrap",
  "Node.js": "nodedotjs",
  "Express.js": "express",
  Flutter: "flutter",
  MySQL: "mysql",
  WordPress: "wordpress",
  Git: "git",
  GitHub: "github",
  Vercel: "vercel",
  Netlify: "netlify",
  "Google Gemini": "googlegemini",
  Claude: "claude",
};

const simple = (slug: string, major = 16) =>
  `https://cdn.jsdelivr.net/npm/simple-icons@v${major}/icons/${slug}.svg`;
const devicon = (slug: string, variant = "plain") =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@master/icons/${slug}/${slug}-${variant}.svg`;

/** Ordered fallbacks are only external library files. */
function iconSources(name: string): string[] {
  switch (name) {
    // CSS Next is not guaranteed to be published in the icon libraries yet.
    // Use maintained library CSS marks, never a local placeholder or dead URL.
    case "CSS": return [devicon("css3"), simple("css3", 15)];
    case "Canva": return [devicon("canva"), devicon("canva", "original")];
    case "ChatGPT": return [simple("openai", 15), devicon("openai")];
    case "Java": return [devicon("java")];
    case "C#": return [devicon("csharp")];
    case "VS Code": return [devicon("vscode")];
    case "Grok": return [
      "https://cdn.jsdelivr.net/gh/selfhst/icons@main/svg/grok.svg",
    ];
    default: {
      const slug = simpleIcons[name];
      return slug ? [simple(slug)] : [];
    }
  }
}

function LibraryIcon({ name, onExhausted }: { name: string; onExhausted?: () => void }) {
  const [sourceIndex, setSourceIndex] = useState(0);
  useEffect(() => setSourceIndex(0), [name]);
  const sources = iconSources(name);
  const src = sources[sourceIndex];

  useEffect(() => {
    if (!src && sources.length > 0) onExhausted?.();
  }, [src, sources.length, onExhausted]);

  if (!src) return null;
  return (
    <img
      key={`${name}-${sourceIndex}`}
      className="tech-logo tech-stack-svg"
      src={src}
      alt=""
      width={24}
      height={24}
      loading="lazy"
      onError={() => setSourceIndex((index) => index + 1)}
    />
  );
}

export function TechLogo({ name }: { name: string }) {
  const sources = iconSources(name);
  if (sources.length === 0) {
    return <span className="tech-logo-fallback" aria-hidden="true">{name.slice(0, 2).toUpperCase()}</span>;
  }
  return <LibraryIcon name={name} />;
}

export function TechItem({ name }: { name: string }) {
  const sources = iconSources(name);
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [name]);
  const src = sources[index];

  if (!src) {
    return <span className="tech-item tech-item--text-only"><span className="tech-item__label">{name}</span></span>;
  }

  return (
    <span className="tech-item">
      <span className="tech-icon-wrap">
        <img
          key={`${name}-${index}`}
          className="tech-logo tech-stack-svg"
          src={src}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          onError={() => setIndex((value) => value + 1)}
        />
      </span>
      <span className="tech-item__label">{name}</span>
    </span>
  );
}
