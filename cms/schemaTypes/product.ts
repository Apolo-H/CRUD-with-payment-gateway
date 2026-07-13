import {defineType, defineField} from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Produtos',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Nome do Produto',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descrição / Ingredientes',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Preço Base',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'Foto do Produto',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'complements',
      title: 'Adicionais Disponíveis',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'complement'}]}],
    }),
    // Adicione este bloco dentro do array de fields no seu arquivo do schema:
    defineField({
      name: 'slug',
      title: 'URL Amigável (Slug)',
      type: 'slug',
      options: {
        source: 'name', // Gera o slug automaticamente baseado no Nome do Produto
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
