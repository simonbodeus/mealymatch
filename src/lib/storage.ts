import { Meal, DayPlan, MealCategory, IngredientCategory } from '../types/types';

const API_BASE = '/mealymatch/api';

interface SaveResponse {
  success: boolean;
  error?: string;
}

export async function fetchData() {
  try {
    const [mealsResponse, weekPlanResponse, categoriesResponse, storeSectionsResponse] = await Promise.all([
      fetch(`${API_BASE}/index.php?type=meals`),
      fetch(`${API_BASE}/index.php?type=weekplan`),
      fetch(`${API_BASE}/index.php?type=categories`),
      fetch(`${API_BASE}/index.php?type=store-sections`)
    ]);
    
    if (!mealsResponse.ok || !weekPlanResponse.ok || !categoriesResponse.ok || !storeSectionsResponse.ok) {
      throw new Error('Une ou plusieurs requêtes ont échoué');
    }
    
    const meals: Meal[] = await mealsResponse.json();
    const weekPlan: DayPlan[] = await weekPlanResponse.json();
    const categories: MealCategory[] = await categoriesResponse.json();
    const storeSections: IngredientCategory[] = await storeSectionsResponse.json();
    
    return { meals, weekPlan, categories, storeSections };
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export async function saveData(data: {
  meals?: Meal[],
  weekPlan?: DayPlan[],
  categories?: MealCategory[],
  storeSections?: IngredientCategory[]
}): Promise<SaveResponse> {
  try {
    const promises = [];
    
    if (data.meals) {
      for (const meal of data.meals) {
        promises.push(
          fetch(`${API_BASE}/index.php?type=meals`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(meal)
          })
        );
      }
    }
    
    if (data.weekPlan) {
      for (const plan of data.weekPlan) {
        promises.push(
          fetch(`${API_BASE}/index.php?type=weekplan`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plan)
          })
        );
      }
    }
    
    const results = await Promise.all(promises);
    const allSuccessful = results.every(res => res.ok);
    
    if (!allSuccessful) {
      throw new Error('Une ou plusieurs sauvegardes ont échoué');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error saving data:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Une erreur est survenue'
    };
  }
}