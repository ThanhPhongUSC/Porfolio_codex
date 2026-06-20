# Beginner's Guide to This Portfolio and Digital Twin

This guide explains the professional portfolio website in this folder and the AI-powered **Digital Twin** chat feature. It assumes you are new to frontend coding. By the end, you should understand what each major file does, why the chat is split into browser and server code, and how a question becomes an answer.

## 1. What You Built

This project is a single-page professional portfolio for Phong Trinh. It presents:

- A responsive hero section with a portrait and professional summary.
- Career highlights, an about section, a skills list, a timeline, portfolio placeholders, and contact links.
- A Digital Twin chat panel that answers questions about Phong's career.
- A server-side connection to OpenRouter using the free `openai/gpt-oss-120b:free` model.

The visual direction is intentionally dark, structured, and technical: an enterprise-style layout with sharper edges, restrained color accents, and a console-like AI panel.

## 2. Technology Summary

| Technology | What it is | How this project uses it |
| --- | --- | --- |
| Next.js | A React framework for building production websites | Provides the site pages, image optimization, API route, builds, and local server. |
| React | A library for building interfaces from components | Renders the portfolio and makes the chat update without refreshing the page. |
| TypeScript | JavaScript with optional type checking | Defines the shape of chat messages and catches mistakes during the build. |
| CSS | The language that styles web pages | Controls the layout, colors, responsive behavior, and chat console design. |
| OpenRouter | A service that provides one API for multiple AI models | Receives the chat request and runs `openai/gpt-oss-120b:free`. |
| Environment variables | Private configuration values stored outside source code | Keeps `OPENROUTER_API_KEY` on the server, out of the browser bundle. |

### The important project files

```text
app/
  api/chat/route.ts              Server endpoint that contacts OpenRouter
  components/digital-twin.tsx    Interactive browser-side chat component
  globals.css                    All global and component styling
  layout.tsx                     HTML shell, metadata, and global CSS import
  page.tsx                       Main portfolio page
public/
  phong-trinh.jpeg               Portrait used by the website
.env                             Private OpenRouter key (never commit this)
.gitignore                       Prevents .env and generated files from being committed
package.json                     Dependencies and useful commands
```

## 3. How to Run the Project Locally

Open a terminal in this project folder and use these commands:

```bash
npm install
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) in a browser. Stop the local server with `Ctrl+C` in the same terminal.

Before deploying or sharing the site, make a production build:

```bash
npm run build
npm run start
```

`npm run build` checks TypeScript and prepares optimized production files. `npm run start` serves that finished build.

## 4. High-Level Architecture

The app is deliberately split into three layers:

```text
Visitor's browser
  |
  | types a question
  v
DigitalTwin React component
  |
  | POST /api/chat with conversation messages
  v
Next.js API route (server only)
  |
  | adds career context + private API key
  v
OpenRouter + openai/gpt-oss-120b:free
  |
  | returns an answer
  v
API route -> DigitalTwin component -> visitor sees the answer
```

This separation is one of the most important ideas in the project.

- The **browser** handles visual interaction: text input, buttons, loading state, and showing messages.
- The **server** handles secrets and external API calls.
- OpenRouter is called by the server, never directly by browser code.

If the browser called OpenRouter itself, anyone could inspect the page's network requests and steal the key. The API route prevents that.

## 5. Walkthrough: The Portfolio Page

The main page is [`app/page.tsx`](app/page.tsx). A Next.js App Router page is a React component. The component at the bottom of this file returns JSX, which looks similar to HTML but can include JavaScript expressions.

### Content as data

Near the top of the file, repeated content is stored in arrays:

```tsx
const highlights = [
  { value: "650K+", label: "users supported through Auth0 flows" },
  { value: "7", label: "tenant organizations secured" }
];
```

This is better than manually writing every card because the page can loop over the data:

```tsx
{highlights.map((item) => (
  <div className="metric" key={item.label}>
    <strong>{item.value}</strong>
    <span>{item.label}</span>
  </div>
))}
```

Read this as: “for each `item` in `highlights`, create one metric box.” The `key` gives React a stable label so it can update lists efficiently.

The same pattern creates the career timeline, strengths cards, skills, and future portfolio cards. For a beginner, this is a lovely habit to develop: keep repeated page content in data, then render it with `.map()`.

### Sections and navigation

Each main part of the page is a semantic `<section>`, such as:

```tsx
<section id="twin" className="section twin-section">
  <div className="twin-intro">
    <p className="section-label">Digital Twin</p>
    <h2>Ask about the work behind the resume.</h2>
  </div>
  <DigitalTwin />
