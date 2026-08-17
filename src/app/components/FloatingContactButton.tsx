import contactButtonImage from 'figma:asset/c864ee6d1c6c5e37f8b0ff6805e6245121f20ed7.png';

interface FloatingContactButtonProps {
  href?: string;
  ariaLabel?: string;
}

export function FloatingContactButton({ 
  href = "https://wa.me/1234567890", // Replace with your WhatsApp number or contact link
  ariaLabel = "Contact us"
}: FloatingContactButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="fixed bottom-4 left-4 z-50 transition-transform hover:scale-110 active:scale-95 md:bottom-6 md:left-6"
    >
      <img
        src={contactButtonImage}
        alt="Contact button"
        className="drop-shadow-lg"
        style={{ width: '56px', height: '56px' }}
      />
    </a>
  );
}