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

const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets';
const currencies = {
    usd: 1,
    gbp: 0.78,
    eur: 0.92,
    jpy: 148,
    aud: 1.5
};

let allCryptos = [];

// Fetch data for BTC, ETH, and Tether
async function fetchCryptoData() {
    const response = await fetch(`${apiUrl}?vs_currency=usd&ids=bitcoin,ethereum,tether&order=market_cap_desc&sparkline=false`);
    return response.json();
}

async function displayCryptos() {
    const container = document.getElementById('crypto-container');

    // Fetch data for selected cryptocurrencies
    const cryptos = await fetchCryptoData();
    allCryptos = cryptos;

    container.innerHTML = '';

    allCryptos.forEach(crypto => {
        const priceChange = crypto.price_change_percentage_24h.toFixed(2);
        const priceChangeClass = priceChange >= 0 ? 'price-up' : 'price-down';
        const arrow = priceChange >= 0 ? '▲' : '▼';

        const card = document.createElement('div');
        card.className = 'crypto-card';
        card.innerHTML = `
            <div class="crypto-name">
                <img src="${crypto.image}" alt="${crypto.name} logo">
                <h2>${crypto.name} (${crypto.symbol.toUpperCase()})</h2>
            </div>
            <div class="crypto-details">
                <p>USD: $${crypto.current_price.toLocaleString()}</p>
                <p>GBP: £${(crypto.current_price * currencies.gbp).toLocaleString()}</p>
                <p>EUR: €${(crypto.current_price * currencies.eur).toLocaleString()}</p>
                <p>JPY: ¥${(crypto.current_price * currencies.jpy).toLocaleString()}</p>
                <p>AUD: A$${(crypto.current_price * currencies.aud).toLocaleString()}</p>
                <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
                <p>Volume: ${crypto.total_volume.toLocaleString()}</p>
                <p>Supply: ${crypto.circulating_supply ? crypto.circulating_supply.toLocaleString() : 'N/A'}</p>
                <p class="${priceChangeClass}">24h Change: ${priceChange}% ${arrow}</p>
            </div>
        `;
        container.appendChild(card);
    });
}

// Update every hour (3600000 ms = 1 hour)
setInterval(displayCryptos, 3600000);

document.addEventListener('DOMContentLoaded', displayCryptos);

const year= new Date().getFullYear();

document.getElementById("year").innerHTML=year;


function page(){
  document.getElementById("page").style.display="block";
}
