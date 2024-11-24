## Instructions d'upload

1. Créez un dossier `mealymatch` à la racine de votre hébergement

2. Uploadez les fichiers dans cet ordre précis :

   a. D'abord les fichiers de configuration :
   ```
   mealymatch/
   ├── .htaccess           # Configuration Apache principale
   └── api/
       ├── .htaccess       # Configuration Apache pour l'API
       └── config.php      # Configuration de la base de données
   ```

   b. Ensuite le fichier index.html et l'API :
   ```
   mealymatch/
   ├── index.html         # Page principale
   └── api/
       └── index.php      # Gestion des requêtes API
   ```

   c. Enfin, les assets compilés :
   ```
   mealymatch/
   └── assets/           # Dossier généré par le build
       ├── main.[hash].js    # JavaScript compilé
       └── main.[hash].css   # CSS compilé
   ```

3. Permissions des fichiers :
   ```
   Dossiers :
   mealymatch/     -> 755
   mealymatch/api/ -> 755
   mealymatch/assets/ -> 755

   Fichiers :
   .htaccess      -> 644
   api/.htaccess  -> 644
   index.html     -> 644
   api/index.php  -> 644
   api/config.php -> 600
   assets/*       -> 644
   ```

4. Vérifications importantes :
   - Les chemins dans index.html doivent pointer vers `/mealymatch/assets/`
   - Les fichiers .htaccess doivent être correctement chargés
   - Le fichier config.php doit avoir les bonnes permissions
   - Les types MIME doivent être correctement configurés

5. En cas de problème :
   - Vérifiez les logs PHP dans api/php_errors.log
   - Vérifiez les logs Apache
   - Testez l'API directement avec un outil comme Postman