import React, { useState } from 'react';
import { WeeklyPlanner } from './components/WeeklyPlanner';
import { ShoppingList } from './components/ShoppingList';
import { Settings } from './components/Settings';
import { Layout } from './components/Layout';
import { useSharedStorage } from './hooks/useSharedStorage';

export default function App() {
  const {
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
    addCategory,
    deleteCategory,
    renameCategory,
    addStoreSection,
    deleteStoreSection,
    renameStoreSection,
    loading
  } = useSharedStorage();
  
  const [showSettings, setShowSettings] = useState(false);

  const handleAddItem = async (item: Omit<ShoppingListItem, 'id' | 'checked'>) => {
    const newItem = {
      ...item,
      id: `manual-${Date.now()}`,
      checked: false
    };
    try {
      await updateShoppingListItem(newItem);
    } catch (error) {
      console.error('Error adding shopping list item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  return (
    <Layout showSettings={showSettings} onToggleSettings={() => setShowSettings(!showSettings)}>
      {showSettings ? (
        <Settings
          meals={meals}
          categories={categories}
          storeSections={storeSections}
          onUpdateMeals={updateMeals}
          onDeleteMeal={deleteMeal}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
          onRenameCategory={renameCategory}
          onAddStoreSection={addStoreSection}
          onDeleteStoreSection={deleteStoreSection}
          onRenameStoreSection={renameStoreSection}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <WeeklyPlanner
              weekPlan={weekPlan}
              meals={meals}
              categories={categories}
              onUpdatePlan={updateWeekPlan}
              onUpdateFullWeek={updateFullWeekPlan}
            />
          </div>
          <div>
            <ShoppingList
              items={shoppingList}
              meals={meals}
              categories={categories}
              storeSections={storeSections}
              onToggleItem={updateShoppingListItem}
              onAddItem={handleAddItem}
              onDeleteItem={deleteShoppingListItem}
              onUpdateMeal={updateMeals}
            />
          </div>
        </div>
      )}
    </Layout>
  );
}