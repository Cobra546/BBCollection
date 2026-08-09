// BB Collection Supabase client
// Frontend-safe publishable key. NEVER put a service_role/secret key here.
window.BB_SUPABASE_URL = 'https://dqjoinjlsjiprildawjg.supabase.co';
window.BB_SUPABASE_ANON_KEY = 'sb_publishable_6p7qgiCRza7NPCz2Sxg0Pw_dch-XZUr';

window.bbSupabase = null;

const supabaseScript = document.createElement('script');
supabaseScript.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
supabaseScript.onload = () => {
  window.bbSupabase = window.supabase.createClient(
    window.BB_SUPABASE_URL,
    window.BB_SUPABASE_ANON_KEY
  );
  window.dispatchEvent(new Event('bb:supabase-ready'));
};
supabaseScript.onerror = () => {
  console.error('BB Collection: Supabase library failed to load.');
};
document.head.appendChild(supabaseScript);

window.bbOrderApi = {
  async create(order) {
    if (!window.bbSupabase) {
      return { data: null, error: new Error('Supabase is not ready yet.') };
    }
    return window.bbSupabase
      .from('orders')
      .insert(order)
      .select('id, created_at')
      .single();
  },

  async getAdminOrders() {
    if (!window.bbSupabase) {
      return { data: null, error: new Error('Supabase is not ready yet.') };
    }
    return window.bbSupabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
  },

  async updateStatus(id, status) {
    if (!window.bbSupabase) {
      return { data: null, error: new Error('Supabase is not ready yet.') };
    }
    return window.bbSupabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();
  }
};
