import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Meal } from '../types/types';
import { defaultMeals } from '../data/meals';

export function useSupabaseMeals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeals();
    
    const channel = supabase
      .channel('meals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meals' }, () => {
        fetchMeals();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMeals() {
    try {
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data.length === 0) {
        // Si la table est vide, on insère les repas par défaut
        await supabase.from('meals').insert(defaultMeals);
        const { data: initialData } = await supabase
          .from('meals')
          .select('*')
          .order('name');
        setMeals(initialData || []);
      } else {
        setMeals(data);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateMeals(newMeals: Meal[]) {
    try {
      // Supprimer tous les repas existants
      await supabase.from('meals').delete().neq('id', '0');
      // Insérer les nouveaux repas
      await supabase.from('meals').insert(newMeals);
      await fetchMeals();
    } catch (error) {
      console.error('Error updating meals:', error);
    }
  }

  return { meals, setMeals: updateMeals, loading };
}