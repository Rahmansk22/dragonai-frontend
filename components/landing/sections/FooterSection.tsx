import React from 'react';

const FooterSection: React.FC = () => {
  return (
    <footer
      className="night-theme py-8 px-[4vw]"
      style={{ borderTop: '1px solid rgba(244, 239, 230, 0.08)' }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          {['Privacy', 'Terms', 'Credits'].map((link) => (
            <a
              key={link}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(`${link} - Coming soon!`);
              }}
              className="font-body text-xs tracking-wider uppercase transition-colors hover:text-gold"
              style={{ color: 'rgba(244, 239, 230, 0.4)' }}
            >
              {link}
            </a>
          ))}
        </div>
        <p
          className="font-body text-xs"
          style={{ color: 'rgba(244, 239, 230, 0.3)' }}
        >
          © Dragon GPT. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
