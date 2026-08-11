// BB Collection admin web-push registration.
// The VAPID public key is safe to expose in the browser; the private key stays in Supabase Edge Function secrets.
window.BB_VAPID_PUBLIC_KEY = 'BEl-6pvsXOohz6HibWC2T2-fQjXPTlwHb9jLHp41Kwicdwlg9JcTGPjN_Iq4FMxYhu4HR7HWv-jhLvRhp-wrsrg';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
}

window.bbEnableAdminPush = async function () {
  if (!('serviceWorker' in navigator) || !('PushManager' in window) || !('Notification' in window)) throw new Error('Push notifications are not supported by this browser.');
  const sb = window.bbSupabase;
  if (!sb) throw new Error('Supabase is not ready yet.');
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) throw new Error('Please log in to the admin account first.');
  const { data: admin } = await sb.from('admin_users').select('user_id').eq('user_id', auth.user.id).maybeSingle();
  if (!admin) throw new Error('This account is not an admin account.');
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notification permission was not granted.');
  await navigator.serviceWorker.register('/BBCollection/sw.js', { scope: '/BBCollection/' });
  const ready = await navigator.serviceWorker.ready;
  let subscription = await ready.pushManager.getSubscription();
  if (!subscription) subscription = await ready.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(window.BB_VAPID_PUBLIC_KEY) });
  const json = subscription.toJSON();
  const keys = json.keys || {};
  const { error } = await sb.from('admin_push_subscriptions').upsert({ user_id: auth.user.id, endpoint: json.endpoint, p256dh: keys.p256dh, auth: keys.auth, updated_at: new Date().toISOString() }, { onConflict: 'endpoint' });
  if (error) throw error;
  return subscription;
};

window.bbTestAdminPush = async function () {
  const { error } = await (await window.bbSupabase).functions.invoke('send-admin-push', { body: { test: true } });
  if (error) throw error;
};
