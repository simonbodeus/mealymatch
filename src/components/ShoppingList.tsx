import React, { useState } from 'react';
import { ShoppingCart, Check, Plus, Trash2, Edit2 } from 'lucide-react';
import { ShoppingListItem, IngredientCategory, Meal } from '../types/types';
import { EditMealModal } from './EditMealModal';

interface ShoppingListProps {
  items: ShoppingListItem[];
  storeSections: IngredientCategory[];
  meals: Meal[]; // Ajout des repas
  categories: string[]; // Ajout des catégories
  onToggleItem: (item: ShoppingListItem) => void;
  onAddItem: (item: Omit<ShoppingListItem, 'id' | 'checked'>) => void;
  onDeleteItem: (itemId: string) => void;
  onUpdateMeal: (meal: Meal) => void; // Ajout de la fonction de mise à jour des repas
}

export function ShoppingList({ 
  items, 
  storeSections,
  meals,
  categories,
  onToggleItem, 
  onAddItem, 
  onDeleteItem,
  onUpdateMeal
}: ShoppingListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<IngredientCategory>(storeSections[0] || 'Autre');
  const [editingMeal, setEditingMeal] = useState<Meal | undefined>();

  // Extraire les catégories uniques des articles existants pour l'affichage
  const usedCategories = Array.from(new Set(items.map(item => item.category))).sort();

  // Trier les articles par nom dans chaque catégorie
  const sortedItemsByCategory = usedCategories.map(category => ({
    category,
    items: items
      .filter(item => item.category === category)
      .sort((a, b) => a.name.localeCompare(b.name, 'fr', { sensitivity: 'base' }))
  }));

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAddItem({
        name: newItemName.trim(),
        category: newItemCategory,
      });
      setNewItemName('');
      setNewItemCategory(storeSections[0] || 'Autre');
      setShowAddModal(false);
    }
  };

  const handleDeleteConfirm = (itemId: string) => {
    onDeleteItem(itemId);
    setShowDeleteConfirm(null);
  };

  const handleMealClick = (mealName: string) => {
    const meal = meals.find(m => m.name === mealName);
    if (meal) {
      setEditingMeal(meal);
    }
  };
  
  return (
    <div className="card p-6">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="icon-lg text-violet-400" />
        <h2 className="text-2xl font-bold text-violet-400">Liste de courses</h2>
      </div>

      {sortedItemsByCategory.map(({ category, items: categoryItems }) => {
        if (categoryItems.length === 0) return null;

        return (
          <div key={category} className="mb-6">
            <h3 className="text-lg font-semibold text-violet-300 mb-3">{category}</h3>
            <div className="space-y-2">
              {categoryItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 hover:bg-gray-700 rounded-lg group"
                >
                  <button
                    className={`w-5 h-5 rounded border flex-shrink-0 ${
                      item.checked
                        ? 'bg-violet-600 border-violet-600'
                        : 'border-gray-500'
                    } flex items-center justify-center`}
                    onClick={() => onToggleItem({ ...item, checked: !item.checked })}
                  >
                    {item.checked && <Check className="w-4 h-4 text-white" />}
                  </button>
                  <div className="flex flex-col flex-1">
                    <span className={item.checked ? 'line-through text-gray-500' : 'text-gray-200'}>
                      {item.name}
                    </span>
                    {item.mealName && (
                      <button
                        onClick={() => handleMealClick(item.mealName!)}
                        className="text-sm text-violet-400 hover:text-violet-300 text-left flex items-center gap-1"
                      >
                        <span>Pour: {item.mealName}</span>
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => setShowDeleteConfirm(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-all"
                  >
                    <Trash2 className="icon" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <button
        className="mt-4 w-full py-2 px-4 bg-violet-600 text-white rounded-lg hover:bg-violet-700 flex items-center justify-center gap-2"
        onClick={() => setShowAddModal(true)}
      >
        <Plus className="icon" />
        Ajouter un article
      </button>

      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-violet-400 mb-4">Ajouter un article</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom de l'article
                </label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="input"
                  placeholder="Nom de l'article"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Rayon
                </label>
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as IngredientCategory)}
                  className="select w-full"
                >
                  {storeSections.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={handleAddItem}
                className="btn btn-primary"
                disabled={!newItemName.trim()}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
            <h3 className="text-xl font-bold text-violet-400 mb-4">Confirmer la suppression</h3>
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer cet article de la liste de courses ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteConfirm(showDeleteConfirm)}
                className="btn bg-red-600 hover:bg-red-700 text-white"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {editingMeal && (
        <EditMealModal
          meal={editingMeal}
          categories={categories}
          storeSections={storeSections}
          onSave={onUpdateMeal}
          onClose={() => setEditingMeal(undefined)}
        />
      )}
    </div>
  );
}