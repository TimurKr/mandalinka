import { GetStaticPropsResult } from 'next';

import Pricing from '@/components_deprecated/ui/Pricing';
import { getActiveProductsWithPrices } from '@/utils_deprecated/supabase-client';
import { Product } from 'types';

interface Props {
  products: Product[];
}

export default function PricingPage({ products }: Props) {
  return <Pricing products={products} />;
}

export async function getStaticProps(): Promise<GetStaticPropsResult<Props>> {
  const products = await getActiveProductsWithPrices();

  return {
    props: {
      products,
    },
    revalidate: 60,
  };
}
