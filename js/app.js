const PRODUCTS=[
{id:'24',name:'Echoes / Nocturnal / Chaos — Design Drop',price:1600,category:'streetwear',image:'4f8c38dddfdf57005a876dba138771ec8855c3f9b511e6df29161378f9b06a9e.png'},
{id:'25',name:"Feel But Don't Fall — Design Drop",price:1600,category:'streetwear',image:'file_0000000074448208877ec9e818fa089a.png'},
{id:'26',name:'Rare Species / Don\'t Fit In / No Copy Repeat',price:1650,category:'streetwear',image:'file_0000000053b08211b426f0e3ed7bb596.png'},
{id:'27',name:'Rare Species / Don\'t Fit In / No Copy Repeat — B&W Drop',price:1550,category:'streetwear',image:'file_00000000e5048211aa25d6845bc60a24.png'},
{id:'28',name:'Stay Rare — Anime Streetwear Drop',price:1600,category:'streetwear',image:'file_00000000049c820baeeafea685b034e0.png'},
{id:'1',name:'Stay Rare Oversized Tee',price:1650,category:'streetwear',image:'file_000000001e4c820bb550691803beedda.png'},
{id:'2',name:'Street Signal Oversized Tee',price:1600,category:'streetwear',image:'1780582072182.png'},
{id:'3',name:'Tokyo Nights Oversized Tee',price:1650,category:'anime',image:'file_0000000050c8820bab61130ba5a06d2c.png'},
{id:'4',name:'Archive Graphic Oversized Tee',price:1550,category:'vintage',image:'1780582074195.png'},
{id:'5',name:'Broken Beyond Oversized Tee',price:1600,category:'streetwear',image:'716b5a97f8362613dbb763ab17d32643cd79327da87eacb816c142a9645b83f8.png'},
{id:'6',name:'Neo Tokyo Oversized Tee',price:1650,category:'anime',image:'1784466556762.png'},
{id:'7',name:'Matchday Oversized Tee',price:1650,category:'football',image:'1780582076755.png'},
{id:'8',name:'Rare Signal Oversized Tee',price:1600,category:'vintage',image:'file_00000000452c823092a5e8bbd15e28b8.png'},
{id:'9',name:'Night Drive Oversized Tee',price:1600,category:'streetwear',image:'file_0000000012308209b4fba513d3057e58.png'},
{id:'10',name:'Manga Frame Oversized Tee',price:1650,category:'anime',image:'file_0000000000948207916c6a6467b543ef.png'},
{id:'11',name:'Dark City Oversized Tee',price:1550,category:'streetwear',image:'file_000000006ab071f8ad2a8941f58ff3d0.png'},
{id:'12',name:'Retro League Oversized Tee',price:1600,category:'football',image:'file_0000000062248207879ac0a5946edebb.png'},
{id:'13',name:'Vintage Press Oversized Tee',price:1550,category:'vintage',image:'file_000000005d0c8246a38a2db3f32e0732.png'},
{id:'14',name:'Graffiti Code Oversized Tee',price:1650,category:'streetwear',image:'file_0000000058688207bdbe3b4841bc8a08.png'},
{id:'15',name:'Future Wave Oversized Tee',price:1600,category:'anime',image:'file_000000005658821199f5e369c04eebe3.png'},
{id:'16',name:'Midnight Club Oversized Tee',price:1550,category:'streetwear',image:'file_0000000095188211b359bbf5acf395cc.png'},
{id:'17',name:'Old School Oversized Tee',price:1550,category:'vintage',image:'file_00000000759c8207994849e4d21c4c85.png'},
{id:'18',name:'Football Culture Oversized Tee',price:1600,category:'football',image:'file_00000000714481fa9d9d32a155737b57.png'},
{id:'19',name:'Rare Archive Oversized Tee',price:1600,category:'vintage',image:'file_00000000fd588211a991e09211e6ba30.png'},
{id:'20',name:'After Dark Oversized Tee',price:1650,category:'streetwear',image:'file_00000000f1f48246b10a47f6da009cac.png'},
{id:'21',name:'Rare Species Oversized Tee',price:1650,category:'streetwear',image:'1000531350.png'},
{id:'22',name:"Don't Fit In Oversized Tee",price:1650,category:'streetwear',image:'1000530754.png'},
{id:'23',name:'BB Streetwear — 3 Design Drop',price:1650,category:'streetwear',image:'assets/bb-streetwear-1650.svg'}
];
const SIZES=['S','M','L','XL'];
const SIZE_GUIDE={S:{chest:23,length:27},M:{chest:24,length:28},L:{chest:25,length:29},XL:{chest:26,length:30}};
const money=n=>`Rs. ${Number(n).toLocaleString('en-PK')}`;
const bbReady=new Promise(resolve=>{if(window.bbSupabase)resolve(window.bbSupabase);else window.addEventListener('bb:supabase-ready',()=>resolve(window.bbSupabase),{once:true})});
const getCart=()=>{try{return JSON.parse(localStorage.getItem('bb_cart')||'[]')}catch{return[]}};
let cartSyncPromise=Promise.resolve();
const saveCart=c=>{localStorage.setItem('bb_cart',JSON.stringify(c));updateCartCount();cartSyncPromise=syncCart(c);return cartSyncPromise};
async function currentUser(){const sb=await bbReady;const {data}=await sb.auth.getUser();return data?.user||null}
async function syncCart(cart=getCart()){try{const sb=await bbReady;const u=await currentUser();if(!u)return;await sb.from('cart_items').delete().eq('user_id',u.id);if(cart.length)await sb.from('cart_items').insert(cart.map(x=>({user_id:u.id,product_id:Number(x.id),quantity:x.qty,print_name:x.print_name||null,size:x.size||null})));}catch(e){console.warn('Cart sync:',e)}}
async function loadAccountCart(){try{const local=getCart();const sb=await bbReady;const u=await currentUser();if(!u)return local;const {data,error}=await sb.from('cart_items').select('product_id,quantity,print_name,size').eq('user_id',u.id);if(error)throw error;const cloud=(data||[]).map(x=>{const p=PRODUCTS.find(y=>y.id===String(x.product_id));return p?{...p,qty:x.quantity,print_name:x.print_name||'',size:x.size||''}:null}).filter(Boolean);if(!local.length&&cloud.length){localStorage.setItem('bb_cart',JSON.stringify(cloud));updateCartCount();return cloud}if(local.length){syncCart(local);return local}return local}catch(e){console.warn('Cart load:',e);return getCart()}}
async function addToCart(id,size='',printName=''){const p=PRODUCTS.find(x=>x.id===String(id));if(!p)return;const chosenSize=String(size||'').toUpperCase().trim();if(!SIZES.includes(chosenSize)){showToast('Please select a size first');return null}const print=String(printName||'').trim().slice(0,100);const c=getCart();const item=c.find(x=>x.id===p.id&&(x.print_name||'')===print&&(x.size||'')===chosenSize);item?item.qty++:c.push({...p,qty:1,size:chosenSize,print_name:print});localStorage.setItem('bb_cart',JSON.stringify(c));updateCartCount();syncCart(c);showToast(print?`Added ${chosenSize} • ${print}`:`Added ${chosenSize} to cart`);return c;}
function showToast(text){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function updateCartCount(){const n=getCart().reduce((s,x)=>s+Number(x.qty||0),0);document.querySelectorAll('#cartCount').forEach(e=>e.textContent=n)}
function productCard(p){return `<article class="product-card"><a href="product.html?id=${p.id}" class="product-image" aria-label="View ${p.name}"><img src="${p.image}" alt="${p.name}" loading="lazy"><span>${p.category.toUpperCase()}</span><button type="button" class="wishlist-btn" data-id="${p.id}" aria-label="Add ${p.name} to wishlist">♡</button></a><div class="product-info"><h3>${p.name}</h3><p class="price">${money(p.price)}</p><a class="add-btn bb-view-btn" href="product.html?id=${p.id}">VIEW DETAILS</a></div></article>`}
function renderProducts(list=PRODUCTS){const el=document.querySelector('#featuredProducts');if(!el)return;el.innerHTML=list.slice(0,8).map(productCard).join('');el.querySelectorAll('.wishlist-btn').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const w=JSON.parse(localStorage.getItem('bb_wishlist')||'[]');if(!w.includes(b.dataset.id))w.push(b.dataset.id);localStorage.setItem('bb_wishlist',JSON.stringify(w));b.textContent='♥';showToast('Saved to wishlist')}));}

