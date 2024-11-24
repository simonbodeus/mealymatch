import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { DayPlan } from '../types/types';

const initialWeekPlan: DayPlan[] = [
  { id: '1', dayOfWeek: 0, requiredCategories: [], excludedCategories: [] },
  { id: '2', dayOfWeek: 1, requiredCategories: [], excludedCategories: [] },
  { id: '3', dayOfWeek: 2, requiredCategories: [], excludedCategories: [] },
  { id: '4', dayOfWeek: 3, requiredCategories: [], excludedCategories: [] },
  { id: '5', dayOfWeek: 4, requiredCategories: [], excludedCategories: [] },
  { id: '6', dayOfWeek: 5, requiredCategories: [], excludedCategories: [] },
  { id: '7', dayOfWeek: 6, requiredCategories: [], excludedCategories: [] },
];

export function useSupabaseWeekPlan() {
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeekPlan();
    
    const channel = supabase
      .channel('weekplan')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'weekplan' }, () => {
        fetchWeekPlan();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchWeekPlan() {
    try {
      const { data, error } = await supabase
        .from('weekplan')
        .select('*')
        .order('dayOfWeek');

      if (error) throw error;

      if (data.length === 0) {
        // Si la table est vide, on insère le planning initial
        await supabase.from('weekplan').insert(initialWeekPlan);
        const { data: initialData } = await supabase
          .from('weekplan')
          .select('*')
          .order('dayOfWeek');
        setWeekPlan(initialData || []);
      } else {
        setWeekPlan(data);
      }
    } catch (error) {
      console.error('Error fetching week plan:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateWeekPlan(newPlan: DayPlan) {
    try {
      await supabase
        .from('weekplan')
        .update(newPlan)
        .eq('id', newPlan.id);
    } catch (error) {
      console.error('Error updating week plan:', error);
    }
  }

  return { weekPlan, updateWeekPlan, loading };
}