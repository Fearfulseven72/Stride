import Link from 'next/link';
import { ArrowUpRight, Flower2, Leaf, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Welcome back — Stride', description: 'A familiar space for your next small step. Sign in to Stride with ChatGPT.' };
export default function LoginPage() {
  return <main className="login-page">
    <section className="login-story"><Link className="brand" href="/" aria-label="Stride home"><Flower2 size={32} /><span>stride<span className="brand-period">.</span></span></Link><div className="login-story-copy"><span className="eyebrow">YOUR PACE. YOUR PATH.</span><h1>A little focus.<br />A little <em>further.</em></h1><p>Come as you are. Make a little room for what matters, and let the next small step be enough.</p></div><div className="login-botanical" aria-hidden="true"><Flower2 /><Leaf /><span>grow at your own pace</span></div><p className="login-footnote">Built for progress, not perfection.</p></section>
    <section className="login-panel" aria-labelledby="login-heading"><div className="login-form"><span className="login-icon"><Flower2 size={30} /></span><span className="eyebrow">A FAMILIAR PLACE TO BEGIN</span><h2 id="login-heading">Welcome to your space.</h2><p>A clear plan. A calmer mind. Your next stride starts here.</p><a className="primary login-submit" href="/signin-with-chatgpt?return_to=%2F" target="_top">Continue with ChatGPT <ArrowUpRight size={18} /></a><div className="login-security"><ShieldCheck size={17} /><span>Secure sign-in, managed by ChatGPT.<br />No separate password to remember.</span></div><div className="login-divider" /><Link className="text-button" href="/">Return to my workspace <ArrowUpRight size={16} /></Link><p className="login-storage">Your tasks, journal, and appearance settings are saved on this device. Signing in does not sync browser data.</p></div></section>
  </main>;
}
