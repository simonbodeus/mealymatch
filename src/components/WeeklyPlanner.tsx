import React, { useState } from 'react';
import { Calendar, Plus, Minus, Shuffle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { DayPlan, Meal, MealCategory } from '../types/types';

interface WeeklyPlannerProps {
  weekPlan: DayPlan[];
  meals: Meal[];
  categories: MealCategory[];
  onUpdatePlan: (dayPlan: DayPlan) => void;
  onUpdateFullWeek: (weekPlan: DayPlan[]) => void;
}

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const dayColors = {
  0: 'border-[#F09EA7]',
  1: 'border-[#F6CA94]',
  2: 'border-[#FAFABE]',
  3: 'border-[#C1EBC0]',
  4: 'border-[#C7CAFF]',
  5: 'border-[#CDABEB]',
  6: 'border-[#F6C2F3]',
};

const dayTextColors = {
  0: 'text-[#F09EA7]',
  1: 'text-[#F6CA94]',
  2: 'text-[#FAFABE]',
  3: 'text-[#C1EBC0]',
  4: 'text-[#C7CAFF]',
  5: 'text-[#CDABEB]',
  6: 'text-[#F6C2F3]',
};

export function WeeklyPlanner({ weekPlan, meals, categories, onUpdatePlan, onUpdateFullWeek }: WeeklyPlannerProps) {
  const [expandedDays, setExpandedDays] = useState<{ [key: string]: boolean }>({});

  const toggleDayExpansion = (dayId: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayId]: !prev[dayId]
    }));
  };

  const getUsedMealIds = (): string[] => {
    return weekPlan
      .map(day => day.selectedMealId)
      .filter((id): id is string => id !== undefined);
  };

  const getMealSuggestions = (dayPlan: DayPlan, excludeIds: string[] = []): Meal[] => {
    return meals.filter(meal => {
      const hasRequiredCategories = dayPlan.requiredCategories.every(
        category => meal.categories.includes(category)
      );
      const hasNoExcludedCategories = dayPlan.excludedCategories.every(
        category => !meal.categories.includes(category)
      );
      const isNotUsed = !excludeIds.includes(meal.id);
      return hasRequiredCategories && hasNoExcludedCategories && isNotUsed;
    });
  };

  const generateRandomMeal = async (dayPlan: DayPlan) => {
    if (!window.confirm(`Voulez-vous vraiment générer un nouveau repas aléatoire pour ${daysOfWeek[dayPlan.dayOfWeek]} ?`)) {
      return;
    }

    const usedMealIds = getUsedMealIds().filter(id => id !== dayPlan.selectedMealId);
    const suggestions = getMealSuggestions(dayPlan, usedMealIds);
    
    if (suggestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * suggestions.length);
      await onUpdatePlan({
        ...dayPlan,
        selectedMealId: suggestions[randomIndex].id
      });
    } else {
      alert('Aucun repas disponible avec les contraintes actuelles');
    }
  };

  const generateRandomWeek = async () => {
    if (!window.confirm('Voulez-vous vraiment générer un nouveau planning aléatoire pour toute la semaine ?')) {
      return;
    }

    const newWeekPlan = [...weekPlan];
    const usedMealIds: string[] = [];

    const shuffledIndices = Array.from({ length: weekPlan.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);

    for (const index of shuffledIndices) {
      const dayPlan = newWeekPlan[index];
      const suggestions = getMealSuggestions(dayPlan, usedMealIds);
      
      if (suggestions.length > 0) {
        const randomIndex = Math.floor(Math.random() * suggestions.length);
        const selectedMeal = suggestions[randomIndex];
        newWeekPlan[index] = {
          ...dayPlan,
          selectedMealId: selectedMeal.id
        };
        usedMealIds.push(selectedMeal.id);
      } else {
        newWeekPlan[index] = {
          ...dayPlan,
          selectedMealId: undefined
        };
      }
    }

    await onUpdateFullWeek(newWeekPlan);
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Calendar className="icon-lg text-violet-400" />
          <h2 className="text-2xl font-bold text-violet-400">Planning de la semaine</h2>
        </div>
        <button
          onClick={generateRandomWeek}
          className="btn bg-violet-600 hover:bg-violet-700 text-white"
          title="Générer un planning aléatoire pour toute la semaine"
        >
          <Shuffle className="icon" />
          Générer la semaine
        </button>
      </div>
      
      <div className="grid gap-4">
        {weekPlan.map((dayPlan) => (
          <div 
            key={dayPlan.id} 
            className={`p-4 rounded-lg border-2 bg-gray-800 ${dayColors[dayPlan.dayOfWeek]}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-lg font-semibold ${dayTextColors[dayPlan.dayOfWeek]}`}>
                {daysOfWeek[dayPlan.dayOfWeek]}
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => generateRandomMeal(dayPlan)}
                  className="btn btn-secondary"
                  title="Générer un nouveau repas aléatoire pour ce jour"
                >
                  <RefreshCw className="icon" />
                </button>
                <button
                  onClick={() => toggleDayExpansion(dayPlan.id)}
                  className="btn btn-secondary"
                >
                  {expandedDays[dayPlan.id] ? (
                    <ChevronUp className="icon" />
                  ) : (
                    <ChevronDown className="icon" />
                  )}
                </button>
              </div>
            </div>

            <div className="mb-4 space-y-4">
              <select
                className="select w-full"
                value={dayPlan.selectedMealId || ''}
                onChange={(e) => onUpdatePlan({
                  ...dayPlan,
                  selectedMealId: e.target.value || undefined
                })}
              >
                <option value="">Sélectionner un repas</option>
                {getMealSuggestions(dayPlan, getUsedMealIds().filter(id => id !== dayPlan.selectedMealId)).map((meal) => (
                  <option key={meal.id} value={meal.id}>
                    {meal.name}
                  </option>
                ))}
              </select>
            </div>

            {expandedDays[dayPlan.id] && (
              <div className="mb-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Catégories requises:</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={`req-${category}`}
                        onClick={() => {
                          onUpdatePlan({
                            ...dayPlan,
                            requiredCategories: dayPlan.requiredCategories.includes(category)
                              ? dayPlan.requiredCategories.filter(c => c !== category)
                              : [...dayPlan.requiredCategories, category]
                          });
                        }}
                        className={`tag ${
                          dayPlan.requiredCategories.includes(category)
                            ? 'tag-success'
                            : 'tag-neutral'
                        }`}
                      >
                        {dayPlan.requiredCategories.includes(category) ? (
                          <Minus className="icon" />
                        ) : (
                          <Plus className="icon" />
                        )}
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Catégories exclues:</h4>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <button
                        key={`excl-${category}`}
                        onClick={() => {
                          onUpdatePlan({
                            ...dayPlan,
                            excludedCategories: dayPlan.excludedCategories.includes(category)
                              ? dayPlan.excludedCategories.filter(c => c !== category)
                              : [...dayPlan.excludedCategories, category]
                          });
                        }}
                        className={`tag ${
                          dayPlan.excludedCategories.includes(category)
                            ? 'tag-danger'
                            : 'tag-neutral'
                        }`}
                      >
                        {dayPlan.excludedCategories.includes(category) ? (
                          <Minus className="icon" />
                        ) : (
                          <Plus className="icon" />
                        )}
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!expandedDays[dayPlan.id] && (dayPlan.requiredCategories.length > 0 || dayPlan.excludedCategories.length > 0) && (
              <div className="mb-4 space-y-2">
                {dayPlan.requiredCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {dayPlan.requiredCategories.map(category => (
                      <span key={`active-req-${category}`} className="tag tag-success">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
                {dayPlan.excludedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {dayPlan.excludedCategories.map(category => (
                      <span key={`active-excl-${category}`} className="tag tag-danger">
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}