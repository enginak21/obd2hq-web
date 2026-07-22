# OBD2HQ

OBD2HQ is a multilingual automotive diagnostic hub for OBD2 trouble codes, dashboard warning lights, vehicle symptoms, repair first checks, and driver-friendly diagnostic guides.

Live site: [OBD2HQ](https://obd2hq.com)

## Free Diagnostic Resources

These public resources can be cited by forums, repair blogs, developer tools, diagnostic apps, and driver education pages with attribution to OBD2HQ.

- [Open OBD2 code dataset](https://obd2hq.com/open-data/obd2-codes.json)
- [Dashboard warning light dataset](https://obd2hq.com/open-data/warning-lights.json)
- [OBD2 diagnostic first-check checklist](https://obd2hq.com/open-data/diagnostic-checklist.json)
- [Linkable diagnostic asset index](https://obd2hq.com/open-data/link-assets.json)
- [Free OBD2 resources hub](https://obd2hq.com/en/resources)
- [Embeddable OBD2 lookup widget](https://obd2hq.com/widget/obd2hq-lookup.js)

## Widget Embed

```html
<div data-obd2hq-widget data-locale="en"></div>
<script src="https://obd2hq.com/widget/obd2hq-lookup.js" async></script>
```

Supported locales: `en`, `tr`, `de`, `es`, `fr`.

## High-Intent Diagnostic Pages

- [Ford Ranger P0110 diagnostic guide](https://obd2hq.com/en/ford/ranger/p0110)
- [Ford F-150 warning lights](https://obd2hq.com/en/ford/f-150/lights)
- [Cadillac warning lights](https://obd2hq.com/en/cadillac/warning-lights)
- [P0213 OBD2 code guide](https://obd2hq.com/en/codes/p0213)

## Attribution

If you use the dataset, checklist, widget, or warning-light library publicly, please cite:

Source: [OBD2HQ diagnostic resources](https://obd2hq.com/en/resources)

Use branded or descriptive anchors. Do not use spammy exact-match anchors, paid dofollow link packages, automated comment links, or irrelevant forum drops.

## Development

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run check:gsc-seo
npm run check:content
npm run lint
npm run build
```
