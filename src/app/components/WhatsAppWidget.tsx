import { useState } from "react";
import { X } from "lucide-react";
import whatsappIcon from 'figma:asset/ce83946f68294c2233d116b463e5d20b57637a6a.png';
import chatBubbleImage from 'figma:asset/f92d62423c95b59647d5bcc52e2e5b9354387b1b.png';

interface WhatsAppWidgetProps {
  href?: string;
  text?: string;
}

export function WhatsAppWidget({ 
  href = "https://api.whatsapp.com/send?phone=61490392274",
  text = "CHAT ON WHATSAPP"
}: WhatsAppWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleWhatsAppClick = () => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-3 left-3 z-50 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6">
      {/* Container with chat bubble and WhatsApp image */}
      <div className="flex flex-col items-start">
        {/* Chat bubble - only visible when expanded */}
        {isExpanded && (
          <div className="relative mb-[-4px] sm:mb-[-6px] md:mb-[-8px] animate-in slide-in-from-top-2 fade-in duration-300">
            {/* Clickable chat bubble image */}
            <button
              onClick={handleWhatsAppClick}
              aria-label="Chat on WhatsApp"
              className="transition-transform hover:scale-105 active:scale-95 block"
            >
              <img
                src={chatBubbleImage}
                alt="Chat on WhatsApp"
                className="w-[84px] h-auto sm:w-[101px] md:w-[118px] drop-shadow-lg"
              />
            </button>
            
            {/* Close button overlay positioned on the X in the image */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(false);
              }}
              aria-label="Minimize chat widget"
              className="absolute top-[2%] right-[1%] w-[22px] h-[22px] sm:w-[26px] sm:h-[26px] md:w-[30px] md:h-[30px] cursor-pointer bg-transparent"
            >
              <span className="sr-only">Close</span>
            </button>
          </div>
        )}
        
        {/* WhatsApp icon - always visible and clickable */}
        <button
          onClick={handleWhatsAppClick}
          aria-label="Chat on WhatsApp"
          className={`transition-all hover:scale-110 active:scale-95 ${
            isExpanded ? 'ml-[18px] sm:ml-[22px] md:ml-[26px]' : 'ml-0'
          }`}
        >
          <img
            src={whatsappIcon}
            alt="WhatsApp"
            className="w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] md:w-[56px] md:h-[56px] drop-shadow-lg"
          />
        </button>
      </div>
    </div>
  );
}