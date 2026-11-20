# my-portfolio: editable multipage Next.js portfolio

Includes: Overview, Projects, individual Project detail pages, Achievements, Skills, Education, Activity and Contact. Existing GitHub Contributions implementation from your **working** ZIP is retained.

## Start

```sh
npm install
npm run dev
```

## Edit content

- `src/data/portfolio.ts`: your real name, description, education, skills, projects, certifications, competitions and GitHub username.
- `src/data/media.ts`: profile avatar, cover and example image paths.
- `src/data/resume.ts`: PDF filename, download label and download visibility.
- `src/data/site-content.ts`: optional headlines, learning interests, social links, announcements and featured project IDs.

## Add your own resume

Replace `public/Daniel_Dave_Umali_Resume.pdf` with your PDF; or update the path in `src/data/resume.ts`.

The View Resume button in Overview opens a preview modal with Open Full PDF and Download Resume options. Browser-native PDF preview support varies; the other options work as fallbacks.

## Add profile and cover images

1. Put files in `public/images/`, e.g. `my-photo.jpg`, `my-cover.jpg`.
2. Change `avatar` and `cover` in `src/data/media.ts` to `/images/my-photo.jpg` and `/images/my-cover.jpg`.
3. The included avatar is a **generated illustration**, not your real likeness. Other included graphics are generated examples.

## Add project screenshots

1. Put screenshots in `public/projects/`.
2. In `src/data/portfolio.ts`, edit a project entry:

```ts
coverImage: "/projects/my-dashboard.jpg",
gallery: ["/projects/my-dashboard.jpg", "/projects/my-settings.jpg"],
imagesAreExamples: false,
githubUrl: "https://github.com/USERNAME/REPO", // if public or shareable
liveUrl: "https://example.com", // optional
```

3. Each route `/projects/[slug]` automatically shows a click-to-enlarge gallery modal. Add more project entries with unique slugs and meaningful descriptions. Do not present the sample screenshots as actual work.

## GitHub widget

The files `src/components/github-contributions.tsx` and `.css` are from the GitHub Contributions ZIP you confirmed as working. **No token migration** was introduced. Overview and Activity still use the same component. If a separate source project had additional CSS changes, merge them with this project before replacing your modified files.

## Safety

Do not commit `.env.local`, access tokens or private files. Validate project and certificate links before publishing.

## Game page: Rocket Run

Visit `/game` or select **Game** from the Overview or inner-page sidebar. The game is an original, 8-bit-inspired rocket flyer featuring a tiny pixel-art person in a rocket.

- Space, Up Arrow, W, touch or click to boost. P to pause. The on-screen buttons also work.
- Navigate between obstacles, earn points, and save your best score locally in the browser.
- Optional 8-bit sound starts muted and can be toggled.
- Adjust the game title and page copy in `src/data/game.ts`.
- The character is a stylized stand-in, not a likeness from a personal photo.

No additional npm dependencies are required.
