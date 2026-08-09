// BB Collection Supabase client
// Add your project's publishable key below. NEVER put a service_role/secret key here.
window.BB_SUPABASE_URL = window.BB_SUPABASE_URL || '';
window.BB_SUPABASE_ANON_KEY = window.BB_SUPABASE_ANON_KEY || '';

window.bbSupabase = null;

if (window.BB_SUPABASE_URL && window.BB_SUPABASE_ANON_KEY) {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
  script.onload = () => {
    window.bbSupabase = window.supabase.createClient(window.BB_SUPABASE_URL, window.BB_SUPABASE_ANON_KEY);
    window.dispatchEvent(new Event('bb:supabase-ready'));
  };
  document.head.appendChild(script);
}

window.bbOrderApi = {
  async create(order) {
    if (!window.bbSupabase) return { data: null, error: new Error('Supabase is not configured yet.') };
    return window.bbSupabase.from('orders').insert(order).select('id,order_number,created_at').single();
  },
  async getAdminOrders() {
    if (!window.bbSupabase) return { data: null, error: new Error('Supabase is not configured yet.') };
    return window.bbSupabase.from('orders').select('*').order('created_at', { ascending: false });
  },
  async updateStatus(id, status, tracking_number = null) {
    if (!window.bbSupabase) return { data: null, error: new Error('Supabase is not configured yet.') };
    return window.bbSupabase.from('orders').update({ status, tracking_number }).eq('id', id).select().single();
  }
};
