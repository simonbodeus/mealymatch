import { Meal } from '../types/types';

export const defaultMeals: Meal[] = [
  {
    id: '1',
    name: 'Champi riz moutarde',
    categories: ['Équilibré', 'Léger', 'Végétarien'],
    ingredients: [
      { id: '1-1', name: 'Riz', category: 'Épicerie' },
      { id: '1-2', name: 'Champignons', category: 'Légumes' },
      { id: '1-3', name: 'Moutarde', category: 'Épicerie' },
      { id: '1-4', name: 'Crème', category: 'Produits Laitiers' }
    ]
  },
  {
    id: '2',
    name: 'Escalope dinde et purée',
    categories: ['Plaisir', 'Rapide'],
    ingredients: [
      { id: '2-1', name: 'Escalope de dinde', category: 'Viande' },
      { id: '2-2', name: 'Pommes de terre', category: 'Légumes' },
      { id: '2-3', name: 'Beurre', category: 'Produits Laitiers' },
      { id: '2-4', name: 'Lait', category: 'Produits Laitiers' }
    ]
  },
  {
    id: '3',
    name: 'Tomates farcies',
    categories: ['Longue préparation', 'Équilibré'],
    ingredients: [
      { id: '3-1', name: 'Tomates', category: 'Légumes' },
      { id: '3-2', name: 'Viande hachée', category: 'Viande' },
      { id: '3-3', name: 'Riz', category: 'Épicerie' },
      { id: '3-4', name: 'Oignons', category: 'Légumes' }
    ]
  },
  {
    id: '4',
    name: 'Gratin de légumes',
    categories: ['Végétarien', 'Équilibré', 'En famille'],
    ingredients: [
      { id: '4-1', name: 'Légumes variés', category: 'Légumes' },
      { id: '4-2', name: 'Crème', category: 'Produits Laitiers' },
      { id: '4-3', name: 'Fromage râpé', category: 'Produits Laitiers' }
    ]
  },
  {
    id: '5',
    name: 'Pâtes Ketchup',
    categories: ['Rapide', 'Pâtes', 'Végétarien', 'Plaisir'],
    ingredients: [
      { id: '5-1', name: 'Pâtes', category: 'Épicerie' },
      { id: '5-2', name: 'Ketchup', category: 'Épicerie' }
    ]
  },
  {
    id: '6',
    name: 'Pâtes carbonara',
    categories: ['Rapide', 'Pâtes'],
    ingredients: [
      { id: '6-1', name: 'Pâtes', category: 'Épicerie' },
      { id: '6-2', name: 'Lardons', category: 'Charcuterie' },
      { id: '6-3', name: 'Crème', category: 'Produits Laitiers' },
      { id: '6-4', name: 'Parmesan', category: 'Produits Laitiers' }
    ]
  },
  {
    id: '7',
    name: 'Pâtes Bolo',
    categories: ['Rapide', 'Pâtes', 'Plaisir'],
    ingredients: [
      { id: '7-1', name: 'Pâtes', category: 'Épicerie' },
      { id: '7-2', name: 'Sauce bolognaise', category: 'Épicerie' },
      { id: '7-3', name: 'Parmesan', category: 'Produits Laitiers' }
    ]
  },
  {
    id: '8',
    name: 'Frisée aux lardons',
    categories: ['Végétarien', 'Rapide', 'Léger', 'Équilibré'],
    ingredients: [
      { id: '8-1', name: 'Frisée', category: 'Légumes' },
      { id: '8-2', name: 'Lardons', category: 'Charcuterie' },
      { id: '8-3', name: 'Vinaigrette', category: 'Épicerie' }
    ]
  },
  {
    id: '9',
    name: 'Soupe tartines',
    categories: ['Rapide', 'Équilibré', 'Végétarien', 'Léger'],
    ingredients: [
      { id: '9-1', name: 'Soupe au choix', category: 'Épicerie' },
      { id: '9-2', name: 'Pain', category: 'Boulangerie' }
    ]
  },
  {
    id: '10',
    name: 'Potée liégeoise',
    categories: ['Équilibré', 'Longue préparation'],
    ingredients: [
      { id: '10-1', name: 'Pommes de terre', category: 'Légumes' },
      { id: '10-2', name: 'Haricots verts', category: 'Légumes' },
      { id: '10-3', name: 'Lardons', category: 'Charcuterie' }
    ]
  },
  {
    id: '11',
    name: 'Durum',
    categories: ['Plaisir', 'Longue préparation'],
    ingredients: [
      { id: '11-1', name: 'Galette', category: 'Boulangerie' },
      { id: '11-2', name: 'Poulet', category: 'Viande' },
      { id: '11-3', name: 'Crudités', category: 'Légumes' },
      { id: '11-4', name: 'Sauce blanche', category: 'Épicerie' }
    ]
  },
  {
    id: '12',
    name: 'Hamburger maison',
    categories: ['Plaisir', 'Longue préparation', 'En famille'],
    ingredients: [
      { id: '12-1', name: 'Pain à hamburger', category: 'Boulangerie' },
      { id: '12-2', name: 'Viande hachée', category: 'Viande' },
      { id: '12-3', name: 'Fromage', category: 'Produits Laitiers' },
      { id: '12-4', name: 'Garnitures', category: 'Légumes' }
    ]
  },
  {
    id: '13',
    name: 'Dagobert',
    categories: ['En famille'],
    ingredients: [
      { id: '13-1', name: 'Pain', category: 'Boulangerie' },
      { id: '13-2', name: 'Jambon', category: 'Charcuterie' },
      { id: '13-3', name: 'Fromage', category: 'Produits Laitiers' },
      { id: '13-4', name: 'Crudités', category: 'Légumes' }
    ]
  },
  {
    id: '14',
    name: 'Croque Monsieur',
    categories: ['En famille', 'Rapide'],
    ingredients: [
      { id: '14-1', name: 'Pain de mie', category: 'Boulangerie' },
      { id: '14-2', name: 'Jambon', category: 'Charcuterie' },
      { id: '14-3', name: 'Fromage', category: 'Produits Laitiers' }
    ]
  },
  {
    id: '15',
    name: 'Pain perdu',
    categories: ['Rapide', 'Végétarien'],
    ingredients: [
      { id: '15-1', name: 'Pain rassis', category: 'Boulangerie' },
      { id: '15-2', name: 'Lait', category: 'Produits Laitiers' },
      { id: '15-3', name: 'Œufs', category: 'Produits Laitiers' },
      { id: '15-4', name: 'Sucre', category: 'Épicerie' }
    ]
  },
  {
    id: '16',
    name: 'Œufs',
    categories: ['Rapide', 'Végétarien'],
    ingredients: [
      { id: '16-1', name: 'Œufs', category: 'Produits Laitiers' },
      { id: '16-2', name: 'Accompagnements variés', category: 'Autre' }
    ]
  },
  {
    id: '17',
    name: 'Pizza',
    categories: ['Longue préparation', 'En famille', 'Plaisir'],
    ingredients: [
      { id: '17-1', name: 'Pâte à pizza', category: 'Boulangerie' },
      { id: '17-2', name: 'Sauce tomate', category: 'Épicerie' },
      { id: '17-3', name: 'Garnitures', category: 'Autre' }
    ]
  },
  {
    id: '18',
    name: 'Lasagne',
    categories: ['Rapide'],
    ingredients: [
      { id: '18-1', name: 'Pâtes à lasagne', category: 'Épicerie' },
      { id: '18-2', name: 'Sauce bolognaise', category: 'Épicerie' },
      { id: '18-3', name: 'Fromage', category: 'Produits Laitiers' }
    ]
  },
  {
    id: '19',
    name: 'Mix de légumes',
    categories: ['En famille', 'Équilibré', 'Végétarien'],
    ingredients: [
      { id: '19-1', name: 'Légumes variés', category: 'Légumes' },
      { id: '19-2', name: 'Assaisonnements', category: 'Épicerie' }
    ]
  },
  {
    id: '20',
    name: 'Nuggets frites',
    categories: ['En famille'],
    ingredients: [
      { id: '20-1', name: 'Nuggets de poulet', category: 'Surgelés' },
      { id: '20-2', name: 'Pommes de terre', category: 'Légumes' }
    ]
  },
  {
    id: '21',
    name: 'Steak haché petit pois carotte',
    categories: ['Équilibré', 'Rapide'],
    ingredients: [
      { id: '21-1', name: 'Steak haché', category: 'Viande' },
      { id: '21-2', name: 'Petits pois', category: 'Conserves' },
      { id: '21-3', name: 'Carottes', category: 'Légumes' }
    ]
  },
  {
    id: '22',
    name: 'Pâtes brocoli',
    categories: ['Équilibré', 'Pâtes'],
    ingredients: [
      { id: '22-1', name: 'Pâtes', category: 'Épicerie' },
      { id: '22-2', name: 'Brocolis', category: 'Légumes' },
      { id: '22-3', name: 'Crème', category: 'Produits Laitiers' }
    ]
  },
  {
    id: '23',
    name: 'Poulet rôti',
    categories: ['Plaisir'],
    ingredients: [
      { id: '23-1', name: 'Poulet entier', category: 'Viande' },
      { id: '23-2', name: 'Assaisonnements', category: 'Épicerie' }
    ]
  },
  {
    id: '24',
    name: 'Soupe chinoise',
    categories: ['Équilibré', 'Léger'],
    ingredients: [
      { id: '24-1', name: 'Nouilles chinoises', category: 'Épicerie' },
      { id: '24-2', name: 'Bouillon', category: 'Épicerie' },
      { id: '24-3', name: 'Légumes', category: 'Légumes' }
    ]
  },
  {
    id: '25',
    name: 'Nouille poulet',
    categories: ['En famille', 'Longue préparation'],
    ingredients: [
      { id: '25-1', name: 'Nouilles', category: 'Épicerie' },
      { id: '25-2', name: 'Poulet', category: 'Viande' },
      { id: '25-3', name: 'Sauce asiatique', category: 'Épicerie' }
    ]
  },
  {
    id: '26',
    name: 'Pâtes poulet curry',
    categories: ['Pâtes'],
    ingredients: [
      { id: '26-1', name: 'Pâtes', category: 'Épicerie' },
      { id: '26-2', name: 'Poulet', category: 'Viande' },
      { id: '26-3', name: 'Sauce curry', category: 'Épicerie' }
    ]
  },
  {
    id: '27',
    name: 'Cordon bleu purée',
    categories: ['Rapide'],
    ingredients: [
      { id: '27-1', name: 'Cordon bleu', category: 'Surgelés' },
      { id: '27-2', name: 'Pommes de terre', category: 'Légumes' },
      { id: '27-3', name: 'Beurre', category: 'Produits Laitiers' }
    ]
  },
  {
    id: '28',
    name: 'Vol au vent',
    categories: ['Rapide', 'Équilibré'],
    ingredients: [
      { id: '28-1', name: 'Vol-au-vent', category: 'Surgelés' },
      { id: '28-2', name: 'Riz ou frites', category: 'Épicerie' }
    ]
  },
  {
    id: '29',
    name: 'Pâtes froides',
    categories: ['Pâtes'],
    ingredients: [
      { id: '29-1', name: 'Pâtes', category: 'Épicerie' },
      { id: '29-2', name: 'Crudités', category: 'Légumes' },
      { id: '29-3', name: 'Sauce', category: 'Épicerie' }
    ]
  }
];