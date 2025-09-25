// Минимальный учебный сетап. Скрипт prebid подключен через index.html.
// Здесь только инициализация аукциона и рендер (как делали на занятии).

// Предполагаем, что на странице есть <iframe id="ad-frame"></iframe>
// Если слотов будет 2+, просто добавите второй блок adUnits и второй iframe.

// Минимальный учебный сетап без any
console.log("Prebid module loaded");


const adUnits: PbjsAdUnit[] = [
  {
    code: "ad-home-top",
    mediaTypes: {
      banner: { sizes: [[300, 250], [300, 600]] },
    },
    bids: [
      {
        bidder: "adtelligent",
        params: { aid: 350975 },
      },
    ],
  },
    {
    code: "ad-home-sidebar",
    mediaTypes: {
      banner: { sizes: [[300, 250], [300, 600]] },
    },
    bids: [
      {
        bidder: "adtelligent",
        params: { aid: 350975 },
      },
    ],
  },
];

function init() {
  window.pbjs = window.pbjs || ({} as Pbjs);
  window.pbjs.que = window.pbjs.que || [];

  window.pbjs.que.push(() => {

    
    window.pbjs.addAdUnits(adUnits);

    window.pbjs.onEvent("bidResponse", (bid) => {
      console.log("bidResponse", bid);
      const iframe = document.getElementById(bid.adUnitCode) as HTMLIFrameElement | null;
      if (!iframe?.contentWindow) return;
      window.pbjs.renderAd(iframe.contentWindow.document, bid.adId);
    });

    window.pbjs.onEvent("bidWon", (bid) => {
      console.log("bidWon", bid);
    });

    window.pbjs.requestBids({ timeout: 1000 });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

