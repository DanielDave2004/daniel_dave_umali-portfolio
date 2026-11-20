"use client";

import { useState } from "react";

// Genuine vector marks from Devicon or Simple Icons. Browser internet access is needed to load them.
const devicon: Record<string, string> = {
  "JavaScript": "javascript/javascript-original", "TypeScript": "typescript/typescript-original",
  "Python": "python/python-original", "Java": "java/java-original", "PHP": "php/php-original",
  "C#": "csharp/csharp-original", "C++": "cplusplus/cplusplus-original", "Dart": "dart/dart-original",
  "HTML": "html5/html5-original", "CSS": "css3/css3-original", "React": "react/react-original",
  "Next.js": "nextjs/nextjs-original", "Tailwind CSS": "tailwindcss/tailwindcss-original",
  "Bootstrap": "bootstrap/bootstrap-original", "Node.js": "nodejs/nodejs-original",
  "Express.js": "express/express-original", "Flutter": "flutter/flutter-original",
  "MySQL": "mysql/mysql-original", "WordPress": "wordpress/wordpress-original",
  "VS Code": "vscode/vscode-original", "Git": "git/git-original", "GitHub": "github/github-original",
  "Vercel": "vercel/vercel-original", "Netlify": "netlify/netlify-original",
  "Canva": "canva/canva-original",
};
const simpleIcons: Record<string, string> = {
  "ChatGPT": "openai", "Google Gemini": "googlegemini", "Claude": "claude", "Grok": "xai",
};
function logoUrl(name: string) {
  if (devicon[name]) return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${devicon[name]}.svg`;
  if (simpleIcons[name]) return `https://cdn.jsdelivr.net/npm/simple-icons@v15/icons/${simpleIcons[name]}.svg`;
  return null;
}
export function TechLogo({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const src = logoUrl(name);
  if (!src || failed) return <span className="tech-logo-fallback" aria-hidden="true">{name.slice(0, 2).toUpperCase()}</span>;
  return <img className="tech-logo" src={src} alt="" width={24} height={24} loading="lazy" onError={() => setFailed(true)} />;
}
export function TechItem({ name }: { name: string }) {
  return <span className="tech-item"><span className="tech-icon-wrap"><TechLogo name={name}/></span><span>{name}</span></span>;
}
