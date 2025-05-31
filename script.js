
let allData = [];
let filters = {};

function renderGallery(data) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  data.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
      <img src="${item.imageURI}" alt="${item.name}" />
      <div class="name">${item.name}</div>
      <div class="rank">Rank: ${item.rank}, Score: ${item.total_rarity_score.toFixed(2)}</div>
    `;
    gallery.appendChild(div);
  });
}

function renderLeaderboard(data) {
  const board = document.getElementById('leaderboard');
  const topRanked = [...data].sort((a, b) => a.rank - b.rank).slice(0, 25);
  board.innerHTML = topRanked.map(x => `<li>${x.name} — Rank ${x.rank}</li>`).join('');
}

function renderFilters(data) {
  const traits = {};
  data.forEach(item => {
    item.traits.forEach(({ trait_type, value }) => {
      traits[trait_type] = traits[trait_type] || new Set();
      traits[trait_type].add(value);
    });
  });

  const filtersDiv = document.getElementById('filters');
  filtersDiv.innerHTML = '';

  for (let [type, values] of Object.entries(traits)) {
    const select = document.createElement('select');
    select.innerHTML = `<option value="">${type}</option>` + 
      [...values].sort().map(v => `<option value="${v}">${v}</option>`).join('');
    select.dataset.trait = type;
    select.onchange = applyFilters;
    filtersDiv.appendChild(select);
  }
}

function applyFilters() {
  const selects = document.querySelectorAll('#filters select');
  filters = {};
  selects.forEach(sel => {
    if (sel.value) filters[sel.dataset.trait] = sel.value;
  });

  const filtered = allData.filter(item => {
    return Object.entries(filters).every(([k, v]) =>
      item.traits.some(t => t.trait_type === k && t.value === v)
    );
  });

  renderGallery(filtered);
}

function handleSearch(event) {
  const q = event.target.value.toLowerCase().replace('#', '').trim();
  const filtered = allData.filter(item => 
    item.name.toLowerCase().includes(q) ||
    item.name.replace('Node Doge Whale #', '').includes(q)
  );
  renderGallery(filtered);
}

fetch('./rarity.json')
  .then(res => res.json())
  .then(data => {
    allData = data;
    renderGallery(allData);
    renderFilters(allData);
    renderLeaderboard(allData);
    document.getElementById('searchBox').addEventListener('input', handleSearch);
  });
