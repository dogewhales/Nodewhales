
fetch('./rarity.json')
  .then(response => response.json())
  .then(data => {
    const gallery = document.getElementById('gallery');
    data.sort((a, b) => a.rank - b.rank);
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
  });
