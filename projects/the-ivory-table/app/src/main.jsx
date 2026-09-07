import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowDown, ArrowUpRight, CalendarDays, Check, Clock3, Menu, Minus, Plus, X } from 'lucide-react';
import './styles.css';

const photos = {
  hero: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1800&q=85',
  dining: 'https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85',
  dish: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85',
  dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1000&q=85',
};

const menus = {
  Lunch: [
    ['Burren sourdough', 'Cultured butter, sea salt', '6'],
    ['Roasted beetroot', 'Goat curd, hazelnut, apple', '13'],
    ['Line-caught hake', 'Celeriac, mussel, lovage', '24'],
    ['Fermanagh chicken', 'Leek, wild garlic, pearl barley', '26'],
    ['Buttermilk pudding', 'Rhubarb, oat, meadowsweet', '10'],
  ],
  Evening: [
    ['Lough Neagh eel', 'Cucumber, horseradish, dill', '16'],
    ['Derry market carrot', 'Fermented honey, walnut, sorrel', '14'],
    ['Roasted cod', 'Brown crab, sea herbs, potato', '32'],
    ['Glenarm estate beef', 'Cabbage, smoked onion, jus', '38'],
    ['Dark chocolate crémeux', 'Buttermilk, pear, cocoa nib', '12'],
  ],
  Dessert: [
    ['Malted barley custard', 'Blackberry, sweet cicely', '11'],
    ['Warm treacle tart', 'Clotted cream, sea buckthorn', '11'],
    ['Irish cheese', 'Chutney, oat crackers', '14'],
    ['Petit fours', 'The Ivory Table selection', '8'],
  ],
};

function ReservationModal({ onClose }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: '19:00', guests: 2, notes: '' });
  const [status, setStatus] = useState('idle');
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault(); setStatus('loading');
    if (import.meta.env.MODE === 'demo') {
      setStatus('success');
      return;
    }
    try {
      const response = await fetch('/api/reservations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error('Unable to reserve');
      setStatus('success');
    } catch { setStatus('error'); }
  };
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="reservation-modal" aria-labelledby="reserve-title">
      <button className="close-button" onClick={onClose} aria-label="Close reservation form"><X size={19} /></button>
      {status === 'success' ? <div className="success-state"><span className="success-icon"><Check /></span><p className="eyebrow">A place at the table</p><h2 id="reserve-title">We’ll see you soon.</h2><p>Your reservation request is safely with our team. We’ll confirm the details at <strong>{form.email}</strong> shortly.</p><button className="ink-button" onClick={onClose}>Return to the table <ArrowUpRight size={16} /></button></div> : <>
        <p className="eyebrow">Join us</p><h2 id="reserve-title">Reserve a table</h2><p className="modal-intro">For celebrations, quiet suppers, and everything in between.</p>
        <form onSubmit={submit}>
          <div className="field-row"><label>Name<input required value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your name" /></label><label>Email<input required type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" /></label></div>
          <div className="field-row"><label>Date<input required type="date" value={form.date} onChange={(e) => update('date', e.target.value)} /></label><label>Time<select value={form.time} onChange={(e) => update('time', e.target.value)}>{['12:30','13:00','18:00','18:30','19:00','19:30','20:00','20:30'].map((time) => <option key={time}>{time}</option>)}</select></label></div>
          <div className="field-row"><label>Guests<div className="stepper"><button type="button" onClick={() => update('guests', Math.max(1, form.guests - 1))}><Minus size={14} /></button><span>{form.guests} {form.guests === 1 ? 'guest' : 'guests'}</span><button type="button" onClick={() => update('guests', Math.min(12, form.guests + 1))}><Plus size={14} /></button></div></label><label>Phone <span className="optional">optional</span><input value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="028 7123 4567" /></label></div>
          <label>Notes <span className="optional">dietary requirements, occasion</span><textarea rows="3" value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Tell us anything helpful..."></textarea></label>
          {status === 'error' && <p className="form-error">Something went wrong. Please try again.</p>}
          <button className="ink-button full-button" disabled={status === 'loading'}>{status === 'loading' ? 'Holding your table...' : <>Request reservation <ArrowUpRight size={16} /></>}</button>
        </form>
      </>}
    </section>
  </div>;
}

