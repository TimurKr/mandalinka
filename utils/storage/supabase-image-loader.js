const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function supabaseLoader({ src, width, quality }) {
  return `${supabaseUrl}/storage/v1/object/public/${src}`;
}
