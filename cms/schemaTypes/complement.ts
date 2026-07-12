import { defineType, defineField } from 'sanity';

export const complement = defineType({
  name: 'complement',
  title: 'Complementos / Adicionais',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome do Adicional',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Preço',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
  ],
});