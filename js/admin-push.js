// BB Collection admin web-push registration.
window.BB_VAPID_PUBLIC_KEY = 'Lx9BsmDSG1Pe0z49TRb8Jj6ZvZ3Z05cybtFDn9uWSZRtq9oFlMZlsINysJsmAhmJlknt0KZfJ2v7HOQziXvn6g';

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
  const keyVersion = window.BB_VAPID_PUBLIC_KEY;
  if (subscription && localStorage.getItem('bb_vapid_public_key') !== keyVersion) {
    await subscription.unsubscribe();
    subscription = null;
  }
  if (!subscription) subscription = await ready.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(keyVersion) });
  const json = subscription.toJSON();
  const keys = json.keys || {};
  const { error } = await sb.from('admin_push_subscriptions').upsert({ user_id: auth.user.id, endpoint: json.endpoint, p256dh: keys.p256dh, auth: keys.auth, updated_at: new Date().toISOString() }, { onConflict: 'endpoint' });
  if (error) throw error;
  localStorage.setItem('bb_vapid_public_key', keyVersion);
  return subscription;
};

async function pushErrorMessage(error) {
  if (error?.context && typeof error.context.json === 'function') {
    try {
      const body = await error.context.json();
      if (body?.details) return `${body.error || 'Push failed'} — ${body.details}`;
      if (body?.error) return body.error;
    } catch (_) {}
  }
  return error?.message || 'Push request failed.';
}

window.bbTestAdminPush = async function () {
  const { error } = await (await window.bbSupabase).functions.invoke('send-admin-push', { body: { test: true } });
  if (error) throw new Error(await pushErrorMessage(error));
};
