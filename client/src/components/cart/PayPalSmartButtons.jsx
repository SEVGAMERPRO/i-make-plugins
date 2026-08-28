import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { ShieldCheck, Lock, Loader2, AlertCircle } from 'lucide-react';

const PAYPAL_CLIENT_ID = 'BAAqvhYL5t4FVu1HCOquDM0Q7eO5D51VpdhVMolNko0IJYBX4OpoI_E2jMEMKkHb1YmD9KuoCX0fzmnles';

const PayPalSmartButtons = ({ items, totalAmount, onSuccess, onError }) => {
  const { user } = useAuth();
  const { activeCurrency } = useCurrency();
  const containerRef = useRef(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payError, setPayError] = useState('');

  const currencyCode = activeCurrency === 'USD' ? 'USD' : (activeCurrency === 'GBP' ? 'GBP' : 'EUR');

  useEffect(() => {
    let isMounted = true;

    const loadPayPalSdk = () => {
      const scriptId = 'paypal-sdk-script';
      const existingScript = document.getElementById(scriptId);

      if (window.paypal && window.paypal.Buttons) {
        if (isMounted) {
          setSdkReady(true);
          setLoading(false);
        }
        return;
      }

      if (existingScript) {
        existingScript.addEventListener('load', () => {
          if (isMounted) {
            setSdkReady(true);
            setLoading(false);
          }
        });
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currencyCode}&intent=capture&components=buttons`;
      script.async = true;

      script.onload = () => {
        if (isMounted) {
          setSdkReady(true);
          setLoading(false);
        }
      };

      script.onerror = (err) => {
        console.error('Failed to load PayPal SDK', err);
        if (isMounted) {
          setPayError('Could not connect to PayPal gateway. Please try again.');
          setLoading(false);
        }
      };

      document.body.appendChild(script);
    };

    loadPayPalSdk();

    return () => {
      isMounted = false;
    };
  }, [currencyCode]);

  useEffect(() => {
    if (!sdkReady || !window.paypal || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    try {
      window.paypal.Buttons({
        style: {
          layout: 'vertical',
          color: 'gold',
          shape: 'rect',
          label: 'paypal',
          height: 48
        },

        // 1. Create order on backend
        createOrder: async () => {
          setPayError('');
          try {
            const res = await axios.post('/api/paypal/create-order', {
              items,
              totalAmount,
              currency: currencyCode
            });

            if (!res.data || !res.data.id) {
              throw new Error('No order ID returned from PayPal server.');
            }
            return res.data.id;
          } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Failed to initialize PayPal order.';
            setPayError(msg);
            if (onError) onError(msg);
            throw err;
          }
        },

        // 2. Capture authorized funds on backend
        onApprove: async (data) => {
          setPayError('');
          setLoading(true);
          try {
            const res = await axios.post('/api/paypal/capture-order', {
              orderId: data.orderID,
              items,
              buyerEmail: user?.email,
              buyerUsername: user?.username
            });

            if (res.data && res.data.success) {
              if (onSuccess) onSuccess(res.data);
            } else {
              throw new Error(res.data?.error || 'Payment capture could not be verified.');
            }
          } catch (err) {
            const msg = err.response?.data?.error || err.message || 'Payment capture failed.';
            setPayError(msg);
            if (onError) onError(msg);
          } finally {
            setLoading(false);
          }
        },

        onError: (err) => {
          console.error('PayPal Buttons Error:', err);
          const msg = 'PayPal encountered an error during checkout. Please try again.';
          setPayError(msg);
          if (onError) onError(msg);
        },

        onCancel: (data) => {
          console.log('PayPal Checkout Cancelled:', data);
        }
      }).render(containerRef.current);
    } catch (renderErr) {
      console.warn('PayPal render error:', renderErr);
    }
  }, [sdkReady, items, totalAmount, currencyCode, user, onSuccess, onError]);

  return (
    <div className="space-y-3">
      {payError && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-xs text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{payError}</span>
        </div>
      )}

      {loading && (
        <div className="py-6 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
          <span className="text-xs font-semibold">Connecting to PayPal Secure Checkout...</span>
        </div>
      )}

      <div ref={containerRef} className={loading ? 'hidden' : 'block'} />

      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>180-Day Buyer Protection</span>
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-blue-400" />
          <span>256-Bit SSL Encrypted</span>
        </span>
      </div>
    </div>
  );
};

export default PayPalSmartButtons;
