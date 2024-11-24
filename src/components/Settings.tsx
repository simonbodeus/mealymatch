import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Settings as SettingsIcon } from 'lucide-react';
import { Meal, MealCategory, IngredientCategory } from '../types/types';
import { EditMealModal } from './EditMealModal';
import { EditCategoriesModal } from './EditCategoriesModal';
import { EditStoreSectionsModal } from './EditStoreSectionsModal';

interface SettingsProps {
  meals: Meal[];
  categories: MealCategory[];
  storeSections: IngredientCategory[];
  onUpdateMeals: (meal: Meal) => Promise<void>;
  onDeleteMeal: (mealId: string) => Promise<void>;
  onAddCategory: (name: string) => Promise<void>;
  onDeleteCategory: (name: string) => Promise<void>;
  onRenameCategory: (oldName: string, newName: string) => Promise<void>;
  onAddStoreSection: (name: string) => Promise<void>;
  onDeleteStoreSection: (name: string) => Promise<void>;
  onRenameStoreSection: (oldName: string, newName: string) => Promise<void>;
}

export function Settings({
  meals,
  categories,
  storeSections,
  onUpdateMeals,
  onDeleteMeal,
  onAddCategory,
  onDeleteCategory,
  onRenameCategory,
  onAddStoreSection,
  onDeleteStoreSection,
  onRenameStoreSection
}: SettingsProps) {
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>();
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<MealCategory[]>([]);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showStoreSectionsModal, setShowStoreSectionsModal] = useState(false);

  const filteredMeals = meals.filter(meal => {
    const matchesSearch = meal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategories = selectedCategories.length === 0 || 
      selectedCategories.every(category => meal.categories.includes(category));
    return matchesSearch && matchesCategories;
  });

  const handleSaveMeal = async (meal: Meal) => {
    try {
      await onUpdateMeals(meal);
      setEditingMeal(undefined);
      setIsAddingMeal(false);
    } catch (error) {
      console.error('Error saving meal:', error);
      alert('Erreur lors de la sauvegarde du repas');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowCategoriesModal(true)}
          className="btn btn-secondary"
        >
          <SettingsIcon className="icon" />
          Gérer les catégories
        </button>
        <button
          onClick={() => setShowStoreSectionsModal(true)}
          className="btn btn-secondary"
        >
          <SettingsIcon className="icon" />
          Gérer les rayons
        </button>
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-violet-400">Repas</h2>
          <button
            onClick={() => setIsAddingMeal(true)}
            className="btn btn-primary"
          >
            <Plus className="icon" />
            Ajouter un repas
          </button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 icon" />
            <input
              type="text"
              placeholder="Rechercher un repas..."
              className="input pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategories(prev =>
                    prev.includes(category)
                      ? prev.filter(c => c !== category)
                      : [...prev, category]
                  );
                }}
                className={`tag ${
                  selectedCategories.includes(category)
                    ? 'tag-primary'
                    : 'tag-neutral'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredMeals.map((meal) => (
            <div
              key={meal.id}
              className="p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-100">{meal.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {meal.categories.map((category) => (
                      <span
                        key={category}
                        className="tag tag-secondary"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-400">Ingrédients:</h4>
                    <ul className="mt-1 text-sm text-gray-300">
                      {meal.ingredients.map((ingredient) => (
                        <li key={ingredient.id}>
                          {ingredient.name} ({ingredient.category})
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingMeal(meal)}
                    className="text-gray-300 hover:text-violet-400 transition-colors"
                  >
                    <Edit className="icon" />
                  </button>
                  <button
                    onClick={() => onDeleteMeal(meal.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="icon" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {(editingMeal || isAddingMeal) && (
        <EditMealModal
          meal={editingMeal}
          categories={categories}
          storeSections={storeSections}
          onSave={handleSaveMeal}
          onClose={() => {
            setEditingMeal(undefined);
            setIsAddingMeal(false);
          }}
        />
      )}

      {showCategoriesModal && (
        <EditCategoriesModal
          categories={categories}
          onAddCategory={onAddCategory}
          onDeleteCategory={onDeleteCategory}
          onRenameCategory={onRenameCategory}
          onClose={() => setShowCategoriesModal(false)}
        />
      )}

      {showStoreSectionsModal && (
        <EditStoreSectionsModal
          sections={storeSections}
          onAddSection={onAddStoreSection}
          onDeleteSection={onDeleteStoreSection}
          onRenameSection={onRenameStoreSection}
          onClose={() => setShowStoreSectionsModal(false)}
        />
      )}
    </div>
  );
}