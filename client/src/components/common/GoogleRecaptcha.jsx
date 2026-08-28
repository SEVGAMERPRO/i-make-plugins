import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export const SITE_KEY = '6LdYlp0tAAAAAI3e_nXpMkNMAMGSSrZHjJ0yNRXP';

export const executeRecaptchaV3 = async (action = 'submit') => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.grecaptcha) {
      return resolve('DEV_FALLBACK_TOKEN');
    }
    window.grecaptcha.ready(async () => {
      try {
        const token = await window.grecaptcha.execute(SITE_KEY, { action });
        resolve(token);
      } catch (err) {
        console.warn('reCAPTCHA v3 execute:', err);
        resolve('DEV_FALLBACK_TOKEN');
      }
    });
  });
};

const GoogleRecaptcha = ({ onVerify }) => {
  useEffect(() => {
    if (window.grecaptcha && onVerify) {
      window.grecaptcha.ready(() => {
        window.grecaptcha.execute(SITE_KEY, { action: 'view' })
          .then(token => onVerify(token))
          .catch(() => onVerify('DEV_FALLBACK_TOKEN'));
      });
    }
  }, [onVerify]);

  return (
    <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 my-2">
      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
      <span>Protected by <strong>Google reCAPTCHA v3</strong></span>
    </div>
  );
};

export default GoogleRecaptcha;
