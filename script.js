function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 10;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);


// Smooth scrolling

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
const currencies = {
    usd: 1,
    gbp: 0.78,
    eur: 0.92,
    jpy: 148,
    aud: 1.5
};
let allCryptos = [];
let selectedCryptos = [];

// Fetch data for BTC, ETH, and Tether
async function fetchCryptoData() {
    const response = await fetch(`${apiUrl}?vs_currency=usd&ids=bitcoin,ethereum,tether&order=market_cap_desc&sparkline=false`);
    return response.json();
}

async function displayCryptos() {
    const container = document.getElementById('crypto-container');
    const allCryptoGrid = document.getElementById('crypto-grid');

    // Fetch data for selected cryptocurrencies
    const cryptos = await fetchCryptoData();
    allCryptos = cryptos;

    container.innerHTML = '';
    allCryptoGrid.innerHTML = '';

    allCryptos.forEach(crypto => {
        const priceChangeClass = crypto.price_change_percentage_24h >= 0 ? 'price-up' : 'price-down';
        const card = document.createElement('div');
        card.className = 'crypto-card';
        card.innerHTML = `
            <div class="crypto-name">
                <img src="${crypto.image}" alt="${crypto.name} logo">
                <h2>${crypto.name} (${crypto.symbol.toUpperCase()})</h2>
            </div>
            <button class="show-button" onclick="togglePrices('${crypto.id}')">Details</button>
            <input type="checkbox" class="compare-checkbox" value="${crypto.id}" onchange="toggleSelection('${crypto.id}')"> Compare
            <div id="${crypto.id}" class="price-details">
                <p>USD: $${crypto.current_price.toLocaleString()}</p>
                <p>GBP: £${(crypto.current_price * currencies.gbp).toLocaleString()}</p>
                <p>EUR: €${(crypto.current_price * currencies.eur).toLocaleString()}</p>
                <p>JPY: ¥${(crypto.current_price * currencies.jpy).toLocaleString()}</p>
                <p>AUD: A$${(crypto.current_price * currencies.aud).toLocaleString()}</p>
                <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
                <p class="${priceChangeClass}">24h Change: ${crypto.price_change_percentage_24h.toFixed(2)}%</p>
                <p>Volume: ${crypto.total_volume.toLocaleString()}</p>
                <p>Supply: ${crypto.circulating_supply ? crypto.circulating_supply.toLocaleString() : 'N/A'}</p>
            </div>
        `;
        container.appendChild(card);

        // Populate the grid with all cryptos and their prices
     /*   const gridCard = document.createElement('div');
        gridCard.className = 'crypto-card';
        gridCard.innerHTML = `
            <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
            <p>USD: $${crypto.current_price.toLocaleString()}</p>
            <p>GBP: £${(crypto.current_price * currencies.gbp).toLocaleString()}</p>
            <p>EUR: €${(crypto.current_price * currencies.eur).toLocaleString()}</p>
            <p>JPY: ¥${(crypto.current_price * currencies.jpy).toLocaleString()}</p>
            <p>AUD: A$${(crypto.current_price * currencies.aud).toLocaleString()}</p>
        `;
        allCryptoGrid.appendChild(gridCard);
    });
}*/

function togglePrices(id) {
    const priceDiv = document.getElementById(id);
    if (priceDiv.style.display === 'none' || priceDiv.style.display === '') {
        priceDiv.style.display = 'block';
    } else {
        priceDiv.style.display = 'none';
    }
}

function toggleSelection(id) {
    if (selectedCryptos.includes(id)) {
        selectedCryptos = selectedCryptos.filter(crypto => crypto !== id);
    } else {
        selectedCryptos.push(id);
    }
}

function compareSelected() {
    const comparisonContainer = document.getElementById('comparison-container');
    comparisonContainer.innerHTML = '<h2>Comparison Results</h2>';

    const comparedCryptos = allCryptos.filter(crypto => selectedCryptos.includes(crypto.id));
    if (comparedCryptos.length < 2) {
        comparisonContainer.innerHTML += '<p>Please select at least two cryptocurrencies to compare.</p>';
        return;
    }

    comparedCryptos.forEach(crypto => {
        comparisonContainer.innerHTML += `
            <div class="crypto-card">
                <h3>${crypto.name} (${crypto.symbol.toUpperCase()})</h3>
                <p>USD: $${crypto.current_price.toLocaleString()}</p>
                <p>GBP: £${(crypto.current_price * currencies.gbp).toLocaleString()}</p>
                <p>EUR: €${(crypto.current_price * currencies.eur).toLocaleString()}</p>
                <p>JPY: ¥${(crypto.current_price * currencies.jpy).toLocaleString()}</p>
                <p>AUD: A$${(crypto.current_price * currencies.aud).toLocaleString()}</p>
                <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
                <p>Volume: ${crypto.total_volume.toLocaleString()}</p>
                <p>Supply: ${crypto.circulating_supply ? crypto.circulating_supply.toLocaleString() : 'N/A'}</p>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', displayCryptos);
