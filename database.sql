-- Tables pour les repas et le planning
CREATE TABLE IF NOT EXISTS meals (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    categories JSON NOT NULL,
    ingredients JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS weekplan (
    id VARCHAR(36) PRIMARY KEY,
    dayOfWeek INT NOT NULL,
    requiredCategories JSON NOT NULL,
    excludedCategories JSON NOT NULL,
    selectedMealId VARCHAR(36),
    FOREIGN KEY (selectedMealId) REFERENCES meals(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tables pour les catégories et rayons
CREATE TABLE IF NOT EXISTS categories (
    name VARCHAR(50) PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS store_sections (
    name VARCHAR(50) PRIMARY KEY
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table pour la liste de courses
CREATE TABLE IF NOT EXISTS shopping_list (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    checked TINYINT(1) DEFAULT 0,
    meal_name VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index pour améliorer les performances
CREATE INDEX idx_weekplan_dayOfWeek ON weekplan(dayOfWeek);
CREATE INDEX idx_meals_name ON meals(name);
CREATE INDEX idx_shopping_list_category ON shopping_list(category);
CREATE INDEX idx_shopping_list_checked ON shopping_list(checked);

-- Insertion des catégories par défaut
INSERT IGNORE INTO categories (name) VALUES 
('Rapide'), ('Plaisir'), ('Équilibré'), ('Végétarien'), 
('Léger'), ('Longue préparation'), ('Pâtes'), ('En famille');

-- Insertion des rayons par défaut
INSERT IGNORE INTO store_sections (name) VALUES 
('Légumes'), ('Viande'), ('Produits Laitiers'), ('Épicerie'), 
('Charcuterie'), ('Boulangerie'), ('Surgelés'), ('Conserves'), 
('Boissons'), ('Autre');