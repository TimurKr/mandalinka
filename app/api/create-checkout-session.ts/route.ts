import { NextRequest } from 'next/server';
import {
  useServerSupabase,
  useServerUser,
} from '@/lib/auth/server-supabase-provider';
import { stripe } from '@/lib/stripe/stripe';
import { createOrRetrieveCustomer } from '@/lib/stripe/webhook_updates';
import { getURL } from '@/lib/helpers';

export async function POST(req: NextRequest) {
  const { price, quantity = 1, metadata = {} } = await req.json();

  const supabase = useServerSupabase();
  const user = await useServerUser();

  try {
    const customer = await createOrRetrieveCustomer({
      uuid: user?.id || '',
      email: user?.email || '',
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata,
      },
      success_url: `${getURL()}/account`,
      cancel_url: `${getURL()}/`,
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
