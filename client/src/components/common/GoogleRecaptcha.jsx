import React, { useEffect, useRef } from 'react';

const SITE_KEY = '6LfTkZ0tAAAAAJPVvP9UPfoLTNPPaj4_7hEXtmKx';

const GoogleRecaptcha = ({ onVerify, onExpired, onError }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const renderRecaptcha = () => {
      if (window.grecaptcha && window.grecaptcha.render && containerRef.current) {
        containerRef.current.innerHTML = '';
        try {
          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: SITE_KEY,
            theme: 'dark',
            callback: (token) => {
              if (onVerify) onVerify(token);
            },
            'expired-callback': () => {
              if (onExpired) onExpired();
            },
            'error-callback': () => {
              if (onError) onError();
            }
          });
        } catch (e) {
          console.warn('reCAPTCHA render notice:', e);
        }
      }
    };

    if (window.grecaptcha && window.grecaptcha.render) {
      renderRecaptcha();
    } else {
      const interval = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          clearInterval(interval);
          renderRecaptcha();
        }
      }, 300);
      return () => clearInterval(interval);
    }
  }, [onVerify, onExpired, onError]);

  return (
    <div className="flex justify-center my-3 overflow-hidden rounded-xl border border-white/10 p-2 bg-slate-950/60 shadow-inner">
      <div ref={containerRef} />
    </div>
  );
};

export default GoogleRecaptcha;
