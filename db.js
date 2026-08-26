// ===== SOHAN TECH — IndexedDB Database Engine =====
// Provides persistent client-side storage for cart, orders, and customers.

const DB_NAME = 'SohanTechDB';
const DB_VERSION = 1;
let db = null;

// ===== LOCAL TIME HELPER =====
// Returns ISO 8601 string in the user's LOCAL timezone (e.g. 2026-08-22T21:55:00+06:00)
// instead of UTC (toISOString gives Z suffix which mismatches MySQL server time)
function localISOString(date) {
  const d = date || new Date();
  const pad = (n, len = 2) => String(n).padStart(len, '0');
  const offset = -d.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const absOff = Math.abs(offset);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
    'T' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) +
    sign + pad(Math.floor(absOff / 60)) + ':' + pad(absOff % 60);
}

// ===== OPEN / INIT =====
function openDB() {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const database = e.target.result;

      // Cart store — keyed by product id
      if (!database.objectStoreNames.contains('cart')) {
        const cartStore = database.createObjectStore('cart', { keyPath: 'id' });
        cartStore.createIndex('brand', 'brand', { unique: false });
        cartStore.createIndex('category', 'category', { unique: false });
        cartStore.createIndex('addedAt', 'addedAt', { unique: false });
      }

      // Orders store — auto-increment key
      if (!database.objectStoreNames.contains('orders')) {
        const orderStore = database.createObjectStore('orders', { keyPath: 'orderId' });
        orderStore.createIndex('createdAt', 'createdAt', { unique: false });
        orderStore.createIndex('customerPhone', 'customer.phone', { unique: false });
      }

      // Customers store — keyed by phone
      if (!database.objectStoreNames.contains('customers')) {
        const custStore = database.createObjectStore('customers', { keyPath: 'phone' });
        custStore.createIndex('name', 'name', { unique: false });
        custStore.createIndex('email', 'email', { unique: false });
      }
    };

    req.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };

    req.onerror = (e) => {
      console.error('IndexedDB error:', e.target.error);
      reject(e.target.error);
    };
  });
}

// ===== GENERIC HELPERS =====
// Fixed: Removed `new Promise(async ...)` anti-pattern — now proper async functions
function getStore(storeName, mode = 'readonly') {
  const tx = db.transaction(storeName, mode);
  return tx.objectStore(storeName);
}

