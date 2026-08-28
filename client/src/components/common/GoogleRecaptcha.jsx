import React, { useEffect, useRef } from 'react';

const SITE_KEY = '6LdYlp0tAAAAAI3e_nXpMkNMAMGSSrZHjJ0yNRXP';

const GoogleRecaptcha = ({ onVerify, onExpired, onError }) => {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const renderedRef = useRef(false);

  useEffect(() => {
    let checkInterval;

    const renderWidget = () => {
      if (renderedRef.current || !containerRef.current || !window.grecaptcha || !window.grecaptcha.render) {
        return;
      }

      try {
        containerRef.current.innerHTML = '';
        widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme: 'dark',
          size: 'normal',
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
        renderedRef.current = true;
      } catch (err) {
        console.warn('reCAPTCHA render:', err);
      }
    };

    // Ensure script exists
    if (!document.querySelector('script[src*="recaptcha/api.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    if (window.grecaptcha && window.grecaptcha.render) {
      if (window.grecaptcha.ready) {
        window.grecaptcha.ready(renderWidget);
      } else {
        renderWidget();
      }
    } else {
      checkInterval = setInterval(() => {
        if (window.grecaptcha && window.grecaptcha.render) {
          clearInterval(checkInterval);
          if (window.grecaptcha.ready) {
            window.grecaptcha.ready(renderWidget);
          } else {
            renderWidget();
          }
        }
      }, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [onVerify, onExpired, onError]);

  return (
    <div className="flex justify-center my-3 min-h-[78px]">
      <div ref={containerRef} className="rounded-xl overflow-hidden shadow-md" />
    </div>
  );
};

export default GoogleRecaptcha;
