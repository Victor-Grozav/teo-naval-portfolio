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
      title: 'Galerie imagini (scroll orizontal)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'image', title: 'Imagine', type: 'image', options: { hotspot: true } },
            { name: 'caption', title: 'Legendă (opțional)', type: 'string' },
          ],
          preview: {
            select: { media: 'image', title: 'caption' },
            prepare({ media, title }) {
              return { title: title || 'Imagine', media }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Descriere',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordonate hartă',
      type: 'object',
      description: 'Adaugă coordonatele GPS pentru a afișa proiectul pe hartă',
      fields: [
        {
          name: 'lat',
          title: 'Latitudine',
          type: 'number',
          description: 'Ex: 47.0105',
        },
        {
          name: 'lng',
          title: 'Longitudine',
          type: 'number',
          description: 'Ex: 28.8638',
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Ordine afișare',
      type: 'number',
      description: 'Număr mai mic = apare primul',
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
