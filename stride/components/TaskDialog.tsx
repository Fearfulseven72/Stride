'use client';
import { useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import type { Task } from './Dashboard';
export default function TaskDialog({ close, save, defaultDate }: {
    defaultDate: string;
    close: () => void;
    save: (task: Task) => void;
}) { useEffect(() => { const previous = document.activeElement as HTMLElement; const el = document.getElementById('task-dialog') as HTMLDialogElement; el.showModal(); return () => previous?.focus(); }, []); return <dialog aria-label="Add a task" id="task-dialog" onCancel={close} onClick={e => { if (e.target === e.currentTarget)
    close(); }}><form onSubmit={e => { e.preventDefault(); const f = new FormData(e.currentTarget); const title = String(f.get('title')).trim(); if (!title)
    return; save({ id: crypto.randomUUID(), title, category: String(f.get('category')), minutes: Number(f.get('minutes')), time: String(f.get('time')), date: String(f.get('date')), done: false }); }}><div className="section-heading"><h2>Make your next move.</h2><button type="button" className="icon-button" onClick={close} aria-label="Close"><X size={20}/></button></div><p>Keep it specific. Make it achievable.</p><label htmlFor="title">What do you want to do?</label><input id="title" name="title" required maxLength={120} autoFocus placeholder="e.g. Review chapter 3 with active recall"/><label htmlFor="date">Planned date</label><input id="date" name="date" type="date" defaultValue={defaultDate} required/><label htmlFor="category">Category</label><select id="category" name="category"><option>Study</option><option>Work</option><option>Personal</option></select><div className="form-grid"><div><label htmlFor="minutes">Estimated minutes</label><input id="minutes" name="minutes" type="number" min="1" max="480" defaultValue="25" required/></div><div><label htmlFor="time">Start time (optional)</label><input id="time" name="time" type="time"/></div></div><button className="primary" type="submit"><Plus size={16}/> Add to my day</button></form></dialog>; }
