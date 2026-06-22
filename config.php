<?php
// config.php
// Database Configuration

// Define database connection constants
// Replace these with your actual cPanel MySQL database details
define('DB_HOST', 'localhost'); // Usually 'localhost' on cPanel
define('DB_NAME', 'cvacimot_recovery'); // e.g., 'cvacimot_recovery'
define('DB_USER', 'cvacimot_dbuser'); // e.g., 'cvacimot_user'
define('DB_PASS', 'Shahriar@0123');

// Set error reporting for debugging (turn off in production if needed)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Helper function to get PDO connection
function getDbConnection() {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Throw exceptions on errors
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Fetch associative arrays
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Use real prepared statements
    ];

    try {
        return new PDO($dsn, DB_USER, DB_PASS, $options);
    } catch (\PDOException $e) {
        // Return a JSON error if connection fails
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
}
?>
