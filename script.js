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

        // Fetch market data for BTC, ETH, and USDT
        async function fetchCryptoData() {
            try {
                const response = await fetch(`${apiUrl}?vs_currency=usd&ids=bitcoin,ethereum,tether&order=market_cap_desc&sparkline=false`);
                if (!response.ok) throw new Error('Failed to fetch data');
                return await response.json();
            } catch (error) {
                console.error("Error fetching cryptocurrency data:", error);
                return [];
            }
        }

        // Display updated crypto prices and market data
        async function displayCryptos() {
            const container = document.getElementById('crypto-container');
            container.innerHTML = '';

            const cryptos = await fetchCryptoData();
            if (cryptos.length === 0) return;

            cryptos.forEach(crypto => {
                const card = document.createElement('div');
                card.className = 'crypto-card';
                card.innerHTML = `
                    <div class="crypto-name">
                        <img src="${crypto.image}" alt="${crypto.name} logo">
                        <h2>${crypto.name} (${crypto.symbol.toUpperCase()})</h2>
                    </div>
                    <p>USD: $${crypto.current_price.toLocaleString()}</p>
                    <p>GBP: £${(crypto.current_price * currencies.gbp).toLocaleString()}</p>
                    <p>EUR: €${(crypto.current_price * currencies.eur).toLocaleString()}</p>
                    <p>JPY: ¥${(crypto.current_price * currencies.jpy).toLocaleString()}</p>
                    <p>AUD: A$${(crypto.current_price * currencies.aud).toLocaleString()}</p>
                    <p>Market Cap: $${crypto.market_cap.toLocaleString()}</p>
                    <p>Volume: ${crypto.total_volume.toLocaleString()}</p>
                    <p>Supply: ${crypto.circulating_supply ? crypto.circulating_supply.toLocaleString() : 'N/A'}</p>
                `;
                container.appendChild(card);
            });
        }

        // Update every hour (3600000 ms = 1 hour)
        setInterval(displayCryptos, 3600000);

        document.addEventListener('DOMContentLoaded', displayCryptos);
