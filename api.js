// ==========================================================
// SOHAN TECH — Frontend API Client (Supabase Backend)
// Online mode — no XAMPP/PHP needed
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

    // --- AUTH (Supabase Auth) ---
    async register(name, email, phone, password, address = '', city = 'Dhaka') {
      const { data, error } = await _supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone, city, address } }
      });
      if (error) throw new Error(error.message);

      const authUser = data.user;
      const token = data.session?.access_token || '';

      // Also insert into public.users table for app queries
      const userRow = {
        name, email, phone: phone || null, password: '***supabase_auth***',
        role: 'user', address: address || null, city,
        auth_uid: authUser?.id || null
      };
      await _supabase.from('users').insert(userRow);

      const user = {
        id: authUser?.id, name, email, phone: phone || null,
        role: 'user', city, address: address || null
      };
      setToken(token);
      setUser(user);
      localStorage.setItem('st_login_ts', String(Date.now()));
      return { success: true, data: { user, token }, message: 'Registration successful!' };
    },

    async login(identifier, password) {
      let email = identifier;

      // If identifier looks like a phone number, look up email first
      if (/^[0-9+\-\s]{10,}$/.test(identifier.replace(/\s/g, ''))) {
        const cleanPhone = identifier.replace(/[^0-9]/g, '');
        const { data: rows } = await _supabase
          .from('users')
          .select('email')
          .or(`phone.eq.${identifier},phone.eq.${cleanPhone}`)
          .limit(1);
        if (rows && rows.length > 0) {
          email = rows[0].email;
        } else {
          throw new Error('No account found with this phone number.');
        }
      }

      const { data, error } = await _supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);

      const token = data.session?.access_token || '';
      const meta = data.user?.user_metadata || {};
      const user = {
        id: data.user?.id, name: meta.name || '', email: data.user?.email,
        phone: meta.phone || '', role: meta.role || 'user',
        city: meta.city || 'Dhaka', address: meta.address || ''
      };

      setToken(token);
      setUser(user);
      localStorage.setItem('st_login_ts', String(Date.now()));
      return { success: true, data: { user, token }, message: 'Login successful!' };
    },

    async logout() {
      try { await _supabase.auth.signOut(); } catch (e) {}
      setToken(null);
      setUser(null);
      localStorage.removeItem('st_login_ts');
    },

    async getMe() {
      const { data, error } = await _supabase.auth.getUser();
      if (error || !data?.user) throw new Error('Not authenticated');
      const meta = data.user.user_metadata || {};
      const user = {
        id: data.user.id, name: meta.name || '', email: data.user.email,
        phone: meta.phone || '', role: meta.role || 'user',
        city: meta.city || 'Dhaka', address: meta.address || ''
      };
      setUser(user);
      return { user };
    },

    async updateProfile(updates) {
      const { data, error } = await _supabase.auth.updateUser({ data: updates });
      if (error) throw new Error(error.message);
      const meta = data.user?.user_metadata || {};
      const user = {
        id: data.user?.id, name: meta.name || '', email: data.user?.email,
        phone: meta.phone || '', role: meta.role || 'user',
        city: meta.city || 'Dhaka', address: meta.address || ''
      };
      setUser(user);
      // Also update public.users table
      await _supabase.from('users').update(updates).eq('email', data.user?.email);
      return { success: true, data: { user } };
    },

    async getUsers(query = '') {
      let q = _supabase.from('users').select('id,name,email,phone,role,city,created_at');
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
        await _supabase.from('cart_items').insert({
          session_id: sessionId,
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
        const rows = items.map(i => ({
          session_id: sessionId,
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
