/** Profile information from the supplied resume. Edit this file to update the site. */
export const portfolio = {
  name: "Daniel Dave M. Umali",
  initials: "DU",
  role: "Software Engineering Student | Full-Stack Developer",
  location: "Sariaya, Quezon, Philippines",
  availability: "Seeking an on-the-job training (OJT) opportunity",
  email: "danieldaveumali102804@gmail.com",
  phone: "+63 995 985 1142",
  github: "https://github.com/DanielDave2004",
  linkedin: "https://www.linkedin.com/in/danieldaveumali/",
  intro: "Fourth-year BS Computer Science student interested in full-stack development, software engineering, and practical IT solutions.",
  summary: "Motivated 4th-year BS Computer Science student with a strong foundation in programming, database management, and technical troubleshooting. Experienced in developing academic software projects, analyzing data, and collaborating in team environments to solve complex problems. Quick to learn new technologies and workflows, seeking an On-the-Job Training opportunity to contribute to real-world IT operations and gain hands-on industry experience.",
  education: {
    degree: "Bachelor of Science in Computer Science",
    school: "Manuel S. Enverga University Foundation – Candelaria, Inc.",
    period: "2023 – Present",
    description: "Candelaria, Quezon, Philippines",
  },
  skills: [
    { category: "Programming Languages", items: ["JavaScript", "TypeScript", "Python", "Java", "PHP", "C#", "C++", "Dart"] },
    { category: "Frontend Development", items: ["HTML", "CSS", "React", "Next.js", "Tailwind CSS", "Bootstrap"] },
    { category: "Backend & Frameworks", items: ["Node.js", "Express.js"] },
    { category: "Mobile Development", items: ["Flutter"] },
    { category: "Databases", items: ["MySQL"] },
    { category: "CMS & Web Platforms", items: ["WordPress"] },
    { category: "Developer Tools & Version Control", items: ["VS Code", "Git", "GitHub", "Vercel", "Netlify"] },
    { category: "Testing & QA", items: ["Manual Testing", "Debugging"] },
    { category: "Documentation", items: ["Thesis / System Documentation"] },
    { category: "UI/UX & Design", items: ["Canva"] },
    { category: "AI & Productivity Tools", items: ["Prompt Engineering", "ChatGPT", "Google Gemini", "Claude", "Grok"] },
  ],
  projects: [
    {
      slug: "thesis-and-system-documentation",
      coverImage: "/projects/project-demo-1.jpg", // Replace with your real screenshot
      gallery: ["/projects/project-demo-1.jpg", "/projects/project-demo-2.jpg"], // Add as many images as you need
      imagesAreExamples: true,
      githubUrl: "", // Optional, add repository URL
      liveUrl: "", // Optional, add deployed site URL
      documentationUrl: "", // Optional, add thesis PDF or documentation URL
      challenges: [] as string[], // Problems you solved
      results: [] as string[], // Real outcomes only

      status: "Academic work",
      role: "Research and documentation",
      duration: "Add project dates",
      highlights: ["Research and requirements gathering", "System planning and documentation", "Testing and evaluation documentation"],
      number: "01",
      category: "CAPSTONE / RESEARCH",
      title: "Thesis & System Documentation (Example)",
      description:
        "A structured academic project covering requirements, research, system planning, technical documentation, and evaluation. Replace this with your actual thesis title and contribution.",
      stack: ["Research", "System Analysis", "Documentation"],
      type: "thesis",
      link: "#contact",
      linkText: "Discuss the project",
    },
    {
      slug: "personal-portfolio",
      coverImage: "/projects/project-demo-2.jpg", // Replace with your real screenshot
      gallery: ["/projects/project-demo-1.jpg", "/projects/project-demo-2.jpg"], // Add as many images as you need
      imagesAreExamples: true,
      githubUrl: "", // Optional, add repository URL
      liveUrl: "", // Optional, add deployed site URL
      documentationUrl: "", // Optional, add thesis PDF or documentation URL
      challenges: [] as string[], // Problems you solved
      results: [] as string[], // Real outcomes only

      status: "In development",
      role: "Frontend development",
      duration: "Add project dates",
      highlights: ["Responsive profile and content layout", "Next.js App Router and TypeScript", "Accessible navigation and reusable components"],
      number: "02",
      category: "WEB DEVELOPMENT",
      title: "Personal Portfolio Website (Example)",
      description:
        "A responsive portfolio built with Next.js and TypeScript to present technical skills, education, and selected work with clear navigation.",
      stack: ["Next.js", "TypeScript", "CSS"],
      type: "portfolio",
      link: "#contact",
      linkText: "Discuss the project",
    },
    {
      slug: "your-next-project",
      coverImage: "/projects/project-demo-1.jpg", // Replace with your real screenshot
      gallery: ["/projects/project-demo-1.jpg", "/projects/project-demo-2.jpg"], // Add as many images as you need
      imagesAreExamples: true,
      githubUrl: "", // Optional, add repository URL
      liveUrl: "", // Optional, add deployed site URL
      documentationUrl: "", // Optional, add thesis PDF or documentation URL
      challenges: [] as string[], // Problems you solved
      results: [] as string[], // Real outcomes only

      status: "Placeholder",
      role: "Add your role",
      duration: "Add project dates",
      highlights: ["Describe the problem", "Explain your contribution", "Show the outcome"],
      number: "03",
      category: "ACADEMIC PROJECT / PLACEHOLDER",
      title: "Your Next Project",
      description:
        "Reserve this space for a real coursework project, prototype, or application. Add the problem, your approach, key features, and the tools you used.",
      stack: ["Your tools", "Your role"],
      type: "system",
      link: "#contact",
      linkText: "Discuss the project",
    },
  ],
};

/** Actual credentials / participation from supplied resume; credential links can be added later. */
export const certifications = [
  {
    id: "fcc-responsive-web-design",
    title: "Responsive Web Design",
    issuer: "freeCodeCamp",
    date: "October 2026",
    category: "Web Development",
    credentialId: "",
    credentialUrl: "",
    description: "Responsive Web Design certification.",
    example: false,
    image: "/certificates/sample-responsive-web-design.jpg", // Replace with your actual certificate image
    imageIsSample: true,
  },
];

export const competitions = [
  {
    id: "isite-quiz-bee-2026",
    title: "ISITE National IT Skills Competition – IT Quiz Bee",
    organizer: "ISITE National IT Skills Competition",
    date: "April 2026",
    result: "Certificate of Participation",
    category: "IT Quiz Bee",
    description: "Participated in the IT Quiz Bee as part of the ISITE National IT Skills Competition.",
    link: "",
    example: false,
    image: "/certificates/sample-isite-quiz-bee.jpg", // Replace with your actual participation certificate
    imageIsSample: true,
  },
];

/** Optional activity feed. Empty until real milestones are added. */
export const activities: { id: string; date: string; type: string; title: string; description: string; example: boolean }[] = [];

/** Username used for the public GitHub contribution calendar. */
export const githubUsername = "DanielDave2004";
