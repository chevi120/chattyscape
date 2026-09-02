# Chatty widget

Standalone copy of the "Chatty" floating chat widget, extracted from the
Figma-generated demo project so it can be handed to developers without the
rest of the scaffolding (unused shadcn/MUI components, the color-bar demo
page, etc).

## Contents

- `AIChatWidget.tsx` — the widget component.
- `assets/` — icons and images the component imports.
- `fonts/` + `chatty.css` — the two custom fonts (Bariol, GT Pressura Pro)
  and the one global style override the widget needs.

## Dependencies

The component is plain React + Tailwind utility classes:

- `react` / `react-dom` ^18
- `lucide-react` ^0.487 (icons)
- `tailwindcss` v4, already configured in the host project (or copy the
  relevant utility classes into your own CSS if you don't use Tailwind)

## Usage

1. Copy this whole folder into the host project.
2. Import `chatty.css` once (e.g. in your global stylesheet or root layout).
3. Render the widget, usually near the root of the page so it's `fixed` to
   the viewport:

```tsx
import { AIChatWidget } from "./chatty-widget/AIChatWidget";

<AIChatWidget
  title="Hello, have a question? Let's chat."
  whatsappHref="https://api.whatsapp.com/send?phone=61490392274"
/>
```

Both props are optional and default to the values above.

## Salesforce Embedded Messaging

The "Chat with AI agent" option lazily loads Salesforce Embedded Messaging
(Chatty_v2) the first time it's clicked. The org id, deployment name, and
site URL are hardcoded near the top of `AIChatWidget.tsx`
(`loadEmbeddedMessaging`) — update those if you're pointing this at a
different Salesforce org/environment (e.g. sandbox vs. production).
