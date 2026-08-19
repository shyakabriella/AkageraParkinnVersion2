import { useState, useCallback } from 'react';
import { usePageInit } from '../../hooks/usePageInit';
import './Restaurant.css';

// ─── Menu Data ───────────────────────────────────────────────
const MENU = {
  breakfast: [
    {
      id: 'b1',
      name: 'Full African Breakfast',
      description: 'Eggs your way, grilled tomatoes, sausage, baked beans, toast & fresh juice',
      price: 12,
      badge: "Chef's Pick",
      img: '/img/food/breakfast.jpg',
    },
    {
      id: 'b2',
      name: 'Tropical Fruit Platter',
      description: 'Seasonal local fruits, honey yoghurt & granola',
      price: 8,
      img: '/img/food/breakfast.jpg',
    },
    {
      id: 'b3',
      name: 'Rwandan Porridge',
      description: 'Traditional uji with brown sugar, milk & fresh banana',
      price: 5,
      badge: 'Local Favourite',
      img: '/img/food/porridge.jpg',
    },
    {
      id: 'b4',
      name: 'Omelette Wrap',
      description: 'Three-egg omelette with peppers, onions & cheese in a soft chapati wrap',
      price: 9,
      img: '/img/food/breakfast.jpg',
    },
    {
      id: 'b5',
      name: 'Pancake Stack',
      description: 'Fluffy pancakes with maple syrup, butter & choice of berries or banana',
      price: 7,
      img: '/img/food/porridge.jpg',
    },
    {
      id: 'b6',
      name: 'Continental Basket',
      description: 'Assorted bread rolls, pastries, jam, butter & coffee or tea',
      price: 6,
      img: '/img/food/breakfast.jpg',
    },
  ],
  lunch: [
    {
      id: 'l1',
      name: 'Grilled Tilapia',
      description: 'Lake tilapia fillet, lemon herb butter, garden salad & roasted potatoes',
      price: 18,
      badge: "Chef's Pick",
      img: '/img/food/tilapia.jpg',
    },
    {
      id: 'l2',
      name: 'Safari Beef Brochette',
      description: 'Marinated beef skewers, roasted plantains, tomato relish & ugali',
      price: 16,
      badge: 'House Special',
      img: '/img/food/brochette.jpg',
    },
    {
      id: 'l3',
      name: 'Vegetable Curry',
      description: 'Seasonal vegetables in a rich coconut curry, served with steamed rice',
      price: 13,
      img: '/img/food/tilapia.jpg',
    },
    {
      id: 'l4',
      name: 'Bush Burger',
      description: 'Flame-grilled beef patty, lettuce, tomato, pickles, fries & house sauce',
      price: 15,
      img: '/img/food/burger.jpg',
    },
    {
      id: 'l5',
      name: 'Grilled Chicken Plate',
      description: 'Half chicken marinated in lemon & herbs, with coleslaw & fries',
      price: 14,
      img: '/img/food/brochette.jpg',
    },
    {
      id: 'l6',
      name: 'Pasta Primavera',
      description: 'Penne with seasonal vegetables, garlic, olive oil & parmesan',
      price: 12,
      img: '/img/food/tilapia.jpg',
    },
  ],
  drinks: [
    {
      id: 'd1',
      name: 'Akagera Sunset',
      description: 'Passion fruit, mango, grenadine & ginger — our house signature mocktail',
      price: 6,
      badge: 'Signature',
      img: '/img/food/drinks.jpg',
    },
    {
      id: 'd2',
      name: 'Fresh Squeezed Juice',
      description: 'Choose from pineapple, orange, watermelon, or passion fruit',
      price: 4,
      img: '/img/food/drinks.jpg',
    },
    {
      id: 'd3',
      name: 'Rwandan Coffee',
      description: 'Single-origin Rwandan arabica, brewed to order — black or with milk',
      price: 3,
      badge: 'Local Favourite',
      img: '/img/food/drinks.jpg',
    },
    {
      id: 'd4',
      name: 'Tusker Lager',
      description: 'Ice-cold East African lager — bottled',
      price: 4,
      img: '/img/food/drinks.jpg',
    },
    {
      id: 'd5',
      name: 'Red or White Wine',
      description: 'House selection by the glass — ask your server for today\'s pour',
      price: 7,
      img: '/img/food/drinks.jpg',
    },
    {
      id: 'd6',
      name: 'Masai Gin & Tonic',
      description: 'Premium gin, tonic water, lime & fresh cucumber',
      price: 9,
      img: '/img/food/drinks.jpg',
    },
  ],
};

const ALL_ITEMS = [...MENU.breakfast, ...MENU.lunch, ...MENU.drinks];

const TABS = [
  { key: 'breakfast', label: '🌅 Breakfast' },
  { key: 'lunch', label: '🍽 Lunch & Dinner' },
  { key: 'drinks', label: '🍹 Bar & Drinks' },
];

function formatOrder(cart) {
  return ALL_ITEMS
    .filter(item => cart[item.id] > 0)
    .map(item => `• ${item.name} ×${cart[item.id]} — $${item.price * cart[item.id]}`)
    .join('\n');
}

