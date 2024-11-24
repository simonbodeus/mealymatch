import React, { useState } from 'react';
import { Search, Plus, Edit } from 'lucide-react';
import { Meal, MealCategory } from '../types/types';
import { EditMealModal } from './EditMealModal';

interface MealListProps {
  meals: Meal[];
  onUpdateMeals: (meals: Meal[]) => void;
  onSelectMeal: (meal: Meal) => void;
}

export function MealList({ meals, onUpdateMeals, onSelectMeal }: MealListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<MealCategory[]>([]);
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>();
  const [isAddingMeal, setIsAddingMeal] = useState(false);

  const allCategories: MealCategory[] = [
    'Rapide', 'Plaisir', 'Équilibré', 'Végétarien', 'Léger',
    'Longue préparation', 'Pâtes', 'En famille'
  ];

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.every(category => meal.categories.includes(category));
    return matchesSearch && matchesCategories;
  });

  const handleSaveMeal = (meal: Meal) => {
    if (editingMeal) {
      onUpdateMeals(meals.map(m => m.id === meal.id ? meal : m));
    } else {
      onUpdateMeals([...meals, meal]);
    }
    setEditingMeal(undefined);
    setIsAddingMeal(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Repas</h2>
        <button
          onClick={() => setIsAddingMeal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Ajouter
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un repas..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          {allCategories.map((category) => (
            <button
              key={category}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategories.includes(category)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
              onClick={() => {
                setSelectedCategories(prev =>
                  prev.includes(category)
                    ? prev.filter(c => c !== category)
                    : [...prev, category]
                );
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4">
        {filteredMeals.map((meal) => (
          <div
            key={meal.id}
            className="p-4 border border-gray-200 rounded-lg hover:border-indigo-500"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-gray-800">{meal.name}</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {meal.categories.map((category) => (
                    <span
                      key={category}
                      className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setEditingMeal(meal)}
                className="p-2 text-gray-500 hover:text-indigo-600"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editingMeal || isAddingMeal) && (
        <EditMealModal
          meal={editingMeal}
          onSave={handleSaveMeal}
          onClose={() => {
            setEditingMeal(undefined);
            setIsAddingMeal(false);
          }}
        />
      )}
    </div>
  );
}