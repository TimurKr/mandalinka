import { useState } from 'react';
import { useRouter } from 'next/router';
import cn from 'classnames';

import Button from '@/components_deprecated/ui/Button';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { useUser } from '@/utils/useUser';

import { Price, ProductWithPrice } from 'types';

interface Props {
  products: ProductWithPrice[];
}

type BillingInterval = 'year' | 'month';

export default function Pricing({ products }: Props) {
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const { user, isLoading, subscription } = useUser();

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      return router.push('/signin');
    }
    if (subscription) {
      return router.push('/account');
    }

    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price },
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (!products.length)
    return (
      <section className="bg-black">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-24 lg:px-8">
          <div className="sm:align-center sm:flex sm:flex-col"></div>
          <p className="text-6xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    );

  return (
    <section className="bg-black">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Pricing Plans
          </h1>
          <p className="m-auto mt-5 max-w-2xl text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Start building for free, then add a site plan to go live. Account
            plans unlock additional features.
          </p>
          <div className="relative mt-6 flex self-center rounded-lg border border-zinc-800 bg-zinc-900 p-0.5 sm:mt-8">
            <button
              onClick={() => setBillingInterval('month')}
              type="button"
              className={`${
                billingInterval === 'month'
                  ? 'relative w-1/2 border-zinc-800 bg-zinc-700 text-white shadow-sm'
                  : 'relative ml-0.5 w-1/2 border border-transparent text-zinc-400'
              } m-1 whitespace-nowrap rounded-md py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 sm:w-auto sm:px-8`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingInterval('year')}
              type="button"
              className={`${
                billingInterval === 'year'
                  ? 'relative w-1/2 border-zinc-800 bg-zinc-700 text-white shadow-sm'
                  : 'relative ml-0.5 w-1/2 border border-transparent text-zinc-400'
              } m-1 whitespace-nowrap rounded-md py-2 text-sm font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 sm:w-auto sm:px-8`}
            >
              Yearly billing
            </button>
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:grid sm:grid-cols-2 sm:gap-6 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            );
            if (!price) return null;
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency,
              minimumFractionDigits: 0,
            }).format((price?.unit_amount || 0) / 100);
            return (
              <div
                key={product.id}
                className={cn(
                  'divide-y divide-zinc-600 rounded-lg bg-zinc-900 shadow-sm',
                  {
                    'border border-pink-500': subscription
                      ? product.name === subscription?.prices?.products?.name
                      : product.name === 'Freelancer',
                  }
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold leading-6 text-white">
                    {product.name}
                  </h2>
                  <p className="mt-4 text-zinc-300">{product.description}</p>
                  <p className="mt-8">
                    <span className="white text-5xl font-extrabold">
                      {priceString}
                    </span>
                    <span className="text-base font-medium text-zinc-100">
                      /{billingInterval}
                    </span>
                  </p>
                  <Button
                    variant="slim"
                    type="button"
                    disabled={isLoading}
                    loading={priceIdLoading === price.id}
                    onClick={() => handleCheckout(price)}
                    className="mt-8 block w-full rounded-md py-2 text-center text-sm font-semibold text-white hover:bg-zinc-900"
                  >
                    {product.name === subscription?.prices?.products?.name
                      ? 'Manage'
                      : 'Subscribe'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <p className="mt-24 text-center text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
            Brought to you by
          </p>
          <div className="my-12 flex flex-col items-center space-y-4 sm:mt-8 sm:grid sm:grid-cols-5 sm:gap-6 sm:space-y-0 md:mx-auto md:max-w-2xl">
            <div className="flex items-center justify-start">
              <a href="https://nextjs.org" aria-label="Next.js Link">
                <img
                  src="/nextjs.svg"
                  alt="Next.js Logo"
                  className="h-12 text-white"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a href="https://vercel.com" aria-label="Vercel.com Link">
                <img
                  src="/vercel.svg"
                  alt="Vercel.com Logo"
                  className="h-6 text-white"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a href="https://stripe.com" aria-label="stripe.com Link">
                <img
                  src="/stripe.svg"
                  alt="stripe.com Logo"
                  className="h-12 text-white"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a href="https://supabase.io" aria-label="supabase.io Link">
                <img
                  src="/supabase.svg"
                  alt="supabase.io Logo"
                  className="h-10 text-white"
                />
              </a>
            </div>
            <div className="flex items-center justify-start">
              <a href="https://github.com" aria-label="github.com Link">
                <img
                  src="/github.svg"
                  alt="github.com Logo"
                  className="h-8 text-white"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