function getTotal(cart) {
  return ALL_ITEMS.reduce((sum, item) => sum + (cart[item.id] || 0) * item.price, 0);
}

function getTotalItems(cart) {
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

export default function Restaurant() {
  usePageInit();

  const [activeTab, setActiveTab] = useState('breakfast');
  const [cart, setCart] = useState({});
  const [orderStep, setOrderStep] = useState('menu'); // 'menu' | 'review' | 'confirmed'
  const [guestName, setGuestName] = useState('');
  const [tableNum, setTableNum] = useState('');
  const [notes, setNotes] = useState('');

  const add = useCallback((id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }, []);

  const remove = useCallback((id) => {
    setCart(prev => {
      const next = { ...prev, [id]: (prev[id] || 1) - 1 };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }, []);

  const clearItem = useCallback((id) => {
    setCart(prev => { const next = { ...prev }; delete next[id]; return next; });
  }, []);

  const totalItems = getTotalItems(cart);
  const total = getTotal(cart);

  const placeOrder = () => {
    const orderText = formatOrder(cart);
    const msg = `*New Order — Akagera Park Inn Restaurant*\n\n*Guest:* ${guestName || 'Not given'}\n*Table/Room:* ${tableNum || 'Not given'}\n\n*Items:*\n${orderText}\n\n*Total: $${total}*\n\n*Notes:* ${notes || 'None'}`;
    window.open(`https://wa.me/250788395521?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    setOrderStep('confirmed');
  };

  const resetOrder = () => {
    setCart({});
    setGuestName('');
    setTableNum('');
    setNotes('');
    setOrderStep('menu');
  };

  const cartItems = ALL_ITEMS.filter(item => (cart[item.id] || 0) > 0);

  return (
    <div className="hly-page">

      {/* ── Hero ── */}
      <section className="rest-hero" style={{ backgroundImage: "url('/img/4.jpg')" }}>
        <div className="rest-hero-overlay" aria-hidden="true" />
        <div className="rest-hero-content">
          <span className="rest-tag">Dining at Akagera Park Inn</span>
          <h1>The Akagera Table</h1>
          <p>A celebration of Rwandan flavours and fresh local produce, served in a setting as beautiful as the park itself.</p>
          <a href="#rest-menu" className="theme-btn">
            Order Now
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </a>
        </div>
      </section>

      {/* ── Info Strip ── */}
      <div className="rest-intro-strip">
        <div className="rest-intro-strip-inner">
          {[
            { icon: 'clock', text: 'Breakfast 06:30–10:00' },
            { icon: 'clock', text: 'Lunch 12:00–15:00' },
            { icon: 'clock', text: 'Dinner 18:00–22:00' },
            { icon: 'bar', text: 'Bar Open Until 23:00' },
          ].map(({ icon, text }) => (
            <div className="rest-intro-item" key={text}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                {icon === 'clock' ? <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></> : <><path d="M17 11H3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h14"/><path d="M17 7H7a2 2 0 0 0-2 2v6"/><path d="M22 15V9a2 2 0 0 0-2-2h-3"/></>}
              </svg>
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* ── Menu Section ── */}
      <section className="rest-menu-section" id="rest-menu">
        <div className="hly-container">

          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="subtitle__one">Order From Our Menu</span>
            <h2>What Would You Like?</h2>
            <p className="hly-section-intro">Browse our menu, add items to your order, and place it directly with our kitchen via WhatsApp.</p>
          </div>

          {/* Tabs */}
          <div className="rest-menu-tabs" role="tablist">
            {TABS.map(({ key, label }) => (
              <button
                key={key}
                role="tab"
                aria-selected={activeTab === key}
                className={`rest-menu-tab${activeTab === key ? ' active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Cards grid */}
          <div className="rest-cards-grid">
            {MENU[activeTab].map((item) => {
              const qty = cart[item.id] || 0;
              return (
                <div className="rest-card" key={item.id}>
                  <div className="rest-card-img">
                    <img src={item.img} alt={item.name} loading="lazy" />
                    {item.badge && <span className="rest-card-badge">{item.badge}</span>}
                  </div>
                  <div className="rest-card-body">
                    <div className="rest-card-top">
                      <h4>{item.name}</h4>
                      <span className="rest-card-price">${item.price}</span>
                    </div>
                    <p>{item.description}</p>
                    <div className="rest-card-actions">
                      {qty === 0 ? (
                        <button className="rest-add-btn" onClick={() => add(item.id)} aria-label={`Add ${item.name} to order`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          Add to Order
                        </button>
                      ) : (
                        <div className="rest-qty-ctrl">
                          <button className="rest-qty-btn" onClick={() => remove(item.id)} aria-label="Decrease quantity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          </button>
                          <span className="rest-qty-count" aria-live="polite">{qty}</span>
                          <button className="rest-qty-btn" onClick={() => add(item.id)} aria-label="Increase quantity">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── Floating Order Button ── */}
      {totalItems > 0 && orderStep === 'menu' && (
        <button
          className="rest-float-btn"
          onClick={() => setOrderStep('review')}
          aria-label={`View your order — ${totalItems} item${totalItems > 1 ? 's' : ''}`}
        >
          <span className="rest-float-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span className="rest-float-badge">{totalItems}</span>
          </span>
          <span>View Order — <strong>${total}</strong></span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      )}

      {/* ── Order Review Overlay ── */}
      {orderStep === 'review' && (
        <div className="rest-overlay-bg" role="dialog" aria-modal="true" aria-label="Your order">
          <div className="rest-order-panel">
            <div className="rest-order-header">
              <h3>Your Order</h3>
              <button className="rest-order-close" onClick={() => setOrderStep('menu')} aria-label="Back to menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="rest-order-items">
              {cartItems.map(item => (
                <div className="rest-order-item" key={item.id}>
                  <img src={item.img} alt={item.name} />
                  <div className="rest-order-item-info">
                    <span className="rest-order-item-name">{item.name}</span>
                    <div className="rest-order-item-qty">
                      <button onClick={() => remove(item.id)} aria-label="Decrease">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <span>{cart[item.id]}</span>
                      <button onClick={() => add(item.id)} aria-label="Increase">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    </div>
                  </div>
                  <div className="rest-order-item-right">
                    <span className="rest-order-item-price">${item.price * cart[item.id]}</span>
                    <button className="rest-order-item-remove" onClick={() => clearItem(item.id)} aria-label={`Remove ${item.name}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="rest-order-total">
              <span>Total</span>
              <strong>${total}</strong>
            </div>

            {/* Guest details */}
            <div className="rest-order-fields">
              <div className="rest-order-field">
                <label htmlFor="ord-name">Your Name</label>
                <input id="ord-name" type="text" placeholder="e.g. John" value={guestName} onChange={e => setGuestName(e.target.value)} />
              </div>
              <div className="rest-order-field">
                <label htmlFor="ord-table">Room / Table No.</label>
                <input id="ord-table" type="text" placeholder="e.g. Room 7" value={tableNum} onChange={e => setTableNum(e.target.value)} />
              </div>
              <div className="rest-order-field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="ord-notes">Special Notes</label>
                <input id="ord-notes" type="text" placeholder="Allergies, dietary needs, spice level…" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>
            </div>

            <div className="rest-order-actions">
              {/* Add More Items */}
              <button className="rest-addmore-btn" onClick={() => setOrderStep('menu')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add More Items
              </button>
              {/* Place Order */}
              <button className="rest-place-btn" onClick={placeOrder}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M11.999 0C5.373 0 0 5.373 0 12c0 2.117.554 4.099 1.522 5.823L0 24l6.335-1.54C8.05 23.447 9.99 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                Place Order via WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order Confirmed ── */}
      {orderStep === 'confirmed' && (
        <div className="rest-overlay-bg" role="dialog" aria-modal="true" aria-label="Order confirmed">
          <div className="rest-order-panel rest-confirmed-panel">
            <div className="rest-confirmed-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
            </div>
            <h3>Order Sent!</h3>
            <p>Your order has been sent to our kitchen via WhatsApp. A team member will confirm it shortly.</p>
            <p style={{ color: 'var(--color-1)', fontSize: '0.88rem', marginTop: '0.5rem' }}>Need anything else? Start a new order below.</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '2rem' }}>
              <button className="rest-addmore-btn" onClick={resetOrder}>
                Start a New Order
              </button>
              <a href="tel:+250788395521" className="rest-place-btn" style={{ textDecoration: 'none' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.71-.71a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                Call the Restaurant
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── Hours & Info ── */}
      <section className="rest-hours-section">
        <div className="hly-container">
          <div className="rest-hours-grid">
            <div className="rest-hours-block">
              <span className="rest-hours-subtitle">Opening Hours</span>
              <h3>When We're Open</h3>
              <table className="rest-hours-table">
                <tbody>
                  <tr><td>Breakfast</td><td>06:30 – 10:00</td></tr>
                  <tr><td>Lunch</td><td>12:00 – 15:00</td></tr>
                  <tr><td>Dinner</td><td>18:00 – 22:00</td></tr>
                  <tr><td>Bar</td><td>11:00 – 23:00</td></tr>
                  <tr><td>Private Dining</td><td>By arrangement</td></tr>
                </tbody>
              </table>
              <a href="tel:+250788395521" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem', color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.9rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.71-.71a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                +250 788 395 521
              </a>
            </div>
            <div className="rest-reservation-block">
              <span className="rest-hours-subtitle">Dining Experience</span>
              <h3>The Akagera Table</h3>
              <p>Our restaurant draws inspiration from Rwanda's rich culinary heritage — fresh lake fish, garden-grown vegetables, and spice blends unique to the Eastern Province, all elevated with a modern touch.</p>
              <p style={{ marginTop: '1rem' }}>Whether you're starting the day with a full African breakfast before your safari, or enjoying a candlelit dinner under the stars, every meal is an experience in itself.</p>
              <a href="#rest-menu" className="theme-btn" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>
                Order Now
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
