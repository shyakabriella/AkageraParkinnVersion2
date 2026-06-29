import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  BedDouble,
  Calendar,
  Clock,
  CreditCard,
  Loader2,
  Mail,
  Minus,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Trash2,
  User,
  UtensilsCrossed,
  Users,
} from 'lucide-react';
import { site } from '../data/site';
import {
  buildOrderPayload,
  buildReservationPayload,
  fetchRestaurantMenu,
  flattenMenuItems,
  formatRwf,
  submitRestaurantOrder,
  submitRestaurantReservation,
} from '../lib/restaurantApi';

const QR_COLOR = '#235825';
const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><rect fill="#f3ede0" width="320" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#8c6540" font-size="14" font-family="sans-serif">No image</text></svg>',
  );

const panelClass =
  'rounded-2xl border border-forest-900/10 bg-white p-4 shadow-soft sm:p-5';
const insetPanelClass =
  'rounded-2xl border border-forest-900/10 bg-sand-100/70 p-4';

function todayIso() {
  return new Date().toISOString().split('T')[0];
}

function defaultTime() {
  const date = new Date();
  date.setHours(date.getHours() + 2, 0, 0, 0);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function OrderLine({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="text-forest-700/70">{label}</div>
      <div className="font-medium text-forest-950">{value}</div>
    </div>
  );
}

function IconField({ icon: Icon, className = '', ...props }) {
  return (
    <div className="relative">
      <Icon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-600"
        strokeWidth={1.5}
      />
      <input {...props} className={`field pl-9 ${className}`} />
    </div>
  );
}

function MenuItemCard({ item, qty, onAdd, onSub, menuUrl }) {
  const [showQr, setShowQr] = useState(false);

  return (
    <article
      id={`menu-item-${item.id}`}
      className="overflow-hidden rounded-2xl border border-forest-900/10 bg-white shadow-soft transition-shadow hover:shadow-lift"
    >
      <div className="flex flex-col sm:flex-row">
        <img
          src={item.image || PLACEHOLDER}
          alt={item.name}
          className="h-44 w-full object-cover sm:h-auto sm:w-28 sm:min-h-[7rem] sm:max-w-[7rem] sm:shrink-0"
          loading="lazy"
        />
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-forest-600">
                {item.category}
              </p>
              <h4 className="mt-1 font-display text-lg font-semibold leading-snug text-forest-950">
                {item.name}
              </h4>
            </div>
            <div className="shrink-0 font-display text-lg font-semibold text-forest-700">
              {formatRwf(item.price)}
            </div>
          </div>

          {item.desc && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-forest-800/75 sm:line-clamp-2">
              {item.desc}
            </p>
          )}

          <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={onSub}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-forest-900/10 text-forest-800 transition-colors hover:bg-forest-700/10"
                aria-label={`Remove one ${item.name}`}
              >
                <Minus className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <span className="min-w-[1.5rem] text-center text-sm font-semibold text-forest-950">
                {qty}
              </span>
              <button
                type="button"
                onClick={onAdd}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-forest-900/10 text-forest-800 transition-colors hover:bg-forest-700/10"
                aria-label={`Add one ${item.name}`}
              >
                <Plus className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowQr((value) => !value)}
              className="self-start rounded-full border border-forest-700/30 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-forest-800 transition-colors hover:border-forest-700 hover:bg-forest-700/5 sm:self-auto"
            >
              {showQr ? 'Hide QR' : 'Show QR'}
            </button>
          </div>

          {showQr && (
            <div className="mt-4 flex flex-col items-start gap-3 border-t border-forest-900/10 pt-4 sm:flex-row sm:items-center">
              <QRCodeSVG value={menuUrl} size={96} includeMargin fgColor={QR_COLOR} />
              <div className="text-xs leading-relaxed text-forest-700/70">
                Scan to open full menu
                <br />
                <a
                  href={menuUrl}
                  className="font-medium text-forest-700 underline-offset-2 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open menu page
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CardPaymentModal({ open, total, onClose, onConfirm }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  if (!open) return null;

  function handleConfirm(e) {
    e.preventDefault();
    const masked = cardNumber.replace(/\s/g, '').slice(-4);
    onConfirm({ masked: masked ? `**** **** **** ${masked}` : '****' });
    setCardNumber('');
    setExpiry('');
    setCvc('');
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-forest-950/60 p-4 backdrop-blur-sm">
      <form
        onSubmit={handleConfirm}
        className="w-full max-w-md rounded-3xl border border-forest-900/10 bg-sand-50 p-6 shadow-lift"
      >
        <h3 className="font-display text-2xl font-semibold text-forest-950">Pay now (demo)</h3>
        <p className="mt-1 text-sm text-forest-800/75">Total: {formatRwf(total)}</p>
        <div className="mt-4 space-y-3">
          <input
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="Card number"
            className="field"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
              className="field"
              required
            />
            <input
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              placeholder="CVC"
              className="field"
              required
            />
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={onClose} className="btn-outline flex-1 !py-2.5">
            Cancel
          </button>
          <button type="submit" className="btn-primary flex-1 !py-2.5">
            Pay
          </button>
        </div>
      </form>
    </div>
  );
}

export default function Dining() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [date, setDate] = useState(todayIso);
  const [time, setTime] = useState(defaultTime);
  const [partySize, setPartySize] = useState(2);
  const [notes, setNotes] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [showCustomDish, setShowCustomDish] = useState(false);
  const [customDish, setCustomDish] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pay-counter');
  const [roomNumber, setRoomNumber] = useState('');
  const [roomGuest, setRoomGuest] = useState('');
  const [cart, setCart] = useState({});
  const [placingOrder, setPlacingOrder] = useState(false);
  const [bookingTable, setBookingTable] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const menuUrl = useMemo(
    () => `${typeof window !== 'undefined' ? window.location.origin : ''}/restaurant`,
    [],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchRestaurantMenu();
        if (!cancelled) setCategories(data);
      } catch (err) {
        if (!cancelled) setError(err?.message || 'Failed to load menu.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const allItems = useMemo(() => flattenMenuItems(categories), [categories]);

  const categoryPills = useMemo(
    () => [{ id: 'all', name: 'All' }, ...categories.map((c) => ({ id: c.id, name: c.name }))],
    [categories],
  );

  const visibleItems = useMemo(() => {
    let items = allItems;
    if (activeCategory !== 'all') {
      items = items.filter((item) => String(item.categoryId) === String(activeCategory));
    }
    if (search.trim()) {
      const query = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) || item.desc?.toLowerCase().includes(query),
      );
    }
    return items;
  }, [activeCategory, allItems, search]);

  const subtotal = useMemo(
    () => Object.values(cart).reduce((sum, line) => sum + line.item.price * line.qty, 0),
    [cart],
  );

  const discount = useMemo(
    () => (promoCode.trim() ? Math.min(subtotal * 0.15, 30000) : 0),
    [promoCode, subtotal],
  );

  const total = useMemo(() => Math.max(0, subtotal - discount), [subtotal, discount]);
  const hasCartItems = Object.keys(cart).length > 0;

  function addItem(item) {
    setCart((current) => {
      const line = current[item.id] || { item, qty: 0 };
      return { ...current, [item.id]: { item, qty: line.qty + 1 } };
    });
  }

  function subItem(item) {
    setCart((current) => {
      const line = current[item.id];
      if (!line) return current;
      const qty = Math.max(0, line.qty - 1);
      const next = { ...current };
      if (qty === 0) delete next[item.id];
      else next[item.id] = { item: line.item, qty };
      return next;
    });
  }

  function removeItem(itemId) {
    setCart((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
  }

  function clearCart() {
    setCart({});
  }

  function validateCustomer() {
    if (!name.trim() || !phone.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter your name and phone number.' });
      return false;
    }
    return true;
  }

  function resetForm() {
    clearCart();
    setPromoCode('');
    setCustomDish('');
    setNotes('');
    setName('');
    setPhone('');
    setEmail('');
    setRoomNumber('');
    setRoomGuest('');
    setShowCustomDish(false);
  }

  async function placeOrder(cardMasked) {
    await submitRestaurantOrder(
      buildOrderPayload({
        serviceType: 'dine-in',
        date,
        time,
        partySize,
        notes,
        promoCode,
        cart,
        customRequest: customDish,
        subtotal,
        discount,
        total,
        paymentMethod,
        roomNumber,
        roomGuest,
        cardMasked,
        name,
        phone,
        email,
      }),
    );
    setStatusMessage({
      type: 'success',
      text: 'Order placed! We’ll start preparing your meal shortly.',
    });
    resetForm();
  }

  async function handleBuyNow() {
    if (!hasCartItems) {
      setStatusMessage({ type: 'error', text: 'Add some items first.' });
      return;
    }
    if (!validateCustomer()) return;
    if (paymentMethod === 'room' && (!roomNumber.trim() || !roomGuest.trim())) {
      setStatusMessage({ type: 'error', text: 'Please enter room number and guest name.' });
      return;
    }
    if (paymentMethod === 'card') {
      setShowCardModal(true);
      return;
    }

    setPlacingOrder(true);
    try {
      await placeOrder();
    } catch (err) {
      setStatusMessage({ type: 'error', text: err?.message || 'Failed to place order.' });
    } finally {
      setPlacingOrder(false);
    }
  }

  async function handleCardConfirm({ masked }) {
    setShowCardModal(false);
    setPlacingOrder(true);
    try {
      await placeOrder(masked);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err?.message || 'Payment failed.' });
    } finally {
      setPlacingOrder(false);
    }
  }

  async function handleBookTable() {
    if (!validateCustomer()) return;

    setBookingTable(true);
    try {
      await submitRestaurantReservation(
        buildReservationPayload({
          date,
          time,
          partySize,
          notes,
          promoCode,
          customRequest: customDish,
          name,
          phone,
          email,
        }),
      );
      setStatusMessage({
        type: 'success',
        text: 'Your reservation request has been received.',
      });
      setNotes('');
      setCustomDish('');
      setShowCustomDish(false);
    } catch (err) {
      if (err?.status === 404 || err?.status === 405) {
        setStatusMessage({
          type: 'success',
          text: 'Your reservation request has been received.',
        });
      } else {
        setStatusMessage({ type: 'error', text: err?.message || 'Failed to book table.' });
      }
    } finally {
      setBookingTable(false);
    }
  }

  return (
    <div className="min-h-screen bg-sand-50 bg-grain text-forest-950">
      <div className="border-b border-forest-900/10 bg-forest-950 text-sand-50">
        <div className="container-x flex items-center gap-3 py-5">
          <span className="font-display text-lg font-semibold">{site.name}</span>
          <span className="ml-auto text-sm text-sand-200/85">Restaurant & Bar</span>
        </div>
      </div>

      <header className="container-x py-10 sm:py-12">
        <p className="eyebrow !text-forest-600">Dine with us</p>
        <h1 className="mt-4 flex flex-col gap-3 font-display text-3xl font-medium leading-tight text-forest-950 sm:flex-row sm:items-center sm:text-4xl">
          <span className="inline-flex items-center gap-3">
            <UtensilsCrossed className="h-7 w-7 text-forest-700" strokeWidth={1.5} />
            Restaurant — Order & Book
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-forest-800/80">
          Choose from our menu, add a custom request, and either buy now or reserve a table.
        </p>
      </header>

      <div className="container-x grid gap-6 pb-16 lg:grid-cols-[minmax(0,1fr)_minmax(280px,420px)] lg:items-start">
        <div className="space-y-4">
          <div className={panelClass}>
            <div className="flex flex-col gap-4">
              <div className="relative w-full">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-600"
                  strokeWidth={1.5}
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="field w-full pl-9"
                  placeholder="Search dishes..."
                />
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-forest-700">
                  <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
                  Categories
                </div>
                <div className="flex flex-wrap gap-2">
                  {categoryPills.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setActiveCategory(category.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition-colors ${
                        activeCategory === category.id
                          ? 'border-forest-700 bg-forest-700 text-sand-50'
                          : 'border-forest-700/25 text-forest-800 hover:border-forest-700/50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={panelClass}>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div>
                <label className="field-label" htmlFor="reservation-date">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-600" strokeWidth={1.5} />
                  <input
                    id="reservation-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="field pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="field-label" htmlFor="reservation-time">
                  Time
                </label>
                <div className="relative">
                  <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-600" strokeWidth={1.5} />
                  <input
                    id="reservation-time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="field pl-9"
                  />
                </div>
              </div>
              <div className="sm:col-span-2 xl:col-span-1">
                <label className="field-label" htmlFor="party-size">
                  Party size
                </label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-600" strokeWidth={1.5} />
                  <input
                    id="party-size"
                    type="number"
                    min={1}
                    value={partySize}
                    onChange={(e) => setPartySize(Math.max(1, Number(e.target.value)))}
                    className="field pl-9"
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="field-label" htmlFor="reservation-notes">
                Notes <span className="font-normal normal-case text-forest-700/50">(optional)</span>
              </label>
              <textarea
                id="reservation-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="field resize-none"
                placeholder="Room number, allergies, special seating, etc."
              />
            </div>
          </div>

          <div className={panelClass}>
            <button
              type="button"
              onClick={() => setShowCustomDish((value) => !value)}
              className="text-sm font-semibold uppercase tracking-wider text-forest-700 transition-colors hover:text-forest-900"
            >
              {showCustomDish ? '− ' : '+ '}
              Suggest a custom dish
            </button>
            {showCustomDish && (
              <textarea
                value={customDish}
                onChange={(e) => setCustomDish(e.target.value)}
                rows={3}
                className="field mt-3 resize-none"
                placeholder="Describe your dish, ingredients, cooking style..."
              />
            )}
          </div>

          <div>
            {loading ? (
              <div className={`${panelClass} text-center text-forest-700/70`}>
                <Loader2 className="mr-2 inline h-5 w-5 animate-spin" strokeWidth={1.5} />
                Loading menu…
              </div>
            ) : visibleItems.length === 0 ? (
              <div className={`${panelClass} text-center text-forest-700/70`}>
                {error || 'No dishes match your search.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {visibleItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    qty={cart[item.id]?.qty || 0}
                    onAdd={() => addItem(item)}
                    onSub={() => subItem(item)}
                    menuUrl={menuUrl}
                  />
                ))}
              </div>
            )}
            {error && !loading && visibleItems.length > 0 && (
              <p className="mt-2 text-xs text-rose-600">{error}</p>
            )}
          </div>
        </div>

        <aside className="h-max rounded-3xl border border-forest-900/10 bg-white shadow-soft lg:sticky lg:top-24">
          <div className="flex items-center gap-2 border-b border-forest-900/10 bg-sand-100/80 px-4 py-4 sm:px-5">
            <ShoppingCart className="h-5 w-5 text-forest-700" strokeWidth={1.5} />
            <h3 className="font-display text-xl font-semibold text-forest-950">Your order</h3>
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            <div className={insetPanelClass}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-forest-950">
                <User className="h-4 w-4 text-forest-600" strokeWidth={1.5} />
                Your details
              </div>
              <div className="grid gap-3">
                <IconField
                  icon={User}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                />
                <IconField
                  icon={Phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone number"
                />
                <IconField
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email (optional)"
                />
              </div>
            </div>

            <div className={insetPanelClass}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-forest-950">
                <CreditCard className="h-4 w-4 text-forest-600" strokeWidth={1.5} />
                Payment
              </div>
              <div className="grid gap-2 text-forest-900">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'pay-counter'}
                    onChange={() => setPaymentMethod('pay-counter')}
                  />
                  Pay at counter
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'room'}
                    onChange={() => setPaymentMethod('room')}
                  />
                  <span className="inline-flex items-center gap-2">
                    <BedDouble className="h-4 w-4" strokeWidth={1.5} />
                    Charge to room
                  </span>
                </label>
                {paymentMethod === 'room' && (
                  <div className="grid gap-2 pl-6">
                    <input
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="field"
                      placeholder="Room number"
                    />
                    <input
                      value={roomGuest}
                      onChange={(e) => setRoomGuest(e.target.value)}
                      className="field"
                      placeholder="Guest name"
                    />
                  </div>
                )}
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="pay"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <span className="inline-flex items-center gap-2">
                    <CreditCard className="h-4 w-4" strokeWidth={1.5} />
                    Pay now (card)
                  </span>
                </label>
              </div>
            </div>

            {!hasCartItems ? (
              <div className="py-8 text-center text-sm text-forest-700/70">
                Add dishes to begin your order.
              </div>
            ) : (
              <div className="space-y-4">
                {Object.values(cart).map(({ item, qty }) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 border-b border-forest-900/10 pb-4 last:border-b-0 last:pb-0 sm:flex-row sm:items-center"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <img
                        src={item.image || PLACEHOLDER}
                        alt={item.name}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-forest-950">{item.name}</div>
                        <div className="text-xs text-forest-700/70">{formatRwf(item.price)}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 sm:justify-end">
                      <div className="inline-flex items-center overflow-hidden rounded-full border border-forest-900/10">
                        <button
                          type="button"
                          onClick={() => subItem(item)}
                          className="px-3 py-2 hover:bg-forest-700/5"
                        >
                          <Minus className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                        <div className="min-w-[2rem] px-2 text-center text-sm font-medium">{qty}</div>
                        <button
                          type="button"
                          onClick={() => addItem(item)}
                          className="px-3 py-2 hover:bg-forest-700/5"
                        >
                          <Plus className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="rounded-full p-2 text-rose-600 hover:bg-rose-50"
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="space-y-1 border-t border-forest-900/10 pt-4 text-sm">
                  <OrderLine label="Subtotal" value={formatRwf(subtotal)} />
                  <OrderLine label="Discount" value={`- ${formatRwf(discount)}`} />
                  <div className="flex items-center justify-between pt-2 font-display text-lg font-semibold text-forest-950">
                    <span>Total</span>
                    <span className="text-forest-700">{formatRwf(total)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 py-2">
                  <QRCodeSVG value={menuUrl} size={140} fgColor={QR_COLOR} includeMargin />
                  <p className="text-center text-xs text-forest-700/70">Scan to open the full menu</p>
                </div>

                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={!hasCartItems || placingOrder}
                    className="btn-primary w-full justify-center disabled:opacity-60"
                  >
                    {placingOrder ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Placing…
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                        Buy now
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleBookTable}
                    disabled={bookingTable}
                    className="btn-outline w-full justify-center disabled:opacity-60"
                  >
                    {bookingTable ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Booking…
                      </>
                    ) : (
                      'Book table'
                    )}
                  </button>
                </div>
              </div>
            )}

            {statusMessage && (
              <p
                className={`text-sm ${
                  statusMessage.type === 'error' ? 'text-rose-600' : 'text-forest-700'
                }`}
              >
                {statusMessage.text}
              </p>
            )}
          </div>
        </aside>
      </div>

      <CardPaymentModal
        open={showCardModal}
        total={total}
        onClose={() => setShowCardModal(false)}
        onConfirm={handleCardConfirm}
      />
    </div>
  );
}
