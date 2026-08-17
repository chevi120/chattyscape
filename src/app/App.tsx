import { AIChatWidget } from "./components/AIChatWidget";

const SCAPE_COLORS = [
  { hex: "#FFDDEE", name: "SALT",      light: true  },
  { hex: "#FF007F", name: "NEON",      light: false },
  { hex: "#FF222D", name: "BIG APPLE", light: false },
  { hex: "#F58C34", name: "DAWN",      light: false },
  { hex: "#FFF162", name: "ZEST",      light: true  },
  { hex: "#79BE76", name: "FERN",      light: false },
  { hex: "#055755", name: "SHAMROCK",  light: false },
  { hex: "#00B7BD", name: "REEF",      light: false },
  { hex: "#B2DDE7", name: "MIST",      light: true  },
  { hex: "#397CC0", name: "HARBOUR",   light: false },
  { hex: "#242A56", name: "OCEAN",     light: false },
  { hex: "#814496", name: "DUSK",      light: false },
];

export default function App() {
  return (
    <div className="w-full">
      {Array.from({ length: 100 }).map((_, i) => {
        const color = SCAPE_COLORS[i % SCAPE_COLORS.length];
        return (
          <div
            key={i}
            className="w-full flex items-center px-8"
            style={{ background: color.hex, height: "550px" }}
          >
            <span
              className="text-xs font-bold tracking-widest uppercase opacity-60"
              style={{ color: color.light ? "#242A56" : "#fff" }}
            >
              {color.name} — {i + 1}
            </span>
          </div>
        );
      })}

      <AIChatWidget title="Hello, have a question? Let's chat." />
    </div>
  );
}