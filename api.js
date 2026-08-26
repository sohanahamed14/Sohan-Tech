// ==========================================================
// SOHAN TECH — Frontend API Client (MySQL Backend Connector)
// Automatically connects to local XAMPP backend endpoints
// ==========================================================

const API = (function () {
  // Session ID for guest cart tracking
  let sessionId = localStorage.getItem('st_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('st_session_id', sessionId);
  }

  // Smart API base: works on localhost (XAMPP) and Vercel (static, no backend)
  let apiBase = '';

  async function detectApiBase() {
    if (apiBase) return apiBase;

    const host = window.location.hostname;
    const isLocal = (host === 'localhost' || host === '127.0.0.1');

    if (!isLocal) {
      // On Vercel / production — no PHP backend available
      // All data is stored in IndexedDB only
      apiBase = '__NO_BACKEND__';
      return apiBase;
    }

    // On localhost — try XAMPP backend
    const candidates = [
      'http://localhost/SOHAN%20TECH/backend',
      'http://localhost/SOHAN TECH/backend',
      'http://localhost/sohan_tech/backend',
      'http://127.0.0.1/SOHAN%20TECH/backend',
      'backend',
      './backend'
    ];

    for (const base of candidates) {
      try {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), 1500);
        const res = await fetch(`${base}/install.php`, { method: 'GET', signal: controller.signal });
        clearTimeout(id);
        if (res.ok) {
          apiBase = base;
          console.log('✅ SOHAN TECH API connected at:', apiBase);
          return apiBase;
        }
      } catch(e) { /* try next */ }
    }

    // Fallback — no backend found
    apiBase = '__NO_BACKEND__';
    console.warn('⚠️ No XAMPP backend found. Using IndexedDB only.');
    return apiBase;
  }

  // Token management
  function getToken() {
    return localStorage.getItem('st_token') || '';
  }

  function setToken(token) {
    if (token) localStorage.setItem('st_token', token);
    else localStorage.removeItem('st_token');
  }

  function getUser() {
    try {
      return JSON.parse(localStorage.getItem('st_user') || 'null');
    } catch (e) {
      return null;
    }
  }

  function setUser(user) {
    if (user) localStorage.setItem('st_user', JSON.stringify(user));
    else localStorage.removeItem('st_user');
  }

  // Generic Request Helper
  async function request(endpoint, method = 'GET', data = null) {
    const base = await detectApiBase();

    // No backend available (Vercel / static deployment)
    if (base === '__NO_BACKEND__') {
      throw new Error('No backend available — using offline mode');
    }

    const url = `${base}/${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      'X-Session-Id': sessionId
    };

    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      method,
      headers
    };

    if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      options.body = JSON.stringify({ ...data, session_id: sessionId });
    }

    try {
      const response = await fetch(url, options);
      let json;
      try {
        json = await response.json();
      } catch (parseErr) {
        throw new Error(`Server returned status ${response.status} (${response.statusText})`);
      }

      if (!response.ok || json.success === false) {
        // Extract descriptive validation error if present
        let errMessage = json.message || 'API request failed';
        if (json.data && Array.isArray(json.data.errors) && json.data.errors.length > 0) {
          errMessage = json.data.errors.join(' • ');
        }
        const error = new Error(errMessage);
        error.errors = json.data?.errors || [];
        error.status = response.status;
        throw error;
      }
      return json;
    } catch (err) {
      console.warn(`API Error [${endpoint}]:`, err.message);
      throw err;
    }
  }

  return {
    getSessionId: () => sessionId,
    getToken,
    getUser,
    // Fixed: Also check if cached session could be expired (client-side heuristic)
    isLoggedIn: () => {
      const token = getToken();
      const user = getUser();
      if (!token || !user) return false;
      // Check login timestamp if available (30-day expiry)
      const loginTs = parseInt(localStorage.getItem('st_login_ts') || '0', 10);
      if (loginTs && (Date.now() - loginTs) > 30 * 24 * 60 * 60 * 1000) {
        // Token likely expired — clear and return false
        setToken(null);
        setUser(null);
        localStorage.removeItem('st_login_ts');
        return false;
      }
      return true;
    },

    // --- AUTH ---
    async register(name, email, phone, password, address = '', city = 'Dhaka') {
      const res = await request('api/auth/register.php', 'POST', { name, email, phone, password, address, city });
      if (res.data?.token) { setToken(res.data.token); localStorage.setItem('st_login_ts', String(Date.now())); }
      if (res.data?.user) setUser(res.data.user);
      return res;
    },

    async login(identifier, password) {
      const res = await request('api/auth/login.php', 'POST', { identifier, password });
      if (res.data?.token) { setToken(res.data.token); localStorage.setItem('st_login_ts', String(Date.now())); }
      if (res.data?.user) setUser(res.data.user);
      return res;
    },

    async logout() {
      try {
        await request('api/auth/logout.php', 'POST');
      } catch (e) {}
      setToken(null);
      setUser(null);
      localStorage.removeItem('st_login_ts');
    },

    async getMe() {
      const res = await request('api/auth/me.php', 'GET');
      if (res.data?.user) setUser(res.data.user);
      return res.data;
    },

    async updateProfile(updates) {
      const res = await request('api/auth/update_profile.php', 'POST', updates);
      if (res.data?.user) setUser(res.data.user);
      return res;
    },

    async getUsers(query = '') {
      return await request(`api/auth/users.php?q=${encodeURIComponent(query)}`, 'GET');
    },

    // --- CART (MySQL Persistent Storage) ---
    async getCart() {
      return await request(`api/cart/get.php?session_id=${encodeURIComponent(sessionId)}`, 'GET');
    },

    async addToCart(product, qty = 1) {
      return await request('api/cart/add.php', 'POST', {
        id: product.id,
        name: product.name,
        brand: product.brand || '',
        price: product.price,
        oldPrice: product.old || product.oldPrice || null,
        qty: qty,
        emoji: product.emoji || '🛍️',
        img: product.img || null,
        category: product.category || 'general'
      });
    },

    async updateCartQty(productId, qty) {
      return await request('api/cart/update.php', 'POST', { product_id: productId, qty });
    },

    async removeFromCart(productId) {
      return await request('api/cart/remove.php', 'POST', { product_id: productId });
    },

    async clearCart() {
      return await request('api/cart/clear.php', 'POST');
    },

    async syncCart(items, replace = false) {
      return await request('api/cart/sync.php', 'POST', { items, replace });
    },

    // --- ORDERS (MySQL Persistent Storage) ---
    async createOrder(orderPayload) {
      return await request('api/orders/create.php', 'POST', orderPayload);
    },

    async getOrders(options = '') {
      let query = '';
      if (typeof options === 'string') {
        if (options) query = `?phone=${encodeURIComponent(options)}`;
      } else if (typeof options === 'object' && options !== null) {
        const params = new URLSearchParams();
        if (options.phone) params.set('phone', options.phone);
        if (options.ids) params.set('ids', Array.isArray(options.ids) ? options.ids.join(',') : options.ids);
        if (options.all) params.set('all', '1');
        if (options.q) params.set('q', options.q);
        const str = params.toString();
        if (str) query = `?${str}`;
      }
      return await request(`api/orders/list.php${query}`, 'GET');
    },

    async getOrder(orderId) {
      return await request(`api/orders/get.php?order_id=${encodeURIComponent(orderId)}`, 'GET');
    },

    // --- NEWSLETTER (Stay in the Loop - MySQL Storage) ---
    async subscribeNewsletter(email, source = 'homepage_stay_in_the_loop') {
      return await request('api/newsletter/subscribe.php', 'POST', { email, source });
    },

    async getNewsletterSubscribers() {
      return await request('api/newsletter/list.php', 'GET');
    },

    async checkHealth() {
      try {
        const base = await detectApiBase();
        const res = await fetch(`${base}/install.php`);
        return await res.json();
      } catch(e) {
        return { success: false, message: e.message };
      }
    }
  };
})();

// Auto-detect base on load (only fetch profile if logged in)
if (API.isLoggedIn()) {
  API.getMe().catch(() => {});
}
