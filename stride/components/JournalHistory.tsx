'use client';

import { useState } from 'react';
import { BookOpen, Search, ChevronDown } from 'lucide-react';

export default function JournalHistory({ notes, today }: { notes: Record<string, string>; today: string }) {
  const [query, setQuery] = useState('');
  const entries = Object.entries(notes).filter(([date, text]) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date < today && typeof text === 'string' && text.trim()).sort(([a], [b]) => b.localeCompare(a));
  const filtered = entries.filter(([date, text]) => `${date} ${text} ${formatDate(date)}`.toLowerCase().includes(query.toLowerCase()));
  return <section className="card journal-history" aria-labelledby="journal-history-title">
    <div className="section-heading"><h2 id="journal-history-title"><BookOpen size={18} /> Pages from your journey</h2><span className="pill">{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span></div>
    <p className="settings-description">Past reflections, kept close. A reminder of the ground you’ve covered.</p>
    {entries.length > 0 && <div className="journal-search"><Search size={16} /><label className="sr-only" htmlFor="journal-search">Search previous journal entries</label><input id="journal-search" type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a thought, a win, a moment…" /></div>}
    {filtered.map(([date, text]) => <details className="journal-entry" key={date}><summary><span className="journal-date"><time dateTime={date}>{formatDate(date)}</time><small>{text.slice(0, 100)}{text.length > 100 ? '…' : ''}</small></span><ChevronDown size={18} /></summary><p className="journal-text">{text}</p></details>)}
    {entries.length === 0 && <div className="journal-empty"><BookOpen size={26} /><h3>Your story is still unfolding.</h3><p>Today’s reflection will appear here tomorrow. Previous saved entries stay here automatically.</p></div>}
    {entries.length > 0 && filtered.length === 0 && <p className="journal-empty" role="status">No entries match your search. Try another word or date.</p>}
    <p className="saved">Saved in this browser. Your existing reflections are preserved.</p>
  </section>;
}
function formatDate(date: string) { return new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }); }
