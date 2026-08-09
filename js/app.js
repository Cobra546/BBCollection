const PRODUCTS=[
{id:'1',name:'Stay Rare Oversized Tee',price:2499,category:'streetwear',image:'assets/products/stay-rare.svg'},
{id:'2',name:'Tokyo Nights Graphic Tee',price:2699,category:'anime',image:'assets/products/tokyo-nights.svg'},
{id:'3',name:'Matchday Oversized Tee',price:2499,category:'football',image:'assets/products/matchday.svg'},
{id:'4',name:'Archive Washed Tee',price:2899,category:'vintage',image:'assets/products/archive-washed.svg'},
{id:'5',name:'Broken Beyond Tee',price:2599,category:'streetwear',image:'assets/products/broken-beyond.svg'},
{id:'6',name:'Neo Tokyo Tee',price:2799,category:'anime',image:'assets/products/neo-tokyo.svg'},
{id:'7',name:'90s Football Tee',price:2499,category:'football',image:'assets/products/90s-football.svg'},
{id:'8',name:'Rare Signal Tee',price:2999,category:'vintage',image:'assets/products/rare-signal.svg'}
];

const money=n=>`Rs. ${Number(n).toLocaleString('en-PK')}`;
const getCart=()=>JSON.parse(localStorage.getItem('bb_cart')||'[]');
const saveCart=c=>{localStorage.setItem('bb_cart',JSON.stringify(c));updateCartCount();};
function updateCartCount(){const n=getCart().reduce((s,x)=>s+x.qty,0);document.querySelectorAll('#cartCount').forEach(e=>e.textContent=n);}
function addToCart(id){const p=PRODUCTS.find(x=>x.id===String(id));if(!p)return;const c=getCart();const item=c.find(x=>x.id===p.id);item?item.qty++:c.push({...p,qty:1});saveCart(c);showToast('Added to cart');}
function showToast(text){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t)}t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function productCard(p){return `<article class="product-card"><a href="product.html?id=${p.id}" class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy"><span>${p.category.toUpperCase()}</span><button type="button" class="wishlist-btn" data-id="${p.id}" aria-label="Add ${p.name} to wishlist">♡</button></a><div class="product-info"><h3>${p.name}</h3><p class="price">${money(p.price)}</p><button class="add-btn" data-add="${p.id}">ADD TO CART</button></div></article>`}
function renderProducts(list=PRODUCTS){const el=document.querySelector('#featuredProducts');if(!el)return;el.innerHTML=list.slice(0,8).map(productCard).join('');el.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();addToCart(b.dataset.add)}));el.querySelectorAll('.wishlist-btn').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const w=JSON.parse(localStorage.getItem('bb_wishlist')||'[]');if(!w.includes(b.dataset.id))w.push(b.dataset.id);localStorage.setItem('bb_wishlist',JSON.stringify(w));b.textContent='♥';showToast('Saved to wishlist')}));}

const searchModal=document.querySelector('#searchModal');
document.querySelector('#searchBtn')?.addEventListener('click',()=>{if(searchModal){searchModal.hidden=false;document.querySelector('#searchInput')?.focus()}});
document.querySelector('#closeSearch')?.addEventListener('click',()=>{if(searchModal)searchModal.hidden=true});
document.querySelector('#searchInput')?.addEventListener('input',e=>{const q=e.target.value.toLowerCase();document.querySelector('#searchResults').innerHTML=PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)).map(p=>`<div class="search-result"><a href="product.html?id=${p.id}">${p.name} — ${money(p.price)}</a></div>`).join('')||'<p>No products found.</p>'});
document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('mobile-open'));
document.querySelector('#newsletterForm')?.addEventListener('submit',e=>{e.preventDefault();document.querySelector('#newsletterMessage').textContent='Thanks — you are on the list.';e.target.reset()});
document.querySelector('#year')&&(document.querySelector('#year').textContent=new Date().getFullYear());
updateCartCount();renderProducts();
