import { getURL } from '@/utils/helpers';
import { getServerUser } from '@/utils/auth/server';
import { getServerSupabase } from '@/utils/supabase/server';
import { createOrRetrieveCustomer } from '@/utils/stripe/webhook_updates';
import { stripe } from '@/utils/stripe/stripe';

export async function POST() {
  const supabase = getServerSupabase();
  const user = await getServerUser();

  try {
    if (!user) throw Error('Could not get user');

    const customer = await createOrRetrieveCustomer({
      uuid: user.id || '',
      email: user.email || '',
    });

    if (!customer) throw Error('Could not get or create a customer');

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`,
    });

    return new Response(JSON.stringify({ url }), {
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
