/* English Flow - Google Analytics (private stats for the site owner only) */
(function () {
  try {
    var ID = 'G-DYPZ0BBLWH';
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', ID);
  } catch (e) { /* analytics must never break the page */ }
})();
