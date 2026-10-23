'use client';

import Link from 'next/link';
import { Sun, Moon, Monitor, Check, UserRound, ArrowUpRight } from 'lucide-react';
import { palettes, usePreferences } from './Preferences';

export default function ProfileSettings() {
  const { preferences, update, error } = usePreferences();
  return <div className="settings-stack">
    <section className="card settings-card">
      <div className="section-heading"><h2><UserRound size={19} /> Your profile</h2><span className="pill">ON THIS DEVICE</span></div>
      <p className="settings-description">Make this little corner of the day feel like you.</p>
      <label htmlFor="display-name">What should we call you?</label>
      <input id="display-name" maxLength={60} autoComplete="nickname" value={preferences.name} placeholder="Your name" onChange={e => update({ name: e.target.value })} />
      <p className="saved">Your display name is a local preference, separate from your ChatGPT account.</p>
    </section>
    <section className="card settings-card">
      <div className="section-heading"><h2>A space that suits you</h2><span className="pill">APPEARANCE</span></div>
      <p className="settings-description">A brighter start or a quieter evening. Choose your light.</p>
      <fieldset><legend>Theme</legend><div className="theme-options">{([{ id: 'light', name: 'Light', Icon: Sun }, { id: 'dark', name: 'Dark', Icon: Moon }, { id: 'system', name: 'System', Icon: Monitor }] as const).map(({ id, name, Icon }) => <label className={'theme-choice ' + (preferences.theme === id ? 'chosen' : '')} key={id}><input type="radio" name="theme" value={id} checked={preferences.theme === id} onChange={() => update({ theme: id })} /><Icon size={21} /><span>{name}</span>{preferences.theme === id && <Check size={15} />}</label>)}</div></fieldset>
      <fieldset><legend>Color palette</legend><p className="settings-description">Five familiar palettes, inspired by your original color reference.</p><div className="palette-options">{palettes.map(p => <label className={'palette-choice ' + (preferences.palette === p.id ? 'chosen' : '')} key={p.id}><input type="radio" name="palette" value={p.id} checked={preferences.palette === p.id} onChange={() => update({ palette: p.id })} /><span className="palette-swatches" aria-hidden="true">{p.colors.map(c => <i key={c} style={{ backgroundColor: c }} />)}</span><span><strong>{p.name}</strong><small>{p.description}</small></span>{preferences.palette === p.id && <Check size={17} />}</label>)}</div></fieldset>
      <p className="saved" role="status">{error || 'Changes apply instantly and save automatically on this device.'}</p>
    </section>
    <section className="card settings-card account-card"><div><h2>Account & sign-in</h2><p className="settings-description">ChatGPT manages access to this private workspace. Tasks and journals remain in this browser.</p></div><Link className="text-button" href="/login">Open sign-in page <ArrowUpRight size={16} /></Link><a className="text-button" href="/signout-with-chatgpt?return_to=%2Flogin" target="_top">Sign out of this site <ArrowUpRight size={16} /></a></section>
  </div>;
}
