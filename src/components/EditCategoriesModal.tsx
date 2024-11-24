import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import { MealCategory } from '../types/types';

interface EditCategoriesModalProps {
  categories: MealCategory[];
  onAddCategory: (name: string) => Promise<void>;
  onDeleteCategory: (name: string) => Promise<void>;
  onRenameCategory: (oldName: string, newName: string) => Promise<void>;
  onClose: () => void;
}

export function EditCategoriesModal({
  categories,
  onAddCategory,
  onDeleteCategory,
  onRenameCategory,
  onClose
}: EditCategoriesModalProps) {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setError('Le nom de la catégorie est requis');
      return;
    }

    try {
      await onAddCategory(newCategory.trim());
      setNewCategory('');
      setError(null);
    } catch (error) {
      setError('Erreur lors de l\'ajout de la catégorie');
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (category: MealCategory) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${category}" ?`)) {
      return;
    }

    try {
      await onDeleteCategory(category);
    } catch (error) {
      setError('Erreur lors de la suppression de la catégorie');
      console.error('Error deleting category:', error);
    }
  };

  const handleStartEdit = (category: string) => {
    setEditingCategory(category);
    setNewName(category);
  };

  const handleSaveEdit = async () => {
    if (!editingCategory || !newName.trim()) return;
    if (newName === editingCategory) {
      setEditingCategory(null);
      return;
    }

    try {
      await onRenameCategory(editingCategory, newName.trim());
      setEditingCategory(null);
      setNewName('');
    } catch (error) {
      setError('Erreur lors du renommage de la catégorie');
      console.error('Error renaming category:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editingCategory) {
        handleSaveEdit();
      } else {
        handleAddCategory();
      }
    } else if (e.key === 'Escape') {
      if (editingCategory) {
        setEditingCategory(null);
        setNewName('');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-violet-400">Gérer les catégories</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X className="icon" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nouvelle catégorie"
              className="input flex-1"
            />
            <button
              onClick={handleAddCategory}
              className="btn btn-primary"
              disabled={!newCategory.trim()}
            >
              <Plus className="icon" />
              Ajouter
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-400">{error}</p>
          )}
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {categories.map((category) => (
            <div
              key={category}
              className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
            >
              {editingCategory === category ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input flex-1 mr-2"
                  autoFocus
                />
              ) : (
                <span className="text-gray-100">{category}</span>
              )}
              <div className="flex gap-2">
                {editingCategory === category ? (
                  <button
                    onClick={handleSaveEdit}
                    className="text-gray-400 hover:text-violet-400 transition-colors"
                  >
                    Sauvegarder
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartEdit(category)}
                    className="text-gray-400 hover:text-violet-400 transition-colors"
                  >
                    <Edit2 className="icon" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="icon" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}