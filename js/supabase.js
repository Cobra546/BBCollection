// BB Collection Supabase client
// Frontend-safe publishable key. NEVER put a service_role/secret key here.
window.BB_SUPABASE_URL = 'https://dqjoinjlsjiprildawjg.supabase.co';
window.BB_SUPABASE_ANON_KEY = 'sb_publishable_6p7qgiCRza7NPCz2Sxg0Pw_dch-XZUr';
window.bbSupabase = null;
const supabaseScript = document.createElement('script');
supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
supabaseScript.onload = () => { window.bbSupabase = window.supabase.createClient(window.BB_SUPABASE_URL, window.BB_SUPABASE_ANON_KEY); window.dispatchEvent(new Event('bb:supabase-ready')); };
supabaseScript.onerror = () => console.error('BB Collection: Supabase library failed to load.');
document.head.appendChild(supabaseScript);
window.bbOrderApi = {
  async create(order, items) {
    if (!window.bbSupabase) return { data: null, error: new Error('Supabase is not ready yet.') };
    const payload = (items || []).map(item => ({ product_id: Number.isFinite(Number(item.product_id)) ? Number(item.product_id) : null, product_name: String(item.product_name || item.name || 'Product').slice(0, 200), print_name: String(item.print_name || '').trim().slice(0, 100) || null, size: String(item.size || '').toUpperCase().trim(), quantity: Math.max(1, Number(item.quantity ?? item.qty ?? 1)), unit_price: Math.max(0, Number(item.unit_price ?? item.price ?? 0)) }));
    const result = await window.bbSupabase.rpc('place_order', { p_customer_name: order.customer_name, p_phone: order.phone, p_email: order.email, p_address: order.address, p_city: order.city, p_notes: order.notes || null, p_total: Number(order.total ?? 0), p_items: payload, p_payment_method: order.payment_method || 'cod' });
    if (!result.error && result.data) {
      const { error: pushError } = await window.bbSupabase.functions.invoke('send-admin-push', { body: { order_id: Number(result.data) } });
      if (pushError) console.warn('Admin push could not be sent:', pushError);
    }
    return { data: result.data ? { id: result.data } : null, error: result.error };
  },
  async getAdminOrders() { if (!window.bbSupabase) return { data: null, error: new Error('Supabase is not ready yet.') }; return window.bbSupabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false }); },
  async updateStatus(id, status) { if (!window.bbSupabase) return { data: null, error: new Error('Supabase is not ready yet.') }; return window.bbSupabase.from('orders').update({ status }).eq('id', id).select().single(); }
};
