// ==========================================================
// SOHAN TECH — Frontend API Client (Supabase Backend)
// Online mode — no XAMPP/PHP needed
// ==========================================================
// SECURITY NOTE: This anon key is public by design (Supabase's model).
// Row Level Security (RLS) MUST be enabled on all tables in Supabase
// to prevent unauthorized data access. See backend/supabase_rls.sql.
// ==========================================================

const SUPABASE_URL = 'https://jcbuqexnysxahbfwaciu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjYnVxZXhueXN4YWhiZndhY2l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MTI5MzgsImV4cCI6MjEwMzI4ODkzOH0.oFP4j1xjCXFyw6szYyzdBDpqLJNIFtXw4jAGdbbGX7c';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const API = (function () {
  // Session ID for guest cart tracking
  let sessionId = localStorage.getItem('st_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('st_session_id', sessionId);
  }

  // --- Internal helpers ---
  function getToken() {
    return localStorage.getItem('st_token') || '';
  }
  function setToken(token) {
    if (token) localStorage.setItem('st_token', token);
    else localStorage.removeItem('st_token');
  }
  function getUser() {
    try { return JSON.parse(localStorage.getItem('st_user') || 'null'); }
    catch (e) { return null; }
  }
  function setUser(user) {
    if (user) localStorage.setItem('st_user', JSON.stringify(user));
    else localStorage.removeItem('st_user');
  }

  return {
    getSessionId: () => sessionId,
    getToken,
    getUser,

    isLoggedIn: () => {
      const token = getToken();
      const user = getUser();
      if (!token || !user) return false;
      const loginTs = parseInt(localStorage.getItem('st_login_ts') || '0', 10);
      if (loginTs && (Date.now() - loginTs) > 30 * 24 * 60 * 60 * 1000) {
        setToken(null); setUser(null); localStorage.removeItem('st_login_ts');
        return false;
      }
      return true;
    },

    // --- Password hashing (SHA-256 via Web Crypto) ---
    // SECURITY NOTE: For production, migrate to server-side hashing
    // (bcrypt/argon2) via a Supabase Edge Function.
    async _hashPassword(password) {
      const encoder = new TextEncoder();
      const salt = 'ST_' + password.length + '_sohantech_v2_' + (password.charCodeAt(0) || 0);
      const data = encoder.encode(password + salt);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    // --- AUTH (Direct Database — no email confirmation needed) ---
    async register(name, email, phone, password, address = '', city = 'Dhaka') {
      // Check if email already exists
      const { data: existing } = await _supabase.from('users').select('id').eq('email', email.toLowerCase().trim()).limit(1);
      if (existing && existing.length > 0) throw new Error('An account with this email already exists.');

      // Check if phone already exists
      if (phone) {
        const { data: phoneExists } = await _supabase.from('users').select('id').eq('phone', phone).limit(1);
        if (phoneExists && phoneExists.length > 0) throw new Error('An account with this phone number already exists.');
      }

      const hashedPw = await this._hashPassword(password);
      const token = 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

      const { data: inserted, error } = await _supabase.from('users').insert({
        name, email, phone: phone || null, password: hashedPw,
        role: 'user', address: address || null, city
      }).select();

      if (error) throw new Error(error.message || 'Registration failed');

      const row = inserted[0];
      const user = { id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role, city: row.city, address: row.address };

      // Store session token
      await _supabase.from('user_sessions').insert({
        user_id: row.id, token,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      setToken(token);
      setUser(user);
      localStorage.setItem('st_login_ts', String(Date.now()));
      return { success: true, data: { user, token }, message: 'Registration successful!' };
    },

    async login(identifier, password) {
      const hashedPw = await this._hashPassword(password);

      // Try email first, then phone
      const USER_FIELDS = 'id,name,email,phone,role,city,address';
      let query;
      if (identifier.includes('@')) {
        query = _supabase.from('users').select(USER_FIELDS + ',password').eq('email', identifier.toLowerCase().trim()).eq('password', hashedPw).limit(1);
      } else {
        // Phone number login — use safe .eq() instead of .or() template to prevent filter injection
        const cleanPhone = identifier.replace(/[^0-9+]/g, '');
        query = _supabase.from('users').select(USER_FIELDS + ',password').eq('phone', cleanPhone).eq('password', hashedPw).limit(1);
      }

      const { data: rows, error } = await query;
      if (error) throw new Error(error.message);
      if (!rows || rows.length === 0) throw new Error('Invalid email/phone or password.');

      const row = rows[0];
      const user = { id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role, city: row.city, address: row.address };
      const token = 'tok_' + Math.random().toString(36).substring(2) + Date.now().toString(36);

      await _supabase.from('user_sessions').insert({
        user_id: row.id, token,
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      setToken(token);
      setUser(user);
      localStorage.setItem('st_login_ts', String(Date.now()));
      return { success: true, data: { user, token }, message: 'Login successful!' };
    },

    async logout() {
      const token = getToken();
      if (token) {
        try { await _supabase.from('user_sessions').delete().eq('token', token); } catch(e) {}
      }
      setToken(null);
      setUser(null);
      localStorage.removeItem('st_login_ts');
    },

    async getMe() {
      const token = getToken();
      if (!token) throw new Error('Not authenticated');

      const { data: sessions } = await _supabase.from('user_sessions')
        .select('user_id').eq('token', token).limit(1);
      if (!sessions || sessions.length === 0) throw new Error('Session expired');

      const { data: rows } = await _supabase.from('users')
        .select('id,name,email,phone,role,city,address').eq('id', sessions[0].user_id).limit(1);
      if (!rows || rows.length === 0) throw new Error('User not found');

      const row = rows[0];
      const user = { id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role, city: row.city, address: row.address };
      setUser(user);
      return { user };
    },

    async updateProfile(updates) {
      const user = getUser();
      if (!user) throw new Error('Not logged in');
      // Never allow password/role update through this endpoint
      const safeUpdates = { ...updates };
      delete safeUpdates.password;
      delete safeUpdates.role;
      const { data, error } = await _supabase.from('users').update(safeUpdates).eq('id', user.id).select('id,name,email,phone,role,city,address');
      if (error) throw new Error(error.message);
      const row = data[0];
      const updatedUser = { id: row.id, name: row.name, email: row.email, phone: row.phone, role: row.role, city: row.city, address: row.address };
      setUser(updatedUser);
      return { success: true, data: { user: updatedUser } };
    },

    async getUsers(query = '') {
      let q = _supabase.from('users').select('id,name,email,phone,role,city,address,created_at');
      if (query) q = q.or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`);
      const { data, error } = await q.limit(50);
      if (error) throw new Error(error.message);
      return { success: true, data: { users: data || [] } };
    },

    // --- CART (Supabase DB) ---
    async getCart() {
      const { data, error } = await _supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', sessionId);
      return { success: true, data: { items: data || [] } };
    },

    async addToCart(product, qty = 1) {
      const userId = getUser()?.id || null;
      const { data: existing } = await _supabase
        .from('cart_items')
        .select('id,qty')
        .eq('session_id', sessionId)
        .eq('product_id', product.id)
        .limit(1);

      if (existing && existing.length > 0) {
        await _supabase.from('cart_items')
          .update({ qty: existing[0].qty + qty, updated_at: new Date().toISOString() })
          .eq('id', existing[0].id);
      } else {
        const userId = getUser()?.id || null;
        await _supabase.from('cart_items').insert({
          session_id: sessionId,
          user_id: userId,
          product_id: product.id,
          name: product.name,
          brand: product.brand || '',
          price: product.price,
          old_price: product.old || product.oldPrice || null,
          qty,
          emoji: product.emoji || '🛍️',
          image_url: product.img || null,
          category: product.category || 'general'
        });
      }
      return { success: true };
    },

    async updateCartQty(productId, qty) {
      await _supabase.from('cart_items')
        .update({ qty, updated_at: new Date().toISOString() })
        .eq('session_id', sessionId)
        .eq('product_id', productId);
      return { success: true };
    },

    async removeFromCart(productId) {
      await _supabase.from('cart_items')
        .delete()
        .eq('session_id', sessionId)
        .eq('product_id', productId);
      return { success: true };
    },

    async clearCart() {
      await _supabase.from('cart_items')
        .delete()
        .eq('session_id', sessionId);
      return { success: true };
    },

    async syncCart(items, replace = false) {
      if (replace) {
        await _supabase.from('cart_items').delete().eq('session_id', sessionId);
      }
      if (items && items.length > 0) {
        const userId = getUser()?.id || null;
        const rows = items.map(i => ({
          session_id: sessionId,
          user_id: userId,
          product_id: i.id,
          name: i.name,
          brand: i.brand || '',
          price: i.price,
          old_price: i.oldPrice || null,
          qty: i.qty || 1,
          emoji: i.emoji || '🛍️',
          image_url: i.img || null,
          category: i.category || 'general'
        }));
        await _supabase.from('cart_items').upsert(rows, { onConflict: 'session_id,product_id' });
      }
      return { success: true };
    },

    // --- ORDERS (Supabase DB) ---
    async createOrder(orderPayload) {
      const o = orderPayload;
      const orderRow = {
        order_id: o.orderId,
        customer_name: o.customer?.name || '',
        customer_phone: o.customer?.phone || '',
        customer_email: o.customer?.email || '',
        customer_address: o.customer?.address || '',
        customer_city: o.customer?.city || 'Dhaka',
        customer_note: o.customer?.note || '',
        subtotal: o.subtotal || 0,
        shipping: o.shipping || 0,
        savings: o.savings || 0,
        total: o.total || 0,
        payment_method: o.paymentMethod || 'cod'
      };
      const { error: oErr } = await _supabase.from('orders').insert(orderRow);
      if (oErr) throw new Error(oErr.message);

      // Insert order items
      if (o.items && o.items.length > 0) {
        const itemRows = o.items.map(i => ({
          order_id: o.orderId,
          product_id: i.id || '',
          name: i.name,
          brand: i.brand || '',
          price: i.price,
          old_price: i.oldPrice || null,
          qty: i.qty || 1,
          emoji: i.emoji || '🛍️',
          image_url: i.img || null,
          category: i.category || 'general'
        }));
        await _supabase.from('order_items').insert(itemRows);
      }

      return { success: true, data: { orderId: o.orderId } };
    },

    async getOrders(options = '') {
      let q = _supabase.from('orders').select('*').order('created_at', { ascending: false });

      if (typeof options === 'string' && options) {
        q = q.eq('customer_phone', options);
      } else if (typeof options === 'object' && options !== null) {
        if (options.phone) q = q.eq('customer_phone', options.phone);
        if (options.ids && Array.isArray(options.ids)) q = q.in('order_id', options.ids);
      }

      const { data, error } = await q.limit(100);
      if (error) throw new Error(error.message);

      // Map to frontend format
      const orders = (data || []).map(o => ({
        orderId: o.order_id,
        customer: {
          name: o.customer_name, phone: o.customer_phone,
          email: o.customer_email, address: o.customer_address,
          city: o.customer_city, note: o.customer_note
        },
        subtotal: parseFloat(o.subtotal), shipping: parseFloat(o.shipping),
        savings: parseFloat(o.savings), total: parseFloat(o.total),
        paymentMethod: o.payment_method,
        createdAt: o.created_at, updatedAt: o.updated_at,
        items: [] // items loaded separately if needed
      }));

      return { success: true, data: { orders } };
    },

    async getOrder(orderId) {
      const { data: oData } = await _supabase.from('orders').select('*').eq('order_id', orderId).limit(1);
      if (!oData || oData.length === 0) throw new Error('Order not found');
      const o = oData[0];

      const { data: items } = await _supabase.from('order_items').select('*').eq('order_id', orderId);

      const order = {
        orderId: o.order_id,
        customer: {
          name: o.customer_name, phone: o.customer_phone,
          email: o.customer_email, address: o.customer_address,
          city: o.customer_city, note: o.customer_note
        },
        subtotal: parseFloat(o.subtotal), shipping: parseFloat(o.shipping),
        savings: parseFloat(o.savings), total: parseFloat(o.total),
        paymentMethod: o.payment_method,
        createdAt: o.created_at, updatedAt: o.updated_at,
        items: (items || []).map(i => ({
          id: i.product_id, name: i.name, brand: i.brand,
          price: parseFloat(i.price), oldPrice: i.old_price ? parseFloat(i.old_price) : null,
          qty: i.qty, emoji: i.emoji, img: i.image_url, category: i.category
        }))
      };

      return { success: true, data: { order } };
    },

    // --- NEWSLETTER (Supabase DB) ---
    async subscribeNewsletter(email, source = 'homepage_stay_in_the_loop') {
      const { error } = await _supabase.from('newsletter_subscribers')
        .upsert({ email, source }, { onConflict: 'email' });
      if (error) throw new Error(error.message);
      return { success: true, message: 'Subscribed!' };
    },

    async getNewsletterSubscribers() {
      const { data } = await _supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
      return { success: true, data: { subscribers: data || [] } };
    },

    async checkHealth() {
      try {
        const { data, error } = await _supabase.from('users').select('id', { count: 'exact', head: true });
        return { success: !error, message: error ? error.message : 'Supabase connected!' };
      } catch(e) {
        return { success: false, message: e.message };
      }
    }
  };
})();

// Auto-check session on load
if (API.isLoggedIn()) {
  API.getMe().catch(() => {});
}
