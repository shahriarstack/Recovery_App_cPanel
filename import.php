<?php
// import.php
// This script imports both database schema and data from neon_backup.json into the MySQL database.
// RUN THIS ONCE AFTER UPLOADING TO CPANEL.

require_once 'config.php';

// Set extremely long timeout and memory limit for large imports
ini_set('memory_limit', '1G');
ini_set('max_execution_time', '3000');
set_time_limit(3000);

echo "<h1>Data Import Tool</h1>";
echo "<p>Starting import...</p>";
ob_flush(); flush();

$pdo = getDbConnection();

// STEP 1: Import Schema
$schemaFile = __DIR__ . '/schema_mysql.sql';
if (file_exists($schemaFile)) {
    echo "<p>Found schema file. Creating tables...</p>";
    ob_flush(); flush();
    try {
        $sql = file_get_contents($schemaFile);
        
        // Execute the entire SQL script
        $pdo->exec($sql);
        echo "<p style='color: green;'>Successfully created database tables!</p>";
    } catch (Exception $e) {
        die("<p style='color: red;'>Error creating tables: " . $e->getMessage() . "</p>");
    }
} else {
    echo "<p style='color: orange;'>Warning: schema_mysql.sql not found. Assuming tables already exist.</p>";
}
ob_flush(); flush();

// STEP 2: Import JSON Data
$backupFile = __DIR__ . '/neon_backup.json';

if (!file_exists($backupFile)) {
    die("Error: neon_backup.json not found in the same directory.");
}

$json = file_get_contents($backupFile);
$data = json_decode($json, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    die("Error parsing JSON: " . json_last_error_msg());
}

// Disable foreign key checks for the import
$pdo->exec("SET FOREIGN_KEY_CHECKS = 0");

$tablesToImport = ['users', 'territories', 'targets', 'projections', 'collections', 'offroad_vehicles', 'settlements', 'admin_unlocks', 'vehicle_performance', 'system_settings'];

foreach ($tablesToImport as $table) {
    if (isset($data[$table]) && is_array($data[$table])) {
        echo "<p>Importing table: <b>$table</b> (" . count($data[$table]) . " rows)...</p>";
        ob_flush(); flush();
        
        // TRUNCATE TABLE is a DDL statement and implicitly commits any active transaction in MySQL.
        // Therefore, we must run TRUNCATE outside the transaction block.
        $pdo->exec("TRUNCATE TABLE `$table`");
        
        $pdo->beginTransaction();
        
        if (count($data[$table]) > 0) {
            // Get columns from the first row
            $columns = array_keys($data[$table][0]);
            
            $colNames = implode(', ', array_map(function($col) { return "`$col`"; }, $columns));
            $placeholders = implode(', ', array_fill(0, count($columns), '?'));
            
            $stmt = $pdo->prepare("INSERT INTO `$table` ($colNames) VALUES ($placeholders)");
            
            $importedCount = 0;
            foreach ($data[$table] as $row) {
                $values = [];
                foreach ($columns as $col) {
                    $values[] = $row[$col];
                }
                $stmt->execute($values);
                $importedCount++;
            }
            echo "<i>$importedCount rows inserted.</i><br>";
        } else {
            echo "<i>No data to insert for this table.</i><br>";
        }
        
        $pdo->commit();
    }
}

// Re-enable foreign key checks
$pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

echo "<h2>Import Complete!</h2>";
echo "<p>Please delete neon_backup.json, schema_mysql.sql, and import.php from your server for security.</p>";
?>
