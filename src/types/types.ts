export type IngredientCategory =
  | 'Légumes'
  | 'Viande'
  | 'Produits Laitiers'
  | 'Épicerie'
  | 'Charcuterie'
  | 'Boulangerie'
  | 'Surgelés'
  | 'Conserves'
  | 'Boissons'
  | 'Autre';

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  quantity?: number;
  unit?: string;
}

export type MealCategory =
  | 'Rapide'
  | 'Plaisir'
  | 'Équilibré'
  | 'Végétarien'
  | 'Léger'
  | 'Longue préparation'
  | 'Pâtes'
  | 'En famille';

export interface Meal {
  id: string;
  name: string;
  ingredients: Ingredient[];
  categories: MealCategory[];
  created_at?: string;
}

export interface DayPlan {
  id: string;
  dayOfWeek: number;
  requiredCategories: MealCategory[];
  excludedCategories: MealCategory[];
  selectedMealId?: string;
  created_at?: string;
}

export interface ShoppingListItem extends Ingredient {
  checked: boolean;
  mealName?: string;
  created_at?: string;
}