const searchModal=document.querySelector('#searchModal');
const searchInput=document.querySelector('#searchInput');
const searchResults=document.querySelector('#searchResults');
const searchStatus=document.querySelector('#searchStatus');
let searchTimer;
const escapeHtml=v=>String(v||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
function setSearchOpen(open){if(!searchModal)return;searchModal.hidden=!open;searchModal.setAttribute('aria-hidden',String(!open));document.body.classList.toggle('search-open',open);if(open){requestAnimationFrame(()=>searchModal.classList.add('is-open'));setTimeout(()=>searchInput?.focus(),80)}else{searchModal.classList.remove('is-open');if(searchInput){searchInput.value='';renderSearch('')} }}
function renderSearch(query=''){if(!searchResults)return;const q=query.trim().toLowerCase();if(!q){searchStatus&&(searchStatus.textContent='Start typing to discover the collection');searchResults.innerHTML='<div class="search-empty"><span>⌕</span><p>Search for your favorite BB Collection piece</p></div>';return}
const words=q.split(/\s+/).filter(Boolean);const results=PRODUCTS.filter(p=>{const hay=`${p.name} ${p.category}`.toLowerCase();return words.every(word=>hay.includes(word))}).slice(0,12);searchStatus&&(searchStatus.textContent=`${results.length} ${results.length===1?'piece':'pieces'} found`);if(!results.length){searchResults.innerHTML=`<div class="search-empty no-result"><span>×</span><p>No pieces found for <strong>“${escapeHtml(query)}”</strong></p><small>Try another shirt name, vibe or category.</small></div>`;return}searchResults.innerHTML=results.map((p,i)=>`<a class="premium-search-result" style="--delay:${i*35}ms" href="product.html?id=${encodeURIComponent(p.id)}"><div class="search-product-image"><img src="${p.image}" alt="${escapeHtml(p.name)}" loading="lazy"></div><div class="search-product-copy"><span class="search-category">${escapeHtml(p.category)}</span><h3>${escapeHtml(p.name)}</h3><p>${money(p.price)}</p></div><span class="search-arrow">↗</span></a>`).join('')}
document.querySelector('#searchBtn')?.addEventListener('click',()=>setSearchOpen(true));
document.querySelector('#closeSearch')?.addEventListener('click',()=>setSearchOpen(false));
document.querySelector('#searchBackdrop')?.addEventListener('click',()=>setSearchOpen(false));
searchInput?.addEventListener('input',e=>{clearTimeout(searchTimer);const value=e.target.value;searchStatus&&(searchStatus.textContent=value.trim()?'Searching the collection…':'Start typing to discover the collection');searchTimer=setTimeout(()=>renderSearch(value),70)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!searchModal?.hidden)setSearchOpen(false)});

document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('mobile-open'));document.querySelector('#newsletterForm')?.addEventListener('submit',e=>{e.preventDefault();document.querySelector('#newsletterMessage').textContent='Thanks — you are on the list.';e.target.reset()});document.querySelector('#year')&&(document.querySelector('#year').textContent=new Date().getFullYear());

// Admin dashboard: clicking a product image opens the exact product detail page.
document.addEventListener('click',e=>{const thumb=e.target.closest('img.product-thumb');if(!thumb)return;const product=PRODUCTS.find(p=>String(p.name).trim().toLowerCase()===String(thumb.alt||'').trim().toLowerCase())||PRODUCTS.find(p=>String(p.image)===String(thumb.getAttribute('src')||''));if(product){e.preventDefault();window.location.href=`product.html?id=${encodeURIComponent(product.id)}`;}});
const adminStyle=document.createElement('style');adminStyle.textContent='img.product-thumb{cursor:pointer;transition:transform .2s ease,box-shadow .2s ease}img.product-thumb:hover{transform:scale(1.05);box-shadow:0 0 0 2px rgba(199,169,120,.7)}';document.head.appendChild(adminStyle);

updateCartCount();renderProducts();bbReady.then(()=>loadAccountCart());