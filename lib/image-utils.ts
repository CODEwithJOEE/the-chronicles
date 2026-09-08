// lib/image-utils.ts
export function getImageUrl(imagePath: string | null): string | null {
  if (!imagePath) return null;

  // If it's already a full URL, return it
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Construct full URL from Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/article-images/${imagePath}`;
}
