# Contributing to BetterIliganCity.org 🌊

First off, thank you for considering contributing to BetterIliganCity.org! It's people like you that make this community-run portal a reality. 

Whether you're a seasoned developer or a resident who just spotted a broken link, there's a place for you here. Below are the guidelines to help you get started.

---

## 💻 For Programmers (Code Contributions)

If you want to get your hands dirty with the codebase, here is our standard workflow:

### 1. Fork the Repository
Start by forking the project repository to your own GitHub account and cloning it to your local machine. 

### 2. Find an Issue or Build a Feature
Check out our [Issues tab](https://github.com/KishonShrill/BetterIligan/issues) to see if there's any task that interests you or needs fixing. Alternatively, if you have a specific code change or improvement you want to make, feel free to start working on it!

### 3. Make a Pull Request (PR)
Once your changes are ready, push them to your fork and submit a Pull Request. 

### 4. Reuse UI Components & Follow Architecture
As part of **Phase 1 (Foundation & Layout Shell)**, we established the project's layout structure and a reusable UI Component Library. Before building custom UI elements or using raw HTML, check if there is an existing component in `components/ui/` or `components/layout/`.

#### Core Tech Stack
* **Framework:** Next.js 16 (App Router)
* **Styling:** Tailwind CSS v4
* **Package Manager:** `npm`
* **Design System / Typography:** `@bettergov/kapwa` (custom `kapwaSans` and `kapwaMono` fonts)

#### Available Reusable Components
* **Layout:**
  * `TopBanner` ([TopBanner.tsx](components/layout/TopBanner.tsx)): Displays emergency numbers, live weather (via Open-Meteo), and Forex data.
  * `Footer` ([Footer.tsx](components/layout/Footer.tsx)): Branding, site links, and social links.
* **UI Elements:**
  * `Card` / `CardHeader` / `CardContent` / `CardFooter` ([Card.tsx](components/ui/Card.tsx)): Standard content card with optional `hoverable` translation.
  * `Heading` ([Heading.tsx](components/ui/Heading.tsx)): Pre-styled typography for levels `h1` through `h6`.
  * `Text` ([Text.tsx](components/ui/Text.tsx)): Pre-styled text segments supporting sizing and text transformations.
  * `Section` ([Section.tsx](components/ui/Section.tsx)): Standard container wrappers.
  * `Breadcrumbs` ([Breadcrumbs.tsx](components/ui/Breadcrumbs.tsx)): Multi-level breadcrumbs navigation with automatic pathname generation.
  * `ListItem` ([ListItem.tsx](components/ui/ListItem.tsx)): Reusable display card for lists and categories.
  * `ScrollToTop` ([ScrollToTop.tsx](components/ui/ScrollToTop.tsx)): Floating button to scroll back to the top of the page.

**Crucial:** To keep our project history clean and readable, please format your PR title exactly like this: `[<prefix>: title]`. 

Choose the appropriate prefix from this list:
* `feat` - A new feature for the user or app.
* `fix` - A bug fix for the user or app.
* `docs` - Documentation-only changes (e.g., updating a README).
* `style` - Changes that do not affect the meaning of the code (white-space, formatting, etc.).
* `ref` - A code change that neither fixes a bug nor adds a feature (e.g., renaming variables, simplifying logic).
* `perf` - A code change that improves performance.
* `test` - Adding missing tests or correcting existing tests.
* `build` - Changes that affect the build system or external dependencies (e.g., npm, webpack, vite).
* `ci` - Changes to CI/CD configuration files and scripts (e.g., GitHub Actions, Travis, GitLab CI).
* `chore` - General maintenance tasks, updating build tasks, or changes that don't modify the source code or test files.
* `revert` - Used to revert a previous commit.

*Example PR Title:* `[feat: add dark mode toggle to the navigation bar]`

---

## 📢 For Non-Programmers (Reporting Bugs & Suggesting Ideas)

You do not need to know how to code to make a massive impact on this project! If you want to report a broken page, suggest a new feature, or request that something be added to the website, you can do so by creating an **Issue**.

Head over to our [Issues tab](https://github.com/KishonShrill/BetterIligan/issues) and click **New Issue**. 

### Issue Title Format
Please format your issue title strictly like this: `[<prefix>(where it is located on the url): title]`

Valid prefixes are:
* `Bug:` - For something that is broken or not working as intended.
* `Idea:` - For a new feature, content suggestion, or improvement.

*Example Issue Titles:* 
* `[Bug(/services): business permit link leads to 404 page]`
* `[Idea(/travel): add a dedicated section for local coffee shops]`

### Issue Body Format
In the description of your issue, please clearly provide:
1.  **What the problem is** (or what your idea is).
2.  **Why it is needed** (why it should be fixed or added to help the community).
3.  **[Optional] Steps to replicate the bug** (if you are reporting a Bug, tell us exactly how to make it happen on our end so we can fix it faster).

---

Thank you for helping us build a better digital space for Iligan!
