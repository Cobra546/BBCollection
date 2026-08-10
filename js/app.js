const PRODUCTS=[
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
{id:'22',name:"Don't Fit In Oversized Tee",price:1650,category:'streetwear',image:'1000530754.png'}
];
const money=n=>`Rs. ${Number(n).toLocaleString('en-PK')}`;
const bbReady=new Promise(resolve=>{if(window.bbSupabase)resolve(window.bbSupabase);else window.addEventListener('bb:supabase-ready',()=>resolve(window.bbSupabase),{once:true})});
const getCart=()=>{try{return JSON.parse(localStorage.getItem('bb_cart')||'[]')}catch{return[]}};
const saveCart=c=>{localStorage.setItem('bb_cart',JSON.stringify(c));updateCartCount();syncCart(c)};
async function currentUser(){const sb=await bbReady;const {data}=await sb.auth.getUser();return data?.user||null}
async function syncCart(cart=getCart()){try{const sb=await bbReady;const u=await currentUser();if(!u)return;await sb.from('cart_items').delete().eq('user_id',u.id);if(cart.length)await sb.from('cart_items').insert(cart.map(x=>({user_id:u.id,product_id:Number(x.id),quantity:x.qty,print_name:x.print_name||null})));}catch(e){console.warn('Cart sync:',e)}}
async function loadAccountCart(){try{const sb=await bbReady;const u=await currentUser();if(!u)return getCart();const {data,error}=await sb.from('cart_items').select('product_id,quantity,print_name').eq('user_id',u.id);if(error)throw error;const cloud=(data||[]).map(x=>{const p=PRODUCTS.find(y=>y.id===String(x.product_id));return p?{...p,qty:x.quantity,print_name:x.print_name||''}:null}).filter(Boolean);localStorage.setItem('bb_cart',JSON.stringify(cloud));updateCartCount();return cloud}catch(e){console.warn('Cart load:',e);return getCart()}}
async function addToCart(id,printName=''){const p=PRODUCTS.find(x=>x.id===String(id));if(!p)return;const print=String(printName||'').trim().slice(0,100);const c=getCart();const item=c.find(x=>x.id===p.id&&(x.print_name||'')===print);item?item.qty++:c.push({...p,qty:1,print_name:print});saveCart(c);showToast(print?`Added with print: ${print}`:'Added to cart');}
function showToast(text){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function updateCartCount(){const n=getCart().reduce((s,x)=>s+Number(x.qty||0),0);document.querySelectorAll('#cartCount').forEach(e=>e.textContent=n)}
function productCard(p){return `<article class="product-card"><a href="product.html?id=${p.id}" class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span>${p.category.toUpperCase()}</span><button type="button" class="wishlist-btn" data-id="${p.id}" aria-label="Add ${p.name} to wishlist">♡</button></a><div class="product-info"><h3>${p.name}</h3><p class="price">${money(p.price)}</p><button class="add-btn" data-add="${p.id}">ADD TO CART</button></div></article>`}
function renderProducts(list=PRODUCTS){const el=document.querySelector('#featuredProducts');if(!el)return;el.innerHTML=list.slice(0,8).map(productCard).join('');el.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();addToCart(b.dataset.add)}));el.querySelectorAll('.wishlist-btn').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const w=JSON.parse(localStorage.getItem('bb_wishlist')||'[]');if(!w.includes(b.dataset.id))w.push(b.dataset.id);localStorage.setItem('bb_wishlist',JSON.stringify(w));b.textContent='♥';showToast('Saved to wishlist')}));}
const searchModal=document.querySelector('#searchModal');document.querySelector('#searchBtn')?.addEventListener('click',()=>{if(searchModal){searchModal.hidden=false;document.querySelector('#searchInput')?.focus()}});document.querySelector('#closeSearch')?.addEventListener('click',()=>{if(searchModal)searchModal.hidden=true});document.querySelector('#searchInput')?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelector('#searchResults').innerHTML=PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)).map(p=>`<div class="search-result"><a href="product.html?id=${p.id}">${p.name} — ${money(p.price)}</a></div>`).join('')||'<p>No products found.</p>'});document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('mobile-open'));document.querySelector('#newsletterForm')?.addEventListener('submit',e=>{e.preventDefault();document.querySelector('#newsletterMessage').textContent='Thanks — you are on the list.';e.target.reset()});document.querySelector('#year')&&(document.querySelector('#year').textContent=new Date().getFullYear());
updateCartCount();renderProducts();bbReady.then(()=>loadAccountCart());