</section>
```

`id="twin"` gives this section an address within the page. The navigation link `href="#twin"` scrolls to it. `className` connects the HTML element to CSS rules in `app/globals.css`.

`<DigitalTwin />` is a custom React component. Importing it at the top and rendering it like an HTML tag lets the static portfolio page include a focused piece of interactive functionality without making the entire page interactive JavaScript.

### Optimized portrait

The portrait uses Next.js's `Image` component:

```tsx
<Image
  src="/phong-trinh.jpeg"
  alt="Phong Trinh"
  width={1280}
  height={911}
  priority
/>
```

The file is stored in `public/`, so it is available at `/phong-trinh.jpeg`. `width` and `height` tell the browser the image's shape before it loads, which prevents the layout from jumping. `alt` provides meaningful text for screen readers. `priority` tells Next.js this is an important above-the-fold image.

## 6. Walkthrough: The Styling System

All styling lives in [`app/globals.css`](app/globals.css). This is plain CSS, so it works through selectors and class names.

### Design tokens

At the top of the stylesheet, CSS custom properties define the shared visual language:

```css
:root {
  --bg: #080a0d;
  --ink: #f6f2e8;
  --muted: #a8b2bd;
  --cyan: #63d8f5;
  --green: #b7f86d;
  --orange: #d98b62;
  --max: 1180px;
}
```

Variables begin with `--` and are read with `var(...)`, for example `color: var(--muted)`. This means the design can be adjusted in one place. If you decide the accent color should change later, edit `--cyan` rather than searching through every rule.

### Layout with CSS Grid

The hero uses a two-column grid on larger screens:

```css
.hero {
  display: grid;
  grid-template-columns: minmax(0, 0.98fr) minmax(340px, 1.02fr);
  gap: 58px;
  align-items: center;
}
```

`fr` means a fraction of available space. The left and right columns are almost equal, while `minmax(340px, ...)` prevents the portrait column from becoming uncomfortably narrow.

At a smaller width, the layout changes to one column:

```css
@media (max-width: 920px) {
  .hero,
  .split,
  .twin-section,
  .contact-section {
    grid-template-columns: 1fr;
  }
}
```

This is called a **media query**. It is the core of responsive design: the same HTML adapts rather than requiring a separate mobile page.

### The Digital Twin console

The chat panel has its own CSS group beginning with `.twin-section` and `.twin-console`. The panel itself uses a real border and a subtle shadow instead of a large rounded card:

```css
.twin-console {
  border: 1px solid rgba(99, 216, 245, 0.28);
  background: rgba(9, 14, 18, 0.83);
  box-shadow: 16px 16px 0 rgba(99, 216, 245, 0.07);
}
```

The conversation is vertically scrollable with `overflow-y: auto`, and its `min-height` and `max-height` keep it stable as messages appear. The input, buttons, loading state, error color, and screen-reader-only label are all styled in the same file.

## 7. Walkthrough: The Interactive Chat Component

The browser-side chat component is [`app/components/digital-twin.tsx`](app/components/digital-twin.tsx). Its first line is important:

```tsx
"use client";
```

Next.js renders components on the server by default. A component that needs browser features such as clicks, text input, `useState`, or `fetch` must opt in with `"use client"`. This keeps the rest of the portfolio lightweight while allowing this one area to be interactive.

### TypeScript message type

```tsx
type Message = {
  role: "user" | "assistant";
  content: string;
};
```

This type says every message must have a `role` that is exactly either `"user"` or `"assistant"`, plus text in `content`. Types do not change the website at runtime; they help catch mistakes while coding.

### React state

The component remembers four things:

```tsx
const [messages, setMessages] = useState<Message[]>([/* greeting */]);
const [input, setInput] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState("");
```

Think of state as a component's short-term memory.

- `messages` is the conversation shown in the panel.
- `input` is what the visitor is typing.
- `isLoading` prevents duplicate requests and shows “Thinking...” while OpenRouter responds.
- `error` holds a friendly error message when something fails.

When state changes with a setter such as `setInput(...)`, React renders the component again with the new values.

### Sending a question

This is the central client-side workflow:

```tsx
const nextMessages = [...messages, { role: "user" as const, content: question }];
setMessages(nextMessages);
setInput("");
setIsLoading(true);

