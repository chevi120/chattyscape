import { useState, useEffect, useRef } from "react";
import { X, ChevronDown, HelpCircle, Phone } from "lucide-react";
import chattyAvatar from "./assets/Chatty_Avatar__8_.png";
import chatBubbleIcon from "./assets/Chatty_Avatar__20_-1.png";
import faqIcon from "./assets/Chatty_Avatar__17_.png";
import contactIcon from "./assets/Chatty_Avatar__18_.png";
import whatsappIcon from "./assets/whatsapp-icon.png";
import letsChatBubble from "./assets/e__9_.png";

interface AIChatWidgetProps {
  title?: string;
  whatsappHref?: string;
}

type CtaId = "whatsapp" | "ai" | "faq" | "contact";

function ctaStyle(active: boolean, hovered: boolean) {
  const on = active || hovered;
  return {
    background: on ? '#242a56' : '#fff',
    color:      on ? '#fff'    : '#242a56',
    border:     'none',
    transition: 'background 0.2s, color 0.2s, border-color 0.2s',
  };
}

function arrowColor(active: boolean, hovered: boolean) {
  return (active || hovered) ? '#fff162' : '#FF007F';
}

export function AIChatWidget({
  title = "Hello, have a question? Let's chat.",
  whatsappHref = "https://api.whatsapp.com/send?phone=61490392274",
}: AIChatWidgetProps) {
  const [isOpen, setIsOpen]       = useState(false);
  const [view, setView]           = useState<"menu" | "contact">("menu");
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeCta, setActiveCta]   = useState<CtaId>("whatsapp");
  const [hoveredCta, setHoveredCta] = useState<CtaId | null>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  const sfReady = useRef(false);
  const pendingLaunch = useRef(false);

  const scriptLoading = useRef(false);

  const doLaunch = () => {
    const esb = (window as any).embeddedservice_bootstrap;
    try {
      if (esb?.utilAPI?.launchChat) {
        esb.utilAPI.launchChat();
        return;
      }
    } catch (err) {
      console.error('launchChat failed, falling back to clicking the native button:', err);
    }
    // Fallback: find SF's own rendered button and click it
    const sfBtn = document.querySelector<HTMLElement>(
      '.embeddedServiceHelpButton button, button.helpButton, [data-testid="embedded-messaging-fab"]'
    );
    if (sfBtn) sfBtn.click();
  };

  // Load Salesforce Embedded Messaging on demand, the first time the user opens the AI agent chat
  const loadEmbeddedMessaging = () => {
    if (document.getElementById('sf-embedded-script') || scriptLoading.current) return;
    scriptLoading.current = true;

    // launchChat() throws until Salesforce's own button has actually been created —
    // hideChatButtonOnLoad would stop it from ever being created, so we let it render
    // and hide it visually via CSS (.embeddedServiceHelpButton) instead.
    window.addEventListener('onEmbeddedMessagingButtonCreated', () => {
      sfReady.current = true;
      // If user clicked before SF was ready, launch now
      if (pendingLaunch.current) {
        pendingLaunch.current = false;
        doLaunch();
      }
    });

    const script = document.createElement('script');
    script.id = 'sf-embedded-script';
    script.type = 'text/javascript';
    script.src = 'https://scapeau--innscpedev.sandbox.my.site.com/ESWChattyv21781499949497/assets/js/bootstrap.min.js';
    script.onload = () => {
      try {
        (window as any).embeddedservice_bootstrap.settings.language = 'en_US';
        (window as any).embeddedservice_bootstrap.init(
          '00DBn000005CYJD',
          'Chatty_v2',
          'https://scapeau--innscpedev.sandbox.my.site.com/ESWChattyv21781499949497',
          { scrt2URL: 'https://scapeau--innscpedev.sandbox.my.salesforce-scrt.com' }
        );
      } catch (err) {
        console.error('Error loading Embedded Messaging:', err);
      }
    };
    script.onerror = () => console.error('Failed to load Salesforce script — check the URL and network');
    document.body.appendChild(script);
  };

  const launchSalesforceChat = () => {
    setIsOpen(false);
    if (sfReady.current) {
      doLaunch();
    } else {
      // SF not ready yet — queue it, will fire on onEmbeddedMessagingButtonCreated
      pendingLaunch.current = true;
      loadEmbeddedMessaging();
    }
  };

  useEffect(() => {
    const t = setTimeout(() => setShowTooltip(true), 3000);
    return () => clearTimeout(t);
  }, []);


  useEffect(() => {
  if (!showTooltip) return;
  const hideTimer = setTimeout(() => setShowTooltip(false), 20000);
  return () => clearTimeout(hideTimer);
}, [showTooltip]);

  const handleOpen = () => setIsOpen(true);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const ctaBase = "flex items-center gap-3 rounded-2xl px-3 py-3 cursor-pointer";

  return (
    <div className="fixed bottom-6 right-6 z-50" ref={widgetRef}>

      {/* Chat window — absolute so it never moves the button */}
      {isOpen && (
        <div className="absolute bottom-[74px] right-0 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="rounded-2xl shadow-2xl w-[300px] flex flex-col overflow-hidden" style={{ background: view === 'contact' ? '#fff' : '#fde' }}>

            {/* Header — hidden in contact view */}
            {view !== 'contact' && (
              <div className="px-5 pt-4 pb-1 relative flex flex-col items-center" style={{ background: '#fde' }}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-2 right-2 hover:opacity-80 rounded-full p-1.5 transition-opacity z-10"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-[#242a53] hover:text-[#FF007F] transition-colors duration-150" />
                </button>
                <h2 className="text-base leading-snug text-center font-normal pr-4 pl-4" style={{ color: '#242a56', fontFamily: 'Bariol, sans-serif' }}>
                  Hi, Let's chat!
                </h2>
              </div>
            )}

            {/* Menu */}
            {view === "menu" && (
              <div className="px-3 pb-4 mt-3 flex flex-col gap-2">

                {/* WhatsApp — full row */}
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ctaBase}
                  style={ctaStyle(activeCta === "whatsapp", hoveredCta === "whatsapp")}
                  onClick={() => setActiveCta("whatsapp")}
                  onMouseEnter={() => setHoveredCta("whatsapp")}
                  onMouseLeave={() => setHoveredCta(null)}
                >
                  <img src={whatsappIcon} alt="WhatsApp" className="w-8 h-8 flex-shrink-0" />
                  <p className="leading-tight flex-1 font-bold" style={{ fontFamily: 'Bariol, sans-serif', fontWeight: 700, fontSize: '18px', WebkitTextStroke: '0.3px currentColor' }}>Chat on WhatsApp</p>
                  <ChevronDown
                    className="-rotate-90 w-4 h-4 flex-shrink-0"
                    style={{ color: arrowColor(activeCta === "whatsapp", hoveredCta === "whatsapp") }}
                    strokeWidth={2.5}
                  />
                </a>

                {/* AI Chat — launches Salesforce Embedded Messaging */}
                <button
                  onClick={() => { setActiveCta("ai"); launchSalesforceChat(); }}
                  className={`${ctaBase} w-full text-left`}
                  style={ctaStyle(activeCta === "ai", hoveredCta === "ai")}
                  onMouseEnter={() => setHoveredCta("ai")}
                  onMouseLeave={() => setHoveredCta(null)}
                >
                  <img src={chattyAvatar} alt="Chatty" className="w-8 h-8 flex-shrink-0" />
                  <p className="leading-tight flex-1 font-bold" style={{ fontFamily: 'Bariol, sans-serif', fontWeight: 700, fontSize: '18px', WebkitTextStroke: '0.3px currentColor' }}>Chat with AI agent</p>
                  <ChevronDown
                    className="-rotate-90 w-4 h-4 flex-shrink-0"
                    style={{ color: arrowColor(activeCta === "ai", hoveredCta === "ai") }}
                    strokeWidth={2.5}
                  />
                </button>

                {/* FAQs + Call Us — icon beside text */}
                <div className="flex items-center justify-around pt-1 pb-1 px-1">
                  <a
                    href="https://www.scape.com.au/frequently-asked-questions/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group/faq"
                    onClick={() => setActiveCta("faq")}
                  >
                    <HelpCircle className="w-5 h-5 flex-shrink-0 text-[#FF007F] group-hover/faq:text-[#242a56] transition-colors duration-150" strokeWidth={2} />
                    <span
                      className="text-[#FF007F] group-hover/faq:text-[#242a56] transition-colors duration-150"
                      style={{ fontFamily: 'Bariol, sans-serif', fontWeight: 700, fontSize: '14px' }}
                    >FAQs</span>
                  </a>

                  <div className="w-px h-5 bg-gray-300" />

                  <button
                    onClick={() => { setActiveCta("contact"); setView("contact"); }}
                    className="flex items-center gap-2 group/call"
                  >
                    <Phone className="w-5 h-5 flex-shrink-0 text-[#FF007F] group-hover/call:text-[#242a56] transition-colors duration-150" strokeWidth={2} />
                    <span
                      className="text-[#FF007F] group-hover/call:text-[#242a56] transition-colors duration-150"
                      style={{ fontFamily: 'Bariol, sans-serif', fontWeight: 700, fontSize: '14px' }}
                    >Call Us</span>
                  </button>
                </div>

              </div>
            )}

            {/* Contact view */}
            {view === "contact" && (
              <>
                <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
                  <button onClick={() => setView("menu")} className="text-[#242a56] hover:bg-gray-100 rounded-full p-1 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <div className="w-8 h-8 flex items-center justify-center">
                    <Phone className="w-6 h-6" style={{ color: '#FF007F' }} strokeWidth={1.8} />
                  </div>
                  <p className="flex-1" style={{ fontFamily: 'Bariol, sans-serif', fontWeight: 700, fontSize: '16px', color: '#242a56' }}>Call Us</p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="hover:opacity-80 rounded-full p-1.5 transition-opacity"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4 text-[#242a53] hover:text-[#FF007F] transition-colors duration-150" />
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-4 items-center">
                  <div className="w-full flex flex-col gap-1 text-sm" style={{  fontFamily: 'Bariol, sans-serif',color: '#242a56' }}>
                    <p className="leading-relaxed">Got a question?</p>
                    <p className="leading-relaxed">
                      International:{" "}
                      <a href="tel:+61399778088" className="font-bold text-[#FF007F] hover:text-[#242A56] transition-all duration-300">
                        +61 3 9977 8088
                      </a>
                    </p>
                    <p className="leading-relaxed">
                      Within Australia:{" "}
                      <a href="tel:1300068888" className="font-bold text-[#FF007F] hover:text-[#242A56] transition-all duration-300">
                        1300 068 888
                      </a>
                    </p>
                    <p className="leading-relaxed">
                      {" "}
                      <a href="https://www.scape.com.au/contact-us/" target="_blank" rel="noopener noreferrer" className="font-bold text-[#FF007F] hover:text-[#242A56] transition-all duration-300">
                        Contact Us
                      </a> by leaving a comment.
                    </p>
                  </div>
                  <button
                    onClick={() => setView("menu")}
                    style={{
                      fontFamily: '"GT Pressura Pro", sans-serif',
                      fontWeight: 700,
                      fontSize: '13px',
                      lineHeight: '18px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#fff',
                      background: '#FF007F',
                      borderRadius: '100px',
                      padding: '12px 20px',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s, color 0.2s',
                      marginTop: '8px',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FFF162'; (e.currentTarget as HTMLButtonElement).style.color = '#FF007F'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FF007F'; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                  >
                    ← Back to menu
                  </button>
                </div>
              </>
            )}


          </div>
        </div>
      )}

      {/* Floating button — relative container so bubble can be absolutely placed */}
      <div className="relative w-[62px] h-[62px]">

        {/* LET'S CHAT bubble — smaller than Chatty, above-left, tail pointing down to icon */}
        {!isOpen && showTooltip && (
          <div
           className="absolute animate-in fade-in slide-in-from-bottom-2 duration-300"
style={{
  width: 77,
  bottom: '60px',
  right: '0px',
  filter: 'drop-shadow(0px 4px 10px rgba(0,0,0,0.22))',
  transform: 'rotate(-12.6deg)',
}}
          >
            <img
              src={letsChatBubble}
              alt="Let's chat"
              className="w-full block"
              draggable={false}
            />
            {/* Hit-area over the X circle (top-right ~80-100% x, 0-27% y) */}
            <button
              onClick={() => setShowTooltip(false)}
              aria-label="Close"
              className="absolute cursor-pointer"
              style={{
                top: '0%',
                right: '0%',
                width: '22%',
                height: '28%',
                background: 'transparent',
                border: 'none',
                padding: 0,
              }}
            />
          </div>
        )}

        {/* Chat button — fixed position, icon swaps but stays in same spot */}
        {isOpen ? (
          <button
            onClick={() => setIsOpen(false)}
            className="w-[62px] h-[62px] rounded-full flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95 border-0"
            style={{ background: '#fff162', filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.20))" }}
            aria-label="Close chat"
          >
            <ChevronDown className="w-7 h-7" style={{ color: '#ff007f' }} strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={handleOpen}
            className="w-[62px] h-[62px] rounded-full flex items-center justify-center cursor-pointer transition-transform duration-150 hover:scale-110 active:scale-95 border-0 p-0 bg-transparent"
            style={{ filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.25))" }}
            aria-label={title}
          >
            <img src={chatBubbleIcon} alt="Chat" className="w-[62px] h-[62px] block" />
          </button>
        )}
      </div>

    </div>
  );
}
