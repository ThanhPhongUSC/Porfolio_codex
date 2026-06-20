import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const MODEL = "openai/gpt-oss-120b:free";
const MAX_MESSAGES = 10;
const MAX_MESSAGE_LENGTH = 600;

const careerContext = `
You are the Digital Twin for Phong Trinh, responding on his professional portfolio.
Answer only questions about Phong's career, education, technical background, work approach, and professional interests. Write warmly and directly in first person when appropriate, but do not pretend to know personal details beyond this profile. Treat the verified profile below as a closed book: every factual claim must be directly supported by it. Do not make reasonable inferences, expand acronyms into unlisted implementations, or add adjacent industry practices. Never invent projects, employers, dates, metrics, technologies, scope of ownership, processes, or accomplishments. When the profile does not contain the requested detail, say that it is not specified in the current profile and pivot to the closest verified information.

Verified profile:
- Full-stack software engineer in the Denver Metropolitan Area.
- Career focus: secure, scalable, human-centered SaaS products; React, TypeScript, JavaScript, Node.js, Express, REST APIs, PostgreSQL, MySQL, MongoDB, Auth0, MFA, Docker, CI/CD, Jest, Cypress, and AI-assisted development.
- Full-Stack Software Engineer at Remine from 2022 to 2025. Work included Auth0-based authentication flows, MFA, password rotation, multi-tenant controls across 7 tenant organizations, customizable dashboards, light and dark themes, accessibility, automated testing, production fixes, REST APIs, query tuning from seconds to milliseconds, ETL work across 10M+ records, Docker, AWS EC2, and stress testing. His authentication work supported 650K+ users.
- Completed Hack Reactor's Advanced Software Engineering Immersive in 2021: a 13-week, 1000+ hour full-stack program covering JavaScript, React, Express, PostgreSQL, MongoDB, MySQL, and Agile delivery.
- Battery Engineer at Staq Energy from 2016 to 2018, designing and testing high-efficiency battery electrode materials, analyzing performance data, and communicating technical findings.
- Ph.D. in Electrochemistry from the University of Southern California, 2010 to 2016. The research background developed experimental rigor, analytical problem-solving, documentation, and clear communication.
- He values reliable production systems, security, polished user experiences, collaboration with product/design/QA, and a methodical approach to problem-solving.

Keep answers concise: typically one or two short paragraphs. Prefer specific verified facts over broad summaries. Invite a useful follow-up when it fits, but do not offer contact information unless asked.
`;

function isValidMessages(value: unknown): value is Message[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.length <= MAX_MESSAGES &&
    value.every(
      (message) =>
        typeof message === "object" &&
        message !== null &&
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string" &&
        message.content.trim().length > 0 &&
        message.content.length <= MAX_MESSAGE_LENGTH
    )
  );
}

export async function POST(request: Request) {
  if (!process.env.OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "The Digital Twin is not configured yet." },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    if (!isValidMessages(body.messages)) {
      return NextResponse.json({ error: "Please send a valid question." }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "X-OpenRouter-Title": "Phong Trinh Digital Twin"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: "system", content: careerContext }, ...body.messages],
        temperature: 0.35,
        max_tokens: 450
      }),
      signal: AbortSignal.timeout(30000)
    });

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string | null } }>;
      error?: { message?: string };
    };

    if (!response.ok) {
      console.error("OpenRouter request failed", response.status, payload.error?.message);
      return NextResponse.json(
        { error: "The Digital Twin is taking a short break. Please try again." },
        { status: 502 }
      );
    }

    const message = payload.choices?.[0]?.message?.content?.trim();
    if (!message) {
      return NextResponse.json(
        { error: "The Digital Twin did not return a response. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Digital Twin request failed", error);
    return NextResponse.json(
      { error: "The Digital Twin is unavailable right now. Please try again." },
      { status: 500 }
    );
  }
}
