import { site } from '../data/site';

const API = `${site.apiBase}/api`;

function resolveImageUrl(imageUrl, imagePath) {
  const raw = imageUrl || imagePath || '';
  if (!raw) return '';
  if (raw.startsWith('http')) return raw;
  return `${site.apiBase}/storage/${raw.replace(/^\//, '')}`;
}

function normalizeItems(items, category) {
  const list = Array.isArray(items?.data) ? items.data : Array.isArray(items) ? items : [];

  return list.map((item) => ({
    id: item.id,
    name: item.name,
    price: Number(item.price || 0),
    desc: item.description || '',
    image: resolveImageUrl(item.image_url, item.image_path),
    category: item?.category?.name || category.name,
    categoryId: String(category.id),
    is_available: item.is_available !== false,
    available: Number(item.available ?? 0),
  }));
}

export async function fetchRestaurantMenu() {
  const categoriesRes = await fetch(`${API}/categories?sort=position&dir=asc`, {
    headers: { Accept: 'application/json' },
  });
  if (!categoriesRes.ok) {
    throw new Error('Failed to load menu');
  }

  const categoriesJson = await categoriesRes.json();
  const categories = Array.isArray(categoriesJson?.data)
    ? categoriesJson.data
    : Array.isArray(categoriesJson)
      ? categoriesJson
      : [];

  if (!categories.length) return [];

  const groups = await Promise.all(
    categories.map(async (category) => {
      const params = new URLSearchParams({
        include: 'category',
        with_stock: '1',
      });
      const itemsRes = await fetch(`${API}/categories/${category.id}/items?${params}`, {
        headers: { Accept: 'application/json' },
      });
      if (!itemsRes.ok) {
        return { id: String(category.id), name: category.name, items: [] };
      }
      const itemsJson = await itemsRes.json();
      return {
        id: String(category.id),
        name: category.name,
        items: normalizeItems(itemsJson, category),
      };
    }),
  );

  return groups;
}

export function flattenMenuItems(categories) {
  return categories.flatMap((category) =>
    category.items.map((item) => ({
      ...item,
      categoryId: category.id,
      categoryName: category.name,
    })),
  );
}

export function formatRwf(price) {
  return `RWF ${Number(price || 0).toFixed(2)}`;
}

async function postToFirst(urls, body) {
  let lastError;
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (res.ok) return res.json();
      const data = await res.json().catch(() => ({}));
      lastError = new Error(data.message || 'Request failed');
      lastError.status = res.status;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError ?? new Error('Request failed');
}

export function buildOrderPayload({
  serviceType,
  date,
  time,
  partySize,
  notes,
  promoCode,
  cart,
  customRequest,
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
}) {
  const paymentMap = {
    'pay-counter': 'cash',
    room: 'room',
    card: 'card',
  };
  const method = paymentMap[paymentMethod] || 'cash';
  let reference = null;
  if (method === 'room') {
    reference = `Room ${roomNumber?.trim() || '?'} — ${roomGuest?.trim() || 'Guest'}`;
  } else if (method === 'card' && cardMasked) {
    reference = cardMasked;
  }

  return {
    service_type: serviceType,
    schedule: { date, time },
    party_size: Math.max(1, Number(partySize) || 1),
    notes: notes?.trim() || null,
    promo_code: promoCode?.trim() || null,
    items: Object.values(cart).map(({ item, qty }) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty,
    })),
    custom_request: customRequest?.trim() || null,
    totals: { subtotal, discount, total },
    payment: {
      method,
      amount: method === 'cash' ? 0 : total,
      reference,
      processor: method === 'card' ? 'demo' : null,
    },
    customer: {
      name: name?.trim() || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
    },
    customer_name: name?.trim() || null,
    customer_phone: phone?.trim() || null,
    customer_email: email?.trim() || null,
    source: 'public',
  };
}

export function buildReservationPayload({
  date,
  time,
  partySize,
  notes,
  promoCode,
  customRequest,
  name,
  phone,
  email,
}) {
  return {
    date,
    time,
    party_size: Math.max(1, Number(partySize) || 1),
    notes: notes?.trim() || null,
    promo_code: promoCode?.trim() || null,
    custom_request: customRequest?.trim() || null,
    customer: {
      name: name?.trim() || null,
      phone: phone?.trim() || null,
      email: email?.trim() || null,
    },
    customer_name: name?.trim() || null,
    customer_phone: phone?.trim() || null,
    customer_email: email?.trim() || null,
    source: 'public',
  };
}

export function submitRestaurantOrder(payload) {
  return postToFirst(
    [`${API}/restaurant/orders/public`, `${API}/restaurant/orders`],
    payload,
  );
}

export function submitRestaurantReservation(payload) {
  return postToFirst(
    [`${API}/restaurant/reservations/public`, `${API}/restaurant/reservations`],
    payload,
  );
}
