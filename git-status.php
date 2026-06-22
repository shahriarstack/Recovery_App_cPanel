<?php
// git-status.php
// Diagnostic file to check the deployed git version on the server.

header('Content-Type: text/plain');
header('Cache-Control: no-cache, no-store, must-revalidate');
header('Pragma: no-cache');
header('Expires: 0');

echo "==================================================\n";
echo "RECOVERY APP DEPLOYMENT DIAGNOSTICS\n";
echo "==================================================\n";
echo "Current Server Time: " . date('Y-m-d H:i:s T') . "\n";
echo "Server Script Directory (__DIR__): " . __DIR__ . "\n";
echo "Server Document Root (DOCUMENT_ROOT): " . $_SERVER['DOCUMENT_ROOT'] . "\n";
echo "PHP Version: " . phpversion() . "\n";
echo "\n--- GIT REPOSITORY STATUS ---\n";

function runCommandSafe($cmd) {
    if (!function_exists('shell_exec')) {
        return "[Warning: shell_exec is not enabled on this PHP server]";
    }
    $disabled = array_map('trim', explode(',', ini_get('disable_functions')));
    if (in_array('shell_exec', $disabled)) {
        return "[Warning: shell_exec is disabled in disable_functions]";
    }
    try {
        $result = @shell_exec($cmd);
        return $result ? trim($result) : "[No output from command]";
    } catch (Throwable $e) {
        return "[Error running command: " . $e->getMessage() . "]";
    }
}

$gitLog = runCommandSafe('git log -n 3 --oneline 2>&1');
echo "Recent Commits:\n" . $gitLog . "\n";

$gitStatus = runCommandSafe('git status 2>&1');
echo "\nGit Status:\n" . $gitStatus . "\n";

echo "\n--- CACHE VERIFICATION ---\n";
$cacheFile = __DIR__ . '/db_cache.json';
if (file_exists($cacheFile)) {
    echo "Database Cache File: EXISTS\n";
    echo "Cache Size: " . filesize($cacheFile) . " bytes (" . round(filesize($cacheFile) / 1024, 2) . " KB)\n";
    echo "Cache Last Modified: " . date('Y-m-d H:i:s T', filemtime($cacheFile)) . "\n";
} else {
    echo "Database Cache File: DOES NOT EXIST\n";
}

$dirWritable = is_writable(__DIR__);
echo "Directory Writable: " . ($dirWritable ? "YES" : "NO") . "\n";
if ($dirWritable) {
    $testFile = __DIR__ . '/_test_write.txt';
    $writeTest = @file_put_contents($testFile, 'test');
    if ($writeTest !== false) {
        echo "Test Write: SUCCESS\n";
        @unlink($testFile);
    } else {
        echo "Test Write: FAILED (Permission issues or disk full)\n";
    }
} else {
    echo "Test Write: SKIPPED (Directory not writable)\n";
}

echo "\n--- DATABASE DIAGNOSTICS ---\n";
require_once 'config.php';
try {
    $start_time = microtime(true);
    $pdo = getDbConnection();
    $connect_time = round((microtime(true) - $start_time) * 1000, 2);
    echo "Database Connection: SUCCESS (took {$connect_time}ms)\n";
    
    $tables = ['users', 'territories', 'targets', 'projections', 'collections', 'offroad_vehicles', 'settlements', 'vehicle_performance', 'admin_unlocks', 'system_settings'];
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->query("SELECT COUNT(*) as cnt FROM `$table`");
            $row = $stmt->fetch();
            echo "Table '{$table}': {$row['cnt']} rows\n";
        } catch (Exception $e) {
            echo "Table '{$table}': ERROR ({$e->getMessage()})\n";
        }
    }
} catch (Exception $e) {
    echo "Database Connection: FAILED ({$e->getMessage()})\n";
}

echo "\n==================================================\n";
?>
