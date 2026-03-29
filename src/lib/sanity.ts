import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SanityImageSource = any

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export async function getProjects() {
  return client.fetch(`
    *[_type == "project"] | order(order asc, _createdAt desc) {
      _id,
      title,
      location,
      year,
      client,
      typology,
      surface,
      status,
      category,
      mainImage,
      "gallery": gallery[]{
        _type,
        _key,
        // galleryImage
        image,
        caption,
        // gallerySlideshow
        slides[]{_key, asset, hotspot, crop},
        // galleryMap
        lat,
        lng
      },
      description,
      order
    }
  `)
}
