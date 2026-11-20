import { NextResponse } from "next/server";

export const runtime = "nodejs";

const USERNAME = "DanielDave2004";

type Day = { date: string; contributionCount: number; contributionLevel: string };
type GraphqlResponse = {
  data?: { user?: { contributionsCollection?: { contributionCalendar?: { totalContributions: number; weeks: { contributionDays: Day[] }[] } } } };
  errors?: { message: string }[];
};
const levels: Record<string, number> = {
  NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4,
};

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Missing GITHUB_TOKEN in .env.local. See the included README." },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  const query = `query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount contributionLevel } }
        }
      }
    }
  }`;
  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
        "User-Agent": "my-portfolio-contributions",
      },
      body: JSON.stringify({ query, variables: { login: USERNAME } }),
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: `GitHub API request failed (${response.status}). Check your token.` },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }
    const result = (await response.json()) as GraphqlResponse;
    const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;
    if (!calendar || result.errors?.length) {
      return NextResponse.json(
        { error: result.errors?.[0]?.message || "GitHub did not return a contribution calendar." },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }
    return NextResponse.json({
      username: USERNAME,
      total: calendar.totalContributions,
      days: calendar.weeks.flatMap((week) => week.contributionDays).map((day) => ({
        date: day.date, count: day.contributionCount, level: levels[day.contributionLevel] ?? 0,
      })),
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json(
      { error: "Unable to reach GitHub. Try again shortly." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
