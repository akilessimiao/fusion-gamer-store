const WA_NUMBER = "5584991070984";

function waLink(text){
  const msg = encodeURIComponent(text);
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
}

async function loadProducts(){
  const res = await fetch('products.json');
  const data = await res.json();
  return data.products;
}

function unique(arr){ return [...new Set(arr)]; }

function render(products){
  const grid = document.getElementById('grid');
  const tpl = document.getElementById('card-tpl');
  grid.innerHTML = '';
  products.forEach(p => {
    const node = tpl.content.cloneNode(true);
    const img = node.querySelector('.thumb');
    img.src = p.image || 'assets/logo.png';
    img.alt = p.title;
    node.querySelector('.title').textContent = p.title;
    node.querySelector('.meta').textContent = [p.category, p.code].filter(Boolean).join(' • ');
    const details = node.querySelector('.btn.outline');
    details.href = p.url || '#';
    details.textContent = p.url ? 'Ver detalhes' : 'Detalhes em breve';
    const wa = node.querySelector('.btn.whatsapp');
    const pre = `Olá! Tenho interesse em ${p.title}${p.code ? " (cód. "+p.code+")" : ""}. Pode me passar preço e disponibilidade?`;
    wa.href = waLink(pre);
    grid.appendChild(node);
  });
}

function applyFilters(all){
  const q = document.getElementById('search').value.trim().toLowerCase();
  const cat = document.getElementById('category').value;
  const filtered = all.filter(p => {
    const text = [p.title, p.category, p.code].join(' ').toLowerCase();
    const qok = !q || text.includes(q);
    const cok = !cat || p.category === cat;
    return qok && cok;
  });
  render(filtered);
}

(async function init(){
  const products = await loadProducts();
  // Populate categories
  const select = document.getElementById('category');
  unique(products.map(p => p.category))
    .sort()
    .forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    });
  // Bind
  document.getElementById('search').addEventListener('input', () => applyFilters(products));
  document.getElementById('category').addEventListener('change', () => applyFilters(products));
  document.getElementById('year').textContent = new Date().getFullYear();
  // First render
  applyFilters(products);
})();