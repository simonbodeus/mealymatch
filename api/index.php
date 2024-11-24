<?php
// Headers CORS et type de contenu
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Activer la journalisation des erreurs
ini_set('display_errors', 1);
ini_set('log_errors', 1);
error_reporting(E_ALL);
ini_set('error_log', 'php_errors.log');

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

function logError($message, $data = null) {
    $logMessage = date('Y-m-d H:i:s') . " - " . $message;
    if ($data) {
        $logMessage .= " - Data: " . json_encode($data);
    }
    error_log($logMessage);
}

try {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $type = $_GET['type'] ?? '';
        logError("GET request received for type: " . $type);
        
        switch ($type) {
            case 'shopping-list':
                $stmt = $pdo->query('SELECT * FROM shopping_list ORDER BY category, name');
                $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($items as &$item) {
                    $item['checked'] = (bool)$item['checked'];
                }
                echo json_encode(['success' => true, 'data' => $items]);
                break;

            case 'meals':
                $stmt = $pdo->query('SELECT * FROM meals ORDER BY name');
                $meals = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($meals as &$meal) {
                    $meal['categories'] = json_decode($meal['categories']);
                    $meal['ingredients'] = json_decode($meal['ingredients']);
                }
                echo json_encode(['success' => true, 'data' => $meals]);
                break;

            case 'weekplan':
                $stmt = $pdo->query('SELECT * FROM weekplan ORDER BY dayOfWeek');
                $weekplan = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($weekplan as &$day) {
                    $day['requiredCategories'] = json_decode($day['requiredCategories']);
                    $day['excludedCategories'] = json_decode($day['excludedCategories']);
                }
                echo json_encode(['success' => true, 'data' => $weekplan]);
                break;

            case 'categories':
                $stmt = $pdo->query('SELECT name FROM categories ORDER BY name');
                $categories = $stmt->fetchAll(PDO::FETCH_COLUMN);
                echo json_encode(['success' => true, 'data' => $categories]);
                break;

            case 'store-sections':
                $stmt = $pdo->query('SELECT name FROM store_sections ORDER BY name');
                $sections = $stmt->fetchAll(PDO::FETCH_COLUMN);
                echo json_encode(['success' => true, 'data' => $sections]);
                break;

            default:
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Type de données invalide']);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        logError("POST request received", $input);

        if (!$input) {
            throw new Exception('Données invalides');
        }

        $type = $input['type'] ?? '';
        $data = $input['data'] ?? null;

        if (!$data) {
            throw new Exception('Données manquantes');
        }

        switch ($type) {
            case 'shopping-list-item':
                logError("Processing shopping list item", $data);
                
                if (empty($data['id']) || empty($data['name']) || empty($data['category'])) {
                    throw new Exception('Données d\'article invalides');
                }

                $stmt = $pdo->prepare('
                    INSERT INTO shopping_list (id, name, category, checked, meal_name)
                    VALUES (:id, :name, :category, :checked, :meal_name)
                    ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    category = VALUES(category),
                    checked = VALUES(checked),
                    meal_name = VALUES(meal_name)
                ');

                $params = [
                    'id' => $data['id'],
                    'name' => $data['name'],
                    'category' => $data['category'],
                    'checked' => $data['checked'] ? 1 : 0,
                    'meal_name' => $data['mealName'] ?? null
                ];

                if (!$stmt->execute($params)) {
                    $error = $stmt->errorInfo();
                    logError("Database error", $error);
                    throw new Exception('Erreur lors de la sauvegarde: ' . $error[2]);
                }

                echo json_encode(['success' => true, 'data' => $data]);
                break;

            case 'delete-shopping-list-item':
                logError("Processing shopping list item deletion", $data);
                
                if (empty($data['id'])) {
                    throw new Exception('ID d\'article manquant');
                }

                $stmt = $pdo->prepare('DELETE FROM shopping_list WHERE id = :id');
                
                if (!$stmt->execute(['id' => $data['id']])) {
                    $error = $stmt->errorInfo();
                    logError("Database error", $error);
                    throw new Exception('Erreur lors de la suppression: ' . $error[2]);
                }

                echo json_encode(['success' => true, 'data' => $data]);
                break;

            case 'meals':
                logError("Processing meal save", $data);
                
                if (empty($data['id']) || empty($data['name'])) {
                    throw new Exception('ID et nom du repas requis');
                }
                
                $stmt = $pdo->prepare('
                    INSERT INTO meals (id, name, categories, ingredients)
                    VALUES (:id, :name, :categories, :ingredients)
                    ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    categories = VALUES(categories),
                    ingredients = VALUES(ingredients)
                ');
                
                $params = [
                    'id' => $data['id'],
                    'name' => $data['name'],
                    'categories' => json_encode($data['categories'] ?? []),
                    'ingredients' => json_encode($data['ingredients'] ?? [])
                ];
                
                if (!$stmt->execute($params)) {
                    $error = $stmt->errorInfo();
                    logError("Database error", $error);
                    throw new Exception('Erreur lors de la sauvegarde du repas');
                }
                
                echo json_encode(['success' => true, 'data' => $data]);
                break;

            case 'delete_meal':
                logError("Processing meal deletion", $data);
                
                if (empty($data['id'])) {
                    throw new Exception('ID du repas requis');
                }
                
                $stmt = $pdo->prepare('DELETE FROM meals WHERE id = :id');
                if (!$stmt->execute(['id' => $data['id']])) {
                    $error = $stmt->errorInfo();
                    logError("Database error", $error);
                    throw new Exception('Erreur lors de la suppression du repas');
                }
                
                echo json_encode(['success' => true, 'data' => $data]);
                break;

            case 'weekplan':
                logError("Processing weekplan save", $data);
                
                if (!isset($data['id']) || !isset($data['dayOfWeek'])) {
                    throw new Exception('ID et jour de la semaine requis');
                }
                
                $stmt = $pdo->prepare('
                    INSERT INTO weekplan (id, dayOfWeek, requiredCategories, excludedCategories, selectedMealId)
                    VALUES (:id, :dayOfWeek, :requiredCategories, :excludedCategories, :selectedMealId)
                    ON DUPLICATE KEY UPDATE
                    dayOfWeek = VALUES(dayOfWeek),
                    requiredCategories = VALUES(requiredCategories),
                    excludedCategories = VALUES(excludedCategories),
                    selectedMealId = VALUES(selectedMealId)
                ');
                
                $params = [
                    'id' => $data['id'],
                    'dayOfWeek' => $data['dayOfWeek'],
                    'requiredCategories' => json_encode($data['requiredCategories'] ?? []),
                    'excludedCategories' => json_encode($data['excludedCategories'] ?? []),
                    'selectedMealId' => $data['selectedMealId'] ?? null
                ];
                
                if (!$stmt->execute($params)) {
                    $error = $stmt->errorInfo();
                    logError("Database error", $error);
                    throw new Exception('Erreur lors de la sauvegarde du planning');
                }
                
                echo json_encode(['success' => true, 'data' => $data]);
                break;

            case 'rename_category':
                logError("Processing category rename", $data);
                
                if (empty($data['oldName']) || empty($data['newName'])) {
                    throw new Exception('Ancien et nouveau noms requis');
                }
                
                // Mettre à jour le nom de la catégorie
                $stmt = $pdo->prepare('UPDATE categories SET name = :newName WHERE name = :oldName');
                if (!$stmt->execute(['oldName' => $data['oldName'], 'newName' => $data['newName']])) {
                    $error = $stmt->errorInfo();
                    logError("Database error", $error);
                    throw new Exception('Erreur lors du renommage de la catégorie');
                }
                
                // Mettre à jour les catégories dans les repas
                $stmt = $pdo->query('SELECT id, categories FROM meals');
                $meals = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                foreach ($meals as $meal) {
                    $categories = json_decode($meal['categories'], true);
                    $updated = false;
                    
                    for ($i = 0; $i < count($categories); $i++) {
                        if ($categories[$i] === $data['oldName']) {
                            $categories[$i] = $data['newName'];
                            $updated = true;
                        }
                    }
                    
                    if ($updated) {
                        $stmt = $pdo->prepare('UPDATE meals SET categories = :categories WHERE id = :id');
                        $stmt->execute([
                            'id' => $meal['id'],
                            'categories' => json_encode($categories)
                        ]);
                    }
                }
                
                echo json_encode(['success' => true, 'data' => $data]);
                break;

            case 'delete_category':
                logError("Processing category delete", $data);
                
                if (empty($data['name'])) {
                    throw new Exception('Nom de la catégorie requis');
                }
                
                $stmt = $pdo->prepare('DELETE FROM categories WHERE name = :name');
                if (!$stmt->execute(['name' => $data['name']])) {
                    $error = $stmt->errorInfo();
                    logError("Database error", $error);
                    throw new Exception('Erreur lors de la suppression de la catégorie');
                }
                
                echo json_encode(['success' => true, 'data' => $data]);
                break;

            case 'store-sections':
                logError("Processing store section save", $data);
                
                if (empty($data['name'])) {
                    throw new Exception('Nom du rayon requis');
                }
                
                $stmt = $pdo->prepare('INSERT INTO store_sections (name) VALUES (:name)');
                if (!$stmt->execute(['name' => $data['name']])) {
                    $error = $stmt->errorInfo();
                    logError("Database error", $error);
                    throw new Exception('Erreur lors de la sauvegarde du rayon');
                }
                
                echo json_encode(['success' => true, 'data' => $data]);
                break;

            case 'rename_store_section':
                logError("Processing store section rename", $data);
                
                if (empty($data['oldName']) || empty($data['newName'])) {
                    throw new Exception('Ancien et nouveau noms requis');
                }
                
                // Mettre à jour le nom du rayon
                $stmt = $pdo->prepare('UPDATE store_sections SET name = :newName WHERE name = :oldName');
                if (!$stmt->execute(['oldName' => $data['oldName'], 'newName' => $data['newName']])) {
                    $error = $stmt->errorInfo();
                    logError("Database error", $error);
                    throw new Exception('Erreur lors du renommage du rayon');
                }
                
                // Mettre à jour les rayons dans les ingrédients des repas
                $stmt = $pdo->query('SELECT id, ingredients FROM meals');
                $meals = $stmt->fetchAll(PDO::FETCH_ASSOC);
                
                foreach ($meals as $meal) {
                    $ingredients = json_decode($meal['ingredients'], true);
                    $updated = false;
                    
                    foreach ($ingredients as &$ingredient) {
                        if ($ingredient['category'] === $data['oldName']) {
                            $ingredient['category'] = $data['newName'];
                            $updated = true;
                        }
                    }
                    
                    if ($updated) {
                        $stmt = $pdo->prepare('UPDATE meals SET ingredients = :ingredients WHERE id = :id');
                        $stmt->execute([
                            'id' => $meal['id'],
                            'ingredients' => json_encode($ingredients)
                        ]);
                    }
                }
                
                // Mettre à jour les rayons dans la liste de courses
                $stmt = $pdo->prepare('UPDATE shopping_list SET category = :newName WHERE category = :oldName');
                $stmt->execute(['oldName' => $data['oldName'], 'newName' => $data['newName']]);
                
                echo json_encode(['success' => true, 'data' => $data]);
                break;

            case 'delete_store_section':
                logError("Processing store section delete", $data);
                
                if (empty($data['name'])) {
                    throw new Exception('Nom du rayon requis');
                }
                
                $stmt = $pdo->prepare('DELETE FROM store_sections WHERE name = :name');
                if (!$stmt->execute(['name' => $data['name']])) {
                    $error = $stmt->errorInfo();
                    logError("Database error", $error);
                    throw new Exception('Erreur lors de la suppression du rayon');
                }
                
                echo json_encode(['success' => true, 'data' => $data]);
                break;

            default:
                http_response_code(400);
                echo json_encode(['success' => false, 'error' => 'Type de données invalide']);
        }
    }
} catch (Exception $e) {
    logError("Exception caught: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} catch (PDOException $e) {
    logError("PDO Exception caught: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur de base de données: ' . $e->getMessage()]);
}