const response = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ messages: nextMessages })
});

const data = await response.json();
setMessages((current) => [
  ...current,
  { role: "assistant", content: data.message }
]);
```

Line by line:

1. `[...messages, newMessage]` creates a new array containing the existing conversation and the new visitor question.
2. The visitor's question appears immediately, before the AI response arrives.
3. The input is cleared and controls are disabled by the loading state.
4. `fetch` sends JSON to the local Next.js endpoint, `/api/chat`.
5. When the response arrives, the assistant answer is appended to the conversation.

The component also has a `try`/`catch`/`finally` block. `try` holds work that may fail, `catch` shows an error, and `finally` always turns off the loading state.

### Accessibility details

The chat includes a few small but useful accessibility features:

- The chat log has `aria-live="polite"`, so screen readers announce new answers without being overly disruptive.
- The input has a real `<label>`, visually hidden by `.sr-only` rather than removed.
- Loading and invalid form states disable controls to avoid accidental duplicate requests.
- The error message uses `role="alert"` so assistive technology can announce it.

## 8. Walkthrough: The Server API Route

The AI integration happens in [`app/api/chat/route.ts`](app/api/chat/route.ts). In the Next.js App Router, that folder path creates this endpoint automatically:

```text
POST /api/chat
```

Unlike `digital-twin.tsx`, this file does **not** include `"use client"`. It runs on the server. This is why it can read `process.env.OPENROUTER_API_KEY` safely.

### Protecting the key

The `.env` file contains:

```dotenv
OPENROUTER_API_KEY=your-private-key-goes-here
```

It is listed in `.gitignore`, which means Git will not add it to commits. The key must never use the `NEXT_PUBLIC_` prefix, because Next.js exposes variables with that prefix to the browser.

The route checks for a missing key before doing anything else:

```tsx
if (!process.env.OPENROUTER_API_KEY) {
  return NextResponse.json(
    { error: "The Digital Twin is not configured yet." },
    { status: 500 }
  );
}
```

`NextResponse.json(...)` sends a JSON response. The status code `500` means a server configuration problem.

### Validating incoming messages

Never completely trust data sent from the browser, even when you wrote the browser code. The function `isValidMessages` checks:

- The request contains an array.
- There is at least one message and no more than ten.
- Every message has a permitted role.
- Every message has non-empty text that is no more than 600 characters.

The relevant pattern is:

```tsx
Array.isArray(value) &&
value.length > 0 &&
value.length <= MAX_MESSAGES &&
value.every((message) => /* validate one message */)
```

This limits accidental oversized requests and makes the API endpoint more predictable.

### Grounding the Digital Twin

The `careerContext` string is a **system prompt**. It supplies the verified professional facts and behavioral instructions before the visitor's conversation is sent to the AI.

It is deliberately strict:

```text
Treat the verified profile below as a closed book: every factual claim
must be directly supported by it. Do not make reasonable inferences...
```

This matters because language models can produce believable but unverified detail. The context tells the model to say when something is not specified instead of guessing.

### Calling OpenRouter

The server makes an HTTP request using `fetch`:

```tsx
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "X-OpenRouter-Title": "Phong Trinh Digital Twin"
  },
  body: JSON.stringify({
    model: "openai/gpt-oss-120b:free",
    messages: [{ role: "system", content: careerContext }, ...body.messages],
    temperature: 0.35,
    max_tokens: 450
  }),
  signal: AbortSignal.timeout(30000)
});
```

Important pieces:

- `Authorization` sends the private OpenRouter key from the server.
- `model` chooses the requested free model.
- The system message comes first, then the chat history.
- `temperature: 0.35` asks for relatively consistent, focused answers rather than highly creative ones.
- `max_tokens: 450` limits the size of an answer.
- `AbortSignal.timeout(30000)` stops a request that has taken more than 30 seconds.

OpenRouter responds with JSON. The route reads the first answer from `choices[0].message.content`, then sends a simpler `{ message }` object back to the browser.

### Error handling

There are two classes of failures:

1. **OpenRouter returned an error**: the route logs a technical detail on the server and gives the visitor a neutral `502` response.
2. **Something else failed**: bad JSON, a timeout, or an unexpected exception is caught and returned as a friendly `500` response.

The technical error is logged with `console.error` on the server, not displayed to the visitor. That helps debugging without revealing secrets or provider internals.

## 9. The App Shell and Metadata

[`app/layout.tsx`](app/layout.tsx) wraps every page. It imports the global CSS and defines browser metadata:

```tsx
export const metadata: Metadata = {
  title: "Phong Trinh | Full-Stack Software Engineer",
  description: "Professional portfolio for Phong Trinh..."
};
```

The title appears in the browser tab and can appear in search results. The description is a short explanation for search engines and social previews.

The `<body suppressHydrationWarning>` setting is there to avoid a development warning caused by browser extensions adding attributes before React starts. It should not be used as a general way to hide real React mismatches; here it addresses a known extension-side modification.

## 10. A Complete Question-to-Answer Example

Suppose someone asks: “What is Phong's experience with authentication?”

1. They type the question into the input in `DigitalTwin`.
2. The form calls `sendMessage`.
3. React immediately adds the question to `messages` and shows a loading state.
4. Browser code sends the current conversation to `/api/chat` as JSON.
5. The API route verifies the shape and length of the messages.
6. The API route adds the verified career context and uses the private API key to contact OpenRouter.
7. OpenRouter returns an answer from `openai/gpt-oss-120b:free`.
8. The route extracts the response text and returns `{ "message": "..." }`.
9. Browser code appends that text as an assistant message.
10. React redraws the chat panel, and `aria-live` announces the new response for screen-reader users.

## 11. How to Make Small Content Changes

Here are low-risk places to practice:

### Change a skill

In `app/page.tsx`, add a string to the `skills` array:

```tsx
const skills = [
  "React",
  "TypeScript",
  "AWS"
];
```

The page will create the new skill badge automatically.

### Add a career entry

Add an object to the `timeline` array:

```tsx
{
  period: "2026",
  role: "Your new role",
  org: "Company name",
  detail: "One or two concrete sentences about the work."
}
```

The timeline UI will render it without new layout code.

### Improve the Digital Twin's knowledge

Add only verified facts to the `Verified profile` part of `careerContext` in `app/api/chat/route.ts`. Keep the existing no-invention rule. For example:

```text
- In 2026, he shipped [verified feature] using [verified technology].
```

Do not add personal secrets, private client information, or claims you would not publish on the website.

### Change an accent color

Edit a variable in `app/globals.css`:

```css
:root {
  --cyan: #63d8f5;
}
```

Because the UI reuses the variable, the navigation accents, chat border, profile tag, and related details will update together.

## 12. Troubleshooting

### The chat says it is not configured

Check that `.env` exists in the project root and contains `OPENROUTER_API_KEY=...`. Restart the Next.js server after changing `.env`, because environment variables are loaded when the server starts.

### The chat is unavailable

Check the terminal that is running Next.js for an error. This can be caused by an internet connection issue, a rate limit, an invalid key, or temporary model availability. The chat UI intentionally gives visitors a calm, general error instead of provider details.

### I changed code and do not see it

When using `npm run dev`, refresh the page. Next.js normally updates automatically. If it does not, stop the server with `Ctrl+C`, run `npm run dev` again, and refresh the browser.

### The build fails

Run:

```bash
npm run build
```

Read the first TypeScript or syntax error in the output. The file path and line number usually point directly to the mistake.

## 13. Self-Review: Five Improvements to Consider

1. **Move career facts into structured content.** The current system prompt is a hand-written string. Store career entries in a typed JSON or TypeScript data file and generate both the page and AI context from it, so the two cannot drift apart.
2. **Add server-side rate limiting and abuse protection.** Message length and history are limited, but a public site should also restrict requests by IP or session to protect the free model quota and reduce automated misuse.
3. **Stream answers instead of waiting for the full response.** OpenRouter supports streamed responses. Streaming would make the Digital Twin feel faster, especially when the model takes several seconds to begin answering.
4. **Add automated tests.** Unit tests for `isValidMessages`, API-route error cases, and a browser test for sending a message would make later changes less risky.
5. **Strengthen the knowledge boundary with retrieval.** The prompt is carefully grounded, but a future version could retrieve only relevant verified facts from a curated knowledge file before each answer. This would scale better as the portfolio grows and further reduce the chance of unsupported claims.
