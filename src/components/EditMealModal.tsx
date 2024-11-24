import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Meal, MealCategory, IngredientCategory } from '../types/types';

interface EditMealModalProps {
  meal?: Meal;
  categories: MealCategory[];
  storeSections: IngredientCategory[];
  onSave: (meal: Meal) => void;
  onClose: () => void;
}

export function EditMealModal({ meal, categories, storeSections, onSave, onClose }: EditMealModalProps) {
  const [name, setName] = useState(meal?.name || '');
  const [selectedCategories, setSelectedCategories] = useState<MealCategory[]>(meal?.categories || []);
  const [ingredients, setIngredients] = useState(meal?.ingredients || []);

  const handleSave = () => {
    if (!name.trim()) {
      alert('Le nom du repas est requis');
      return;
    }

    onSave({
      id: meal?.id || Date.now().toString(),
      name: name.trim(),
      categories: selectedCategories,
      ingredients: ingredients.filter(ing => ing.name.trim())
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700 my-8 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-violet-400">
            {meal ? 'Modifier le repas' : 'Ajouter un repas'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X className="icon" />
          </button>
        </div>

        <div className="space-y-6 overflow-y-auto my-6 flex-grow">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full"
              placeholder="Nom du repas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Catégories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
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

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Ingrédients</label>
            {ingredients.map((ingredient, index) => (
              <div key={ingredient.id} className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index] = {
                      ...ingredient,
                      name: e.target.value
                    };
                    setIngredients(newIngredients);
                  }}
                  className="input flex-1 min-w-0"
                  placeholder="Nom de l'ingrédient"
                />
                <select
                  value={ingredient.category}
                  onChange={(e) => {
                    const newIngredients = [...ingredients];
                    newIngredients[index] = {
                      ...ingredient,
                      category: e.target.value as IngredientCategory
                    };
                    setIngredients(newIngredients);
                  }}
                  className="select w-36 flex-shrink-0"
                >
                  {storeSections.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setIngredients(ingredients.filter((_, i) => i !== index));
                  }}
                  className="btn btn-secondary flex-shrink-0"
                >
                  <Trash2 className="icon" />
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                setIngredients([
                  ...ingredients,
                  {
                    id: Date.now().toString(),
                    name: '',
                    category: storeSections[0]
                  }
                ]);
              }}
              className="btn btn-secondary mt-2"
            >
              <Plus className="icon" /> Ajouter un ingrédient
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={!name.trim()}
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}