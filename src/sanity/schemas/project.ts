import { defineField, defineType } from 'sanity'

export const projectSchema = defineType({
  name: 'project',
  title: 'Proiect',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titlu proiect',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Locație',
      type: 'string',
      description: 'Ex: Satul Cosernița, Republica Moldova',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'An',
      type: 'string',
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'typology',
      title: 'Tipologie',
      type: 'string',
      options: {
        list: [
          { title: 'Rezidențial', value: 'Rezidențial' },
          { title: 'Comercial', value: 'Comercial' },
          { title: 'Turism', value: 'Turism' },
          { title: 'Civic / Cultural', value: 'Civic / Cultural' },
          { title: 'Industrial', value: 'Industrial' },
          { title: 'Peisagistică', value: 'Peisagistică' },
          { title: 'Interior', value: 'Interior' },
        ],
      },
    }),
    defineField({
      name: 'surface',
      title: 'Suprafață (m²)',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Concept', value: 'Concept' },
          { title: 'În execuție', value: 'În execuție' },
          { title: 'Finalizat', value: 'Finalizat' },
        ],
      },
    }),
    defineField({
      name: 'category',
      title: 'Categorie',
      type: 'string',
      options: {
        list: [
          { title: 'Arhitectură', value: 'Arhitectură' },
          { title: 'Interior', value: 'Interior' },
          { title: 'Peisagistică', value: 'Peisagistică' },
          { title: 'Urban', value: 'Urban' },
        ],
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Imagine principală',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie scroll orizontal',
      type: 'array',
      description: 'Adaugă și ordonează paneluri: imagini, slideshow automat sau hartă.',
      of: [
        {
          type: 'object',
          name: 'galleryImage',
          title: 'Imagine',
          fields: [
            { name: 'image', title: 'Imagine', type: 'image', options: { hotspot: true } },
            defineField({
              name: 'caption',
              title: 'Legendă (opțional)',
              type: 'text',
              rows: 6,
              validation: (Rule) => Rule.max(500),
              description: 'Max 500 caractere (inclusiv spații și aliniate)',
            }),
          ],
          preview: {
            select: { media: 'image', title: 'caption' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare(val: any) {
              return { title: val.title || 'Imagine', media: val.media }
            },
          },
        },
        {
          type: 'object',
          name: 'gallerySlideshow',
          title: 'Slideshow',
          fields: [
            {
              name: 'slides',
              title: 'Imagini slideshow',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }],
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              validation: (Rule: any) => Rule.min(1).error('Slideshow-ul trebuie să conțină cel puțin o imagine.'),
            },
          ],
          preview: {
            select: { slides: 'slides' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare(val: any) {
              return { title: `Slideshow — ${val.slides?.length || 0} imagini` }
            },
          },
        },
        {
          type: 'object',
          name: 'galleryMap',
          title: 'Locație (Hartă)',
          fields: [
            {
              name: 'lat',
              title: 'Latitudine',
              type: 'number',
              description: 'Ex: 47.0105',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              validation: (Rule: any) =>
                Rule.required()
                  .min(-90)
                  .max(90)
                  .error('Latitudinea trebuie să fie un număr între -90 și 90.'),
            },
            {
              name: 'lng',
              title: 'Longitudine',
              type: 'number',
              description: 'Ex: 28.8638',
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              validation: (Rule: any) =>
                Rule.required()
                  .min(-180)
                  .max(180)
                  .error('Longitudinea trebuie să fie un număr între -180 și 180.'),
            },
          ],
          preview: {
            select: { lat: 'lat', lng: 'lng' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare(val: any) {
              return { title: `Hartă — ${val.lat ?? '?'}, ${val.lng ?? '?'}` }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Descriere',
      type: 'array',
      description: 'Max ~800 caractere (inclusiv spații și aliniate) pentru a încăpea în container',
      of: [{ type: 'block' }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validation: (Rule) => Rule.custom((blocks: any[] | undefined) => {
        if (!blocks || blocks.length === 0) return true
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const text = blocks.map((b: any) =>
          b.children?.map((c: any) => c.text ?? '').join('') ?? ''
        ).join('\n')
        return text.length <= 800 || `Text prea lung — ${text.length}/800 caractere`
      }),
    }),
    defineField({
      name: 'order',
      title: 'Ordine afișare',
      type: 'number',
      description: 'Număr mai mic = apare primul',
      initialValue: 99,
    }),
  ],
  orderings: [
    {
      title: 'Ordine manuală',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'An descrescător',
      name: 'yearDesc',
      by: [{ field: 'year', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'mainImage',
    },
  },
})
