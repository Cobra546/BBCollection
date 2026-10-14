/* BB Collection admin-only OneSignal registration. */
(() => {
  const button=document.getElementById('adminPushEnable');
  if(!button)return;
  const label=button.textContent;
  const appId=String(window.BB_ONESIGNAL_APP_ID||'').trim();
  if(!appId){button.addEventListener('click',()=>alert('OneSignal setup pending: create a dedicated BB Collection app, then paste its App ID into js/supabase.js.'));return;}
  window.OneSignalDeferred=window.OneSignalDeferred||[];
  let readyResolve,readyReject;
  const ready=new Promise((resolve,reject)=>{readyResolve=resolve;readyReject=reject;});
  window.OneSignalDeferred.push(async OneSignal=>{
    try{
      await OneSignal.init({appId,serviceWorkerPath:'OneSignalSDKWorker.js',serviceWorkerParam:{scope:'/BBCollection/'}});
      readyResolve(OneSignal);
    }catch(error){console.error('OneSignal init failed',error);readyReject(error);}
  });
  button.addEventListener('click',async()=>{
    button.disabled=true;button.textContent='SETTING UP…';
    try{
      const OneSignal=await ready;
      const sb=window.bbSupabase;
      if(!sb)throw new Error('Supabase is not ready.');
      const {data}=await sb.auth.getUser();
      if(!data.user)throw new Error('Sign in to the admin dashboard first.');
      const {data:admin}=await sb.from('admin_users').select('user_id').eq('user_id',data.user.id).maybeSingle();
      if(!admin)throw new Error('This account is not an admin.');
      await OneSignal.login('bb-collection-admin');
      await OneSignal.Slidedown.promptPush();
      button.textContent='✓ ORDER ALERTS ENABLED';
    }catch(error){console.error(error);button.textContent=label;alert(error.message||'Could not enable push notifications.');}
    finally{button.disabled=false;}
  });
})();