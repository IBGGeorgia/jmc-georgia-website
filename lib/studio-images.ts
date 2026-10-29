/** User-approved and repository-verified studio assets. Keep originals for all editorial / detail content. */
export const studioImages:Record<string,string>={
 'vigus':'/images/studio/vigus-studio.webp',
 'grand-avenue':'/images/studio/grand-avenue-studio.webp',
 'grand-avenue-pro':'/images/studio/grand-avenue-pro-studio.webp'
};
export function studioImageFor(slug:string,fallback?:string){return studioImages[slug]||fallback||''}