function _idbRequest(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function dbGetAll(storeName) {
  await openDB();
  return _idbRequest(getStore(storeName).getAll());
}

async function dbGet(storeName, key) {
  await openDB();
  return _idbRequest(getStore(storeName).get(key));
}

async function dbPut(storeName, data) {
  await openDB();
  return _idbRequest(getStore(storeName, 'readwrite').put(data));
}

async function dbDelete(storeName, key) {
  await openDB();
  return _idbRequest(getStore(storeName, 'readwrite').delete(key));
}

async function dbClear(storeName) {
  await openDB();
  return _idbRequest(getStore(storeName, 'readwrite').clear());
}

async function dbCount(storeName) {
  await openDB();
  return _idbRequest(getStore(storeName).count());
}

// ===== CART OPERATIONS =====

// Find full product details from PRODUCTS data (by ID or exact Name)
function findProduct(productIdOrName) {
  if (typeof PRODUCTS === 'undefined' || !productIdOrName) return null;
  for (const [category, items] of Object.entries(PRODUCTS)) {
    const found = items.find(p => p.id === productIdOrName || p.name === productIdOrName);
    if (found) return { ...found, category };
  }
  return null;
}

async function dbAddToCart(productId, name, price, emoji = '🛍️', qty = 1) {
  await openDB();
  // Resolve product from catalog
  const product = findProduct(productId) || (name && name !== productId ? findProduct(name) : null);
  const resolvedId = product ? product.id : (productId || 'item_' + Date.now());
  const existing = await dbGet('cart', resolvedId);
  const now = localISOString();

  let cartItem;
  if (existing) {
    existing.qty += qty;
    existing.updatedAt = now;
    await dbPut('cart', existing);
    cartItem = existing;
  } else {
    cartItem = product ? {
      id: product.id,
      brand: product.brand,
      name: product.name,
      desc: product.desc,
      price: product.price,
      oldPrice: product.old || null,
      qty: qty,
      emoji: product.emoji || emoji,
      img: product.img || null,
      bg: product.bg,
      category: product.category,
      rating: product.rating,
      reviews: product.reviews,
      badge: product.badge,
      addedAt: now,
      updatedAt: now
    } : {
      id: resolvedId,
      brand: '',
      name: name || 'Product',
      desc: '',
      price: price || 0,
      oldPrice: null,
      qty: qty,
      emoji: emoji,
      img: null,
      bg: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
      category: 'general',
      rating: 0,
      reviews: 0,
      badge: '',
      addedAt: now,
      updatedAt: now
    };

    await dbPut('cart', cartItem);
  }

  // Persist to MySQL database in background
  if (typeof API !== 'undefined') {
    API.addToCart(cartItem, qty).catch(err => console.warn('MySQL cart sync notice:', err.message));
  }

  return cartItem;
}

async function dbRemoveFromCart(productId) {
  await dbDelete('cart', productId);
  if (typeof API !== 'undefined') {
    API.removeFromCart(productId).catch(err => console.warn('MySQL cart remove notice:', err.message));
  }
}

async function dbUpdateCartQty(productId, newQty) {
  const item = await dbGet('cart', productId);
  if (!item) return;
  if (newQty <= 0) {
    await dbDelete('cart', productId);
    if (typeof API !== 'undefined') {
      API.removeFromCart(productId).catch(err => console.warn('MySQL cart remove notice:', err.message));
    }
  } else {
    item.qty = newQty;
    item.updatedAt = localISOString();
    await dbPut('cart', item);
    if (typeof API !== 'undefined') {
      API.updateCartQty(productId, newQty).catch(err => console.warn('MySQL cart update notice:', err.message));
    }
  }
}

async function dbGetCart() {
  return await dbGetAll('cart');
}

async function dbClearCart() {
  await dbClear('cart');
  if (typeof API !== 'undefined') {
    API.clearCart().catch(err => console.warn('MySQL cart clear notice:', err.message));
  }
}

async function dbGetCartTotal() {
  const items = await dbGetCart();
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const savings = items.reduce((sum, item) => {
    if (item.oldPrice) return sum + ((item.oldPrice - item.price) * item.qty);
    return sum;
  }, 0);
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const shipping = subtotal >= 5000 || count === 0 ? 0 : 99;
  const total = subtotal + shipping;
  return { subtotal, savings, count, shipping, total, items };
}

// ===== ORDER OPERATIONS =====

// Fixed: Uses random suffix instead of COUNT-based sequence to avoid race conditions
async function generateOrderId() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  const ts = now.getMilliseconds().toString().padStart(3, '0');
  return `ST-${date}-${rand}${ts}`;
}

async function dbCreateOrder(customerInfo, paymentMethod) {
  const cartData = await dbGetCartTotal();
  if (cartData.items.length === 0) throw new Error('Cart is empty');

  const orderId = await generateOrderId();
  const now = localISOString();
  const order = {
    orderId: orderId,
    items: cartData.items.map(item => ({
      id: item.id,
      brand: item.brand || '',
      name: item.name,
      desc: item.desc || '',
      price: item.price,
      oldPrice: item.oldPrice || null,
      qty: item.qty,
      emoji: item.emoji || '🛍️',
      img: item.img || null,
      category: item.category || 'general'
    })),
    customer: {
      name: customerInfo.name || 'Customer',
      phone: customerInfo.phone || '',
      email: customerInfo.email || '',
      address: customerInfo.address || '',
      city: customerInfo.city || 'Dhaka',
      note: customerInfo.note || ''
    },
    subtotal: cartData.subtotal,
    shipping: cartData.shipping,
    savings: cartData.savings,
    total: cartData.total,
    paymentMethod: paymentMethod || 'cod',
    createdAt: now,
    updatedAt: now
  };

  // 1. Save to local IndexedDB first
  await dbPut('orders', order);

  // 2. Save customer info for future auto-fill
  if (customerInfo.phone) {
    try {
      await dbPut('customers', {
        phone: customerInfo.phone,
        name: customerInfo.name || '',
        email: customerInfo.email || '',
        address: customerInfo.address || '',
        city: customerInfo.city || '',
        lastOrderAt: now
      });
    } catch(err) {}
  }

  // 3. Save to MySQL database FIRST (before clearing cart)
  if (typeof API !== 'undefined') {
    try {
      const res = await API.createOrder(order);
      console.log('✅ Order saved to MySQL database (Sohan_Tech_db):', order.orderId);
      // If server returned a different orderId (collision fix), update local copy
      if (res && res.data && res.data.orderId && res.data.orderId !== order.orderId) {
        const oldId = order.orderId;
        order.orderId = res.data.orderId;
        await dbDelete('orders', oldId);
        await dbPut('orders', order);
      }
    } catch (err) {
      console.warn('MySQL order save notice:', err.message);
      // Order is still saved locally in IndexedDB—will show in Orders page
    }
  }

  // 4. Clear local cart AFTER MySQL save succeeds
  await dbClearCart();

  return order;
}

