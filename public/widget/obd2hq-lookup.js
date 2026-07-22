(function () {
  const mount = document.querySelector('[data-obd2hq-widget]');
  if (!mount) return;

  const locale = mount.getAttribute('data-locale') || 'en';
  const baseUrl = 'https://obd2hq.com';
  const labels = {
    en: { placeholder: 'Enter an OBD2 code, e.g. P0420', button: 'Open guide' },
    tr: { placeholder: 'OBD2 kodu girin, örn. P0420', button: 'Rehberi aç' },
    de: { placeholder: 'OBD2-Code eingeben, z. B. P0420', button: 'Ratgeber öffnen' },
    es: { placeholder: 'Introduce un código OBD2, ej. P0420', button: 'Abrir guía' },
    fr: { placeholder: 'Saisir un code OBD2, ex. P0420', button: 'Ouvrir le guide' },
  };
  const copy = labels[locale] || labels.en;

  mount.innerHTML = [
    '<form style="display:flex;gap:8px;align-items:center;max-width:460px;font-family:Arial,sans-serif">',
    `<input aria-label="OBD2 code" placeholder="${copy.placeholder}" style="flex:1;padding:12px;border:1px solid #cbd5e1;border-radius:8px" />`,
    `<button type="submit" style="padding:12px 14px;border:0;border-radius:8px;background:#075bf7;color:#fff;font-weight:700">${copy.button}</button>`,
    '</form>',
    '<div style="margin-top:6px;font:12px Arial,sans-serif;color:#64748b">Powered by <a href="https://obd2hq.com" rel="noopener">OBD2HQ</a></div>',
  ].join('');

  mount.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
    const input = mount.querySelector('input');
    const match = String(input.value || '').toUpperCase().match(/\b[PCBU]\s?([0-9A-F]{4})\b/);
    if (!match) return;
    const code = `${match[0][0]}${match[1]}`.toLowerCase();
    const bases = { tr: 'kodlar', es: 'codigos', en: 'codes', de: 'codes', fr: 'codes' };
    window.location.href = `${baseUrl}/${locale}/${bases[locale] || 'codes'}/${code}`;
  });
}());
