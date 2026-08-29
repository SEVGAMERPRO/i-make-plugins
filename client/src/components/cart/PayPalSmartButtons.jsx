import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useCurrency } from '../../context/CurrencyContext';
import { ShieldCheck, Lock, Loader2, AlertCircle } from 'lucide-react';

const PAYPAL_CLIENT_ID = 'BAAREs6NlWG9nBdVzwe1KQHe1hHWrFYLEeAABbw-c020J-zlnJR-pvWi67vlxnASrz6BWSSrQS4oNMsqPQ';

const PayPalSmartButtons = ({ 
  items, 
  totalAmount, 
  onSuccess, 
  onError,
  isSubscription = false,
  billingCycle = 'monthly',
  subscriptionPlanId = null,
  donation = 0
}) => {
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
      const scriptId = isSubscription ? 'paypal-sdk-subscription-script' : 'paypal-sdk-script';
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
      const sdkUrl = isSubscription
        ? `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currencyCode}&vault=true&intent=subscription&components=buttons`
        : `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=${currencyCode}&intent=capture&components=buttons`;

      script.src = sdkUrl;
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
  }, [currencyCode, isSubscription]);

  useEffect(() => {
    if (!sdkReady || !window.paypal || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    try {
      if (isSubscription) {
        // Recurring Subscription Button Mode
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'pill',
            label: 'subscribe',
            height: 48
          },

          createSubscription: async (data, actions) => {
            setPayError('');
            try {
              let activePlanId = subscriptionPlanId;
              if (!activePlanId) {
                const res = await axios.get(`/api/paypal/subscription-plan?cycle=${billingCycle}`);
                activePlanId = res.data?.planId;
              }

              if (!activePlanId) {
                throw new Error('Could not retrieve active subscription plan from PayPal.');
              }

              return actions.subscription.create({
                plan_id: activePlanId
              });
            } catch (err) {
              const msg = err.response?.data?.error || err.message || 'Failed to initialize subscription checkout.';
              setPayError(msg);
              if (onError) onError(msg);
              throw err;
            }
          },

          onApprove: async (data) => {
            setPayError('');
            setLoading(true);
            try {
              const res = await axios.post('/api/paypal/verify-subscription', {
                subscriptionId: data.subscriptionID,
                buyerEmail: user?.email,
                buyerUsername: user?.username,
                billingCycle,
                tip: donation
              });

              if (res.data && res.data.success) {
                if (onSuccess) onSuccess({ ...res.data, orderID: data.subscriptionID, subscriptionID: data.subscriptionID });
              } else {
                throw new Error(res.data?.error || 'Subscription verification failed.');
              }
            } catch (err) {
              const msg = err.response?.data?.error || err.message || 'Subscription verification failed.';
              setPayError(msg);
              if (onError) onError(msg);
            } finally {
              setLoading(false);
            }
          },

          onError: (err) => {
            console.error('PayPal Subscription Button Error:', err);
            const msg = 'PayPal encountered an error during subscription checkout. Please try again.';
            setPayError(msg);
            if (onError) onError(msg);
          },

          onCancel: (data) => {
            console.log('PayPal Subscription Cancelled:', data);
          }
        }).render(containerRef.current);
      } else {
        // Standard One-Time Order Button Mode
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'pill',
            label: 'paypal',
            height: 48
          },

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
      }
    } catch (renderErr) {
      console.warn('PayPal render error:', renderErr);
    }
  }, [sdkReady, items, totalAmount, currencyCode, isSubscription, billingCycle, subscriptionPlanId, donation, user, onSuccess, onError]);

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

      <div ref={containerRef} className={loading ? 'hidden' : 'block rounded-2xl overflow-hidden'} />

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