async function dbGetOrders(forcePhone = '') {
  await openDB();
  const localOrders = await dbGetAll('orders');
  const localIds = localOrders.map(o => o.orderId).filter(Boolean);

  // If API available, fetch fresh live status from MySQL database
  if (typeof API !== 'undefined') {
    try {
      const user = API.getUser();
      const phone = forcePhone || user?.phone || (await dbGetLastCustomer())?.phone || '';
      
      const queryOptions = {};
      if (user?.role === 'admin') {
        queryOptions.all = 1;
      } else if (phone) {
        queryOptions.phone = phone;
      }
      if (localIds.length > 0) {
        queryOptions.ids = localIds;
      }

      // If we have any criteria to search (user logged in, phone, or local orders)
      if (user || phone || localIds.length > 0) {
        const res = await API.getOrders(queryOptions);
        if (res && res.data?.orders && Array.isArray(res.data.orders)) {
          for (const ord of res.data.orders) {
            // Update / overwrite with live data from MySQL
            await dbPut('orders', ord);
          }
        }
      }
    } catch(e) {
      console.warn('MySQL live orders sync note:', e.message);
    }
  }

  const updatedOrders = await dbGetAll('orders');
  return updatedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function dbGetOrder(orderId) {
  await openDB();
  // Try live fetch from MySQL first for latest data
  if (typeof API !== 'undefined') {
    try {
      const res = await API.getOrder(orderId);
      if (res && res.data?.order) {
        await dbPut('orders', res.data.order);
        return res.data.order;
      }
    } catch(e) {}
  }
  return await dbGet('orders', orderId);
}


// Live database sync function for periodic polling
async function dbSyncOrdersWithMySQL() {
  return await dbGetOrders();
}

// ===== CUSTOMER OPERATIONS =====

async function dbGetCustomer(phone) {
  return await dbGet('customers', phone);
}

async function dbGetLastCustomer() {
  const customers = await dbGetAll('customers');
  if (customers.length === 0) return null;
  return customers.sort((a, b) => new Date(b.lastOrderAt) - new Date(a.lastOrderAt))[0];
}

// ===== MIGRATION: Import existing localStorage cart =====
async function migrateLocalStorageCart() {
  try {
    const old = JSON.parse(localStorage.getItem('st_cart') || '[]');
    if (old.length === 0) return;

    await openDB();

    for (const item of old) {
      // Try to find the product in PRODUCTS by name
      let productId = null;
      if (typeof PRODUCTS !== 'undefined') {
        for (const [cat, items] of Object.entries(PRODUCTS)) {
          const found = items.find(p => p.name === item.name);
          if (found) { productId = found.id; break; }
        }
      }

      if (productId) {
        await dbAddToCart(productId, item.name, item.price, item.emoji, item.qty);
      } else {
        // Create a fallback entry
        const fallbackId = 'legacy_' + item.name.toLowerCase().replace(/\s+/g, '_');
        await dbAddToCart(fallbackId, item.name, item.price, item.emoji, item.qty);
      }
    }

    // Clear old localStorage cart after migration
    localStorage.removeItem('st_cart');
    console.log('✅ Migrated', old.length, 'cart items from localStorage to IndexedDB');
  } catch (e) {
    console.warn('Cart migration skipped:', e);
  }
}

// Synchronize IndexedDB cart to MySQL database
async function syncCartWithMySQL() {
  if (typeof API === 'undefined') return;
  try {
    const localItems = await dbGetCart();
    if (localItems.length > 0) {
      await API.syncCart(localItems, false);
      console.log('✅ Cart synchronized with MySQL database (cart_items table)');
    }
  } catch (e) {
    console.warn('Cart sync notice:', e.message);
  }
}

// Init DB on load
openDB().then(async () => {
  console.log('✅ SohanTechDB ready');
  await migrateLocalStorageCart();
  await syncCartWithMySQL();
}).catch(err => {
  console.error('❌ DB init failed:', err);
});
