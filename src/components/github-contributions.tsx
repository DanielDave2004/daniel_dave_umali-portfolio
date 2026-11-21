"use client";

import { useEffect, useMemo, useState } from "react";
import "./github-contributions.css";

type Contribution = { date: string; count: number; level: number };
type ApiResponse = { contributions?: Contribution[]; total?: Record<string, number> };
type Props = { username?: string; compact?: boolean };
type CalendarDay = Contribution | null;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function dayOfWeek(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay();
}

/** Keep GitHub's daily API response, but align the calendar to Sunday–Saturday weeks. */
function createCalendar(days: Contribution[]) {
  if (!days.length) return { cells: [] as CalendarDay[], months: [] as { label: string; week: number }[], weeks: 0 };

  const padStart = dayOfWeek(days[0].date);
  const cells: CalendarDay[] = [...Array<CalendarDay>(padStart).fill(null), ...days];
  const weeks = Math.ceil(cells.length / 7);
  while (cells.length < weeks * 7) cells.push(null);

  const months: { label: string; week: number }[] = [];
  let previousMonth = -1;
  days.forEach((day, index) => {
    const month = Number(day.date.slice(5, 7)) - 1;
    if (month !== previousMonth) {
      const week = Math.floor((index + padStart) / 7);
      // The first month may be partially visible, so hide its label if it overlaps the next.
      if (index === 0 || week > months[months.length - 1]?.week + 2 || months.length === 0) {
        months.push({ label: MONTHS[month] ?? "", week });
      }
      previousMonth = month;
    }
  });
  return { cells, weeks, months };
}

/** Uses the original working API and contribution-count logic, changing presentation only. */
export function GithubContributions({ username = "DanielDave2004", compact = false }: Props) {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return (await response.json()) as ApiResponse;
      })
      .then((data) => {
        if (!Array.isArray(data.contributions)) throw new Error("Unexpected response");
        setContributions(data.contributions);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setStatus("error");
      });
    return () => controller.abort();
  }, [username]);

  const total = contributions.reduce((sum, day) => sum + day.count, 0);
  const calendar = useMemo(() => createCalendar(contributions), [contributions]);

  return (
    <section className={`gh-contributions ${compact ? "gh-contributions--compact" : ""}`} aria-label="GitHub contributions">
      <div className="gh-contributions__head">
        <h2>GitHub Contributions</h2>
        <a href={`https://github.com/${encodeURIComponent(username)}`} target="_blank" rel="noopener noreferrer">
          View profile ↗
        </a>
      </div>

      {status === "loading" && <p className="gh-contributions__state" role="status">Loading contributions…</p>}
      {status === "error" && (
        <p className="gh-contributions__state" role="status">Contributions could not be loaded. Check your connection or view your GitHub profile.</p>
      )}
      {status === "ready" && (
        <>
          <div className="gh-contributions__calendar" style={{ "--gh-weeks": calendar.weeks } as React.CSSProperties}>
            <div className="gh-contributions__chart">
              <div className="gh-contributions__months" aria-hidden="true">
                {calendar.months.map((month, index) => (
                  <span key={`${month.week}-${index}`} style={{ gridColumn: month.week + 1 }}>{month.label}</span>
                ))}
              </div>
              <div className="gh-contributions__grid" role="group" aria-label={`${total.toLocaleString()} contributions over the past year for ${username}`}>
                <div className="gh-contributions__weekdays" aria-hidden="true">
                  <span /> <span>Mon</span> <span /> <span>Wed</span> <span /> <span>Fri</span> <span />
                </div>
                {calendar.cells.map((day, index) => (
                  <span
                    key={day?.date ?? `empty-${index}`}
                    className={`gh-contributions__day ${day ? `gh-contributions__level-${Math.max(0, Math.min(4, day.level ?? 0))}` : "gh-contributions__empty"}`}
                    title={day ? `${day.date}: ${day.count} contribution${day.count === 1 ? "" : "s"}` : undefined}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="gh-contributions__foot">
            <span className="gh-contributions__total">{total.toLocaleString()} CONTRIBUTIONS IN THE LAST YEAR</span>
            <span className="gh-contributions__legend">Less {[0, 1, 2, 3, 4].map((level) => <i key={level} className={`gh-contributions__level-${level}`} />)} More</span>
          </div>
        </>
      )}
    </section>
  );
}

export default GithubContributions;
