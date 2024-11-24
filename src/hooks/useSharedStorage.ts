import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Meal, DayPlan, MealCategory, IngredientCategory, ShoppingListItem } from '../types/types';

export function useSharedStorage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([]);
  const [categories, setCategories] = useState<MealCategory[]>([]);
  const [storeSections, setStoreSections] = useState<IngredientCategory[]>([]);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [mealsData, weekPlanData] = await Promise.all([
        supabase.from('meals').select('*').order('name'),
        supabase.from('weekplan').select('*').order('dayofweek')
      ]);

      if (mealsData.error) throw mealsData.error;
      if (weekPlanData.error) throw weekPlanData.error;

      setMeals(mealsData.data || []);
      
      // Transform weekplan data to match our frontend model
      const transformedWeekPlan = (weekPlanData.data || []).map(plan => ({
        id: plan.id,
        dayOfWeek: plan.dayofweek,
        requiredCategories: plan.requiredcategories,
        excludedCategories: plan.excludedcategories,
        selectedMealId: plan.selectedmealid,
        created_at: plan.created_at
      }));
      
      setWeekPlan(transformedWeekPlan);

      // Set default categories and store sections
      setCategories([
        'Rapide', 'Plaisir', 'Équilibré', 'Végétarien', 'Léger',
        'Longue préparation', 'Pâtes', 'En famille'
      ]);
      
      setStoreSections([
        'Légumes', 'Viande', 'Produits Laitiers', 'Épicerie',
        'Charcuterie', 'Boulangerie', 'Surgelés', 'Conserves',
        'Boissons', 'Autre'
      ]);

      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to realtime changes
    const mealsSubscription = supabase
      .channel('meals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meals' }, fetchData)
      .subscribe();

    const weekPlanSubscription = supabase
      .channel('weekplan-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'weekplan' }, fetchData)
      .subscribe();

    return () => {
      supabase.removeChannel(mealsSubscription);
      supabase.removeChannel(weekPlanSubscription);
    };
  }, []);

  const updateMeals = async (meal: Meal): Promise<void> => {
    try {
      const { error } = await supabase
        .from('meals')
        .upsert(meal);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating meal:', error);
      throw error;
    }
  };

  const deleteMeal = async (mealId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting meal:', error);
      throw error;
    }
  };

  const updateWeekPlan = async (dayPlan: DayPlan): Promise<void> => {
    try {
      // Transform the data to match the database schema
      const dbDayPlan = {
        id: dayPlan.id,
        dayofweek: dayPlan.dayOfWeek,
        requiredcategories: dayPlan.requiredCategories,
        excludedcategories: dayPlan.excludedCategories,
        selectedmealid: dayPlan.selectedMealId
      };

      const { error } = await supabase
        .from('weekplan')
        .upsert(dbDayPlan);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating week plan:', error);
      throw error;
    }
  };

  const updateFullWeekPlan = async (newWeekPlan: DayPlan[]): Promise<void> => {
    try {
      // Transform the data to match the database schema
      const dbWeekPlan = newWeekPlan.map(plan => ({
        id: plan.id,
        dayofweek: plan.dayOfWeek,
        requiredcategories: plan.requiredCategories,
        excludedcategories: plan.excludedCategories,
        selectedmealid: plan.selectedMealId
      }));

      const { error } = await supabase
        .from('weekplan')
        .upsert(dbWeekPlan);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating full week plan:', error);
      throw error;
    }
  };

  const updateShoppingListItem = async (item: ShoppingListItem): Promise<void> => {
    try {
      // Transform the data to match the database schema
      const dbItem = {
        id: item.id,
        name: item.name,
        category: item.category,
        checked: item.checked,
        mealname: item.mealName
      };

      const { error } = await supabase
        .from('shopping_list')
        .upsert(dbItem);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating shopping list item:', error);
      throw error;
    }
  };

  const deleteShoppingListItem = async (itemId: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('shopping_list')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting shopping list item:', error);
      throw error;
    }
  };

  return {
    meals,
    weekPlan,
    categories,
    storeSections,
    shoppingList,
    updateMeals,
    deleteMeal,
    updateWeekPlan,
    updateFullWeekPlan,
    updateShoppingListItem,
    deleteShoppingListItem,
    loading,
    error
  };
}