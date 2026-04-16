import { Post } from '../types/post';

export const DEFAULT_POST: Post = {
  id: '',
  title: 'Blue Fox Aquarismo',
  description: 'A Blue Fox Aquarismo é uma plataforma educacional criada para compartilhar conhecimento real e acessível sobre aquários, peixes, plantas aquáticas e manutenção.',
  image: 'assets/images/aquariums/aquariums2.webp',
  date: '24 de Março de 2026',
  category: 'Itens do Aquarismo',
  slug: 'aquarium-selection-guide',
  readingTime: '8 min',
  author: 'Felipe Ferraz',
};

export const POST_MOCK: Post[] = [
  {
    id: '1',
    title: 'Guia Completo: Como Escolher o Aquário Ideal para Seu Projeto',
    description:
      'Descubra como escolher o aquário ideal para o seu projeto, entendendo os diferentes materiais, estruturas e fatores que influenciam diretamente na estética, durabilidade e no bem-estar dos peixes.',
    image: 'assets/images/aquariums/aquariums2.webp',
    date: '24 de Março de 2026',
    category: 'Itens do Aquarismo',
    slug: 'aquarium-selection-guide',
    readingTime: '8 min',
    author: 'Felipe Ferraz',
  },
  {
    id: '2',
    title: 'Tamanhos de Aquário: Guia de Dimensões e Proporções',
    description:
      'Descubra como as dimensões influenciam na iluminação e na escolha dos peixes. Veja proporções para iniciantes, aquapaisagismo e jumbos.',
    image: 'assets/images/aquariums/aquariums4.webp',
    date: '28 de Março de 2026',
    category: 'Fundamentos do Aquarismo',
    slug: 'aquarium-size',
    readingTime: '12 min',
    author: 'Felipe Ferraz',
  },
  {
    id: '3',
    title: 'Vidro de Aquário Curvado: Entenda o Perigo da Barriga',
    description:
      'Descubra por que o efeito barriga (vidro de aquário curvado) acontece e como travas francesas ou transversais podem salvar seu projeto.',
    image: 'assets/images/aquariums/aquarium-glass-bowing.webp',
    date: '2 de Abril de 2026',
    category: 'Problemas no Aquarismo',
    slug: 'aquarium-glass-bowing-danger',
    readingTime: '8 min',
    author: 'Felipe Ferraz',
  },
  {
    id: '4',
    title: 'Peixe Betta: 7 Cuidados Essenciais para Ele Viver Mais',
    description:
      'Descubra os 7 cuidados essenciais para garantir que seu peixe viva mais e com saúde. Melhore a água, a dieta e o ambiente do seu aquário.',
    image: 'assets/images/fish/betta-fish.webp',
    date: '13 de Abril de 2026',
    category: 'Cuidados com Peixes',
    slug: 'betta-fish-7-care-tips',
    readingTime: '10 min',
    author: 'Felipe Ferraz',
  }
];
