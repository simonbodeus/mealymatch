import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2 } from 'lucide-react';
import { IngredientCategory } from '../types/types';

interface EditStoreSectionsModalProps {
  sections: IngredientCategory[];
  onAddSection: (name: string) => Promise<void>;
  onDeleteSection: (name: string) => Promise<void>;
  onRenameSection: (oldName: string, newName: string) => Promise<void>;
  onClose: () => void;
}

export function EditStoreSectionsModal({
  sections,
  onAddSection,
  onDeleteSection,
  onRenameSection,
  onClose
}: EditStoreSectionsModalProps) {
  const [newSection, setNewSection] = useState('');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAddSection = async () => {
    if (!newSection.trim()) {
      setError('Le nom du rayon est requis');
      return;
    }

    try {
      await onAddSection(newSection.trim());
      setNewSection('');
      setError(null);
    } catch (error) {
      setError('Erreur lors de l\'ajout du rayon');
      console.error('Error adding store section:', error);
    }
  };

  const handleDeleteSection = async (section: IngredientCategory) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le rayon "${section}" ?`)) {
      return;
    }

    try {
      await onDeleteSection(section);
    } catch (error) {
      setError('Erreur lors de la suppression du rayon');
      console.error('Error deleting store section:', error);
    }
  };

  const handleStartEdit = (section: string) => {
    setEditingSection(section);
    setNewName(section);
  };

  const handleSaveEdit = async () => {
    if (!editingSection || !newName.trim()) return;
    if (newName === editingSection) {
      setEditingSection(null);
      return;
    }

    try {
      await onRenameSection(editingSection, newName.trim());
      setEditingSection(null);
      setNewName('');
    } catch (error) {
      setError('Erreur lors du renommage du rayon');
      console.error('Error renaming store section:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editingSection) {
        handleSaveEdit();
      } else {
        handleAddSection();
      }
    } else if (e.key === 'Escape') {
      if (editingSection) {
        setEditingSection(null);
        setNewName('');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-violet-400">Gérer les rayons du magasin</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-300">
            <X className="icon" />
          </button>
        </div>

        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSection}
              onChange={(e) => setNewSection(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nouveau rayon"
              className="input flex-1"
            />
            <button
              onClick={handleAddSection}
              className="btn btn-primary"
              disabled={!newSection.trim()}
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
          {sections.map((section) => (
            <div
              key={section}
              className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
            >
              {editingSection === section ? (
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="input flex-1 mr-2"
                  autoFocus
                />
              ) : (
                <span className="text-gray-100">{section}</span>
              )}
              <div className="flex gap-2">
                {editingSection === section ? (
                  <button
                    onClick={handleSaveEdit}
                    className="text-gray-400 hover:text-violet-400 transition-colors"
                  >
                    Sauvegarder
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartEdit(section)}
                    className="text-gray-400 hover:text-violet-400 transition-colors"
                  >
                    <Edit2 className="icon" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteSection(section)}
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