function App() {
  const [menu, setMenu] = useState('Lunch'); const [modal, setModal] = useState(false); const [navOpen, setNavOpen] = useState(false);
  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); setNavOpen(false); };
  return <div className="site-shell">
    <header className="nav"><a className="brand" href="#top"><span className="brand-mark">✦</span><span>THE<br /><i>IVORY</i> TABLE</span></a><button className="mobile-toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle menu">{navOpen ? <X /> : <Menu />}</button><nav className={navOpen ? 'nav-links open' : 'nav-links'}><button onClick={() => scrollTo('story')}>Our story</button><button onClick={() => scrollTo('menus')}>Menus</button><button onClick={() => scrollTo('visit')}>Find us</button><button className="nav-reserve" onClick={() => setModal(true)}>Reserve a table <ArrowUpRight size={15} /></button></nav></header>
    <main id="top">
      <section className="hero"><div className="hero-image" style={{ backgroundImage: `url(${photos.hero})` }}></div><div className="hero-content"><p className="eyebrow light">A modern Irish table · Derry</p><h1>Good food.<br /><em>Good company.</em></h1><p className="hero-copy">A quietly ambitious restaurant rooted in the generous spirit of the North West.</p><button className="light-button" onClick={() => setModal(true)}>Reserve your table <ArrowUpRight size={17} /></button></div><div className="hero-caption">12 Bishop Street<br />Derry · BT48 6PL</div><div className="scroll-cue"><span>Scroll to explore</span><ArrowDown size={15} /></div></section>
      <section className="intro section-grid" id="story"><div className="section-label"><span>01</span><span>Our story</span></div><div className="intro-copy"><p className="eyebrow">From our place to yours</p><h2>Rooted here.<br /><em>Open to everywhere.</em></h2><p className="large-copy">The Ivory Table is a celebration of Northern Irish produce, people, and the pleasure of taking your time. Our kitchen follows the seasons, works closely with growers and fishermen, and leaves room for a little surprise.</p><button className="text-link" onClick={() => scrollTo('visit')}>More about us <ArrowUpRight size={16} /></button></div><div className="intro-image image-frame"><img src={photos.dining} alt="Warmly lit dining room at The Ivory Table" /><span className="image-note">The dining room<br /><i>As the light falls</i></span></div></section>
      <section className="menu-section" id="menus"><div className="section-grid menu-heading"><div className="section-label"><span>02</span><span>The menus</span></div><div><p className="eyebrow">A little something for everyone</p><h2>Made with care.<br /><em>Served with joy.</em></h2></div></div><div className="menu-tabs">{Object.keys(menus).map((name) => <button className={menu === name ? 'active' : ''} onClick={() => setMenu(name)} key={name}>{name}<span>0{name === 'Lunch' ? 1 : name === 'Evening' ? 2 : 3}</span></button>)}</div><div className="menu-content"><div className="menu-photo"><img src={photos.dish} alt="A carefully plated seasonal dish" /><div className="menu-photo-label">The kitchen<br /><i>Seasonal, always</i></div></div><div className="menu-list"><div className="menu-list-head"><span>{menu} · A la carte</span><span>Price</span></div>{menus[menu].map(([title, description, price]) => <div className="menu-item" key={title}><div><h3>{title}</h3><p>{description}</p></div><span>£{price}</span></div>)}<p className="menu-footnote">Please let us know about any allergies or dietary requirements when booking.</p></div></div></section>
      <section className="quote-band"><p className="eyebrow">The Ivory Table, Derry</p><blockquote>“The kind of place<br />you’ll want to <em>keep</em> to yourself.”</blockquote><span className="quote-credit">— The Belfast Telegraph</span></section>
      <section className="visit section-grid" id="visit"><div className="section-label"><span>03</span><span>Come by</span></div><div className="visit-copy"><p className="eyebrow">Find your way to us</p><h2>Make an evening<br /><em>of it.</em></h2><div className="details"><div><Clock3 size={17} /><p><strong>Opening hours</strong>Tue – Sat · 12 noon – late<br /><span>Lunch · 12–3pm &nbsp; Dinner · 5.30–10pm</span></p></div><div><CalendarDays size={17} /><p><strong>Reservations</strong>Bookings open 3 months ahead<br /><span>Walk-ins welcome at the bar</span></p></div></div><button className="ink-button" onClick={() => setModal(true)}>Reserve a table <ArrowUpRight size={16} /></button></div><div className="visit-image image-frame"><img src={photos.dessert} alt="Dessert with seasonal fruit" /><span className="image-note">Something sweet<br /><i>To finish</i></span></div></section>
    </main>
    <footer><div className="footer-brand"><span className="brand-mark">✦</span><div>THE <i>IVORY</i> TABLE</div></div><p>12 Bishop Street, Derry<br />Northern Ireland · BT48 6PL</p><div className="footer-right"><a href="mailto:hello@theivorytable.co.uk">hello@theivorytable.co.uk</a><a href="#top">Instagram</a><span>© 2024 The Ivory Table</span></div><div className="mockup-banner">Mockup Website by JPJ Solutions (2026)</div></footer>
    {modal && <ReservationModal onClose={() => setModal(false)} />}
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
