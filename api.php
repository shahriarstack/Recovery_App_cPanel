<?php
// api.php
require_once 'config.php';

// Enable Gzip compression if supported by browser/server
if (!headers_sent() && extension_loaded('zlib') && !ini_get('zlib.output_compression')) {
    ob_start('ob_gzhandler');
}

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Adjust in production
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$pdo = getDbConnection();

// Cache management helper
$cacheFile = __DIR__ . '/db_cache.json';
function invalidateCache() {
    global $cacheFile;
    if (file_exists($cacheFile)) {
        @unlink($cacheFile);
    }
}

// Get the route from the URL rewritten by .htaccess
$route = isset($_GET['route']) ? $_GET['route'] : '';

// Parse JSON body for POST/DELETE
$input = json_decode(file_get_contents('php://input'), true);

try {
    switch ($route) {
        case 'db':
            if ($_SERVER['REQUEST_METHOD'] !== 'GET') throw new Exception("Method Not Allowed");

            date_default_timezone_set('Asia/Dhaka');

            // Return cached data if available (Super fast read!)
            if (file_exists($cacheFile)) {
                $cachedData = json_decode(file_get_contents($cacheFile), true);
                if (is_array($cachedData)) {
                    $cachedData['server_date'] = date('Y-m-d');
                    $cachedData['server_time'] = date('Y-m-d H:i:s');
                    echo json_encode($cachedData);
                    break;
                }
            }

            $tables = ['users', 'territories', 'targets', 'projections', 'collections', 'offroad_vehicles', 'settlements', 'vehicle_performance'];
            $result = [];

            foreach ($tables as $table) {
                $stmt = $pdo->query("SELECT * FROM `$table`");
                $result[$table] = $stmt->fetchAll();
            }

            // System settings (might not exist if empty, so catch error)
            try {
                $stmt = $pdo->query("SELECT * FROM system_settings");
                $result['system_settings'] = $stmt->fetchAll();
            } catch (Exception $e) {
                $result['system_settings'] = [];
            }

            // Unlocks
            $stmt = $pdo->query("SELECT * FROM admin_unlocks");
            $unlocksResult = $stmt->fetchAll();
            $unlocks = [];
            foreach ($unlocksResult as $row) {
                $unlocks[$row['territory_id']] = $row['unlock_until'];
            }
            $result['unlocks'] = $unlocks;

            // Inject server time as well for fresh responses
            $result['server_date'] = date('Y-m-d');
            $result['server_time'] = date('Y-m-d H:i:s');

            $jsonResponse = json_encode($result);
            
            // Save to cache for subsequent page loads
            @file_put_contents($cacheFile, $jsonResponse);

            echo $jsonResponse;
            break;

        case 'update':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Method Not Allowed");
            $collection = $input['collection'];
            $item = $input['item'];

            $validTables = ['collections', 'projections', 'offroad_vehicles', 'settlements', 'territories', 'users', 'system_settings'];
            if (!in_array($collection, $validTables)) throw new Exception("Invalid collection specified");

            // Filter out 'id' from keys for UPDATE/INSERT
            $keys = array_filter(array_keys($item), function($k) { return $k !== 'id'; });
            
            if (!empty($item['id']) && strpos((string)$item['id'], 'new_') !== 0) {
                // UPDATE
                $setClause = implode(', ', array_map(function($k) { return "`$k` = ?"; }, $keys));
                $values = [];
                foreach ($keys as $k) $values[] = $item[$k];
                $values[] = $item['id'];

                $stmt = $pdo->prepare("UPDATE `$collection` SET $setClause WHERE id = ?");
                $stmt->execute($values);
                
                invalidateCache(); // Clear cache on modification
                echo json_encode($item);
            } else {
                // INSERT
                unset($item['id']);
                $insertKeys = array_keys($item);
                $columns = implode(', ', array_map(function($k) { return "`$k`"; }, $insertKeys));
                $placeholders = implode(', ', array_fill(0, count($insertKeys), '?'));
                
                $values = [];
                foreach ($insertKeys as $k) $values[] = $item[$k];

                $stmt = $pdo->prepare("INSERT INTO `$collection` ($columns) VALUES ($placeholders)");
                $stmt->execute($values);
                $item['id'] = $pdo->lastInsertId();
                
                invalidateCache(); // Clear cache on modification
                echo json_encode($item);
            }
            break;

        case 'delete':
            if ($_SERVER['REQUEST_METHOD'] !== 'DELETE' && $_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Method Not Allowed");
            $collection = $input['collection'];
            $id = $input['id'];

            $validTables = ['collections', 'projections', 'offroad_vehicles', 'settlements', 'territories', 'users'];
            if (!in_array($collection, $validTables)) throw new Exception("Invalid collection");

            $stmt = $pdo->prepare("DELETE FROM `$collection` WHERE id = ?");
            $stmt->execute([$id]);
            
            invalidateCache(); // Clear cache on modification
            echo json_encode(['success' => true]);
            break;

        case 'sync-targets':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Method Not Allowed");
            $territories = isset($input['territories']) ? $input['territories'] : [];
            $targets = isset($input['targets']) ? $input['targets'] : [];
            $deletedTerritoryIds = isset($input['deletedTerritoryIds']) ? $input['deletedTerritoryIds'] : [];

            $pdo->beginTransaction();

            if (!empty($deletedTerritoryIds)) {
                $placeholders = implode(',', array_fill(0, count($deletedTerritoryIds), '?'));
                $stmt = $pdo->prepare("DELETE FROM territories WHERE id IN ($placeholders)");
                $stmt->execute($deletedTerritoryIds);
            }

            if (!empty($territories)) {
                $stmt = $pdo->prepare("INSERT INTO territories (id, name, part, officer) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name), part = VALUES(part), officer = VALUES(officer)");
                foreach ($territories as $t) {
                    $stmt->execute([$t['id'], $t['name'], $t['part'], $t['officer']]);
                }
            }

            if (!empty($targets)) {
                $stmt = $pdo->prepare("
                    INSERT INTO targets (territory_id, month, files, proj_files, amount, proj_reg, proj_adv, lm_np_target_amount, lm_np_target_files, total_od, od_growth_sply, per_file_od, six_plus_od_files, six_plus_od_growth_splm)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE 
                        files = VALUES(files), proj_files = VALUES(proj_files), amount = VALUES(amount),
                        proj_reg = VALUES(proj_reg), proj_adv = VALUES(proj_adv), lm_np_target_amount = VALUES(lm_np_target_amount),
                        lm_np_target_files = VALUES(lm_np_target_files), total_od = VALUES(total_od), od_growth_sply = VALUES(od_growth_sply),
                        per_file_od = VALUES(per_file_od), six_plus_od_files = VALUES(six_plus_od_files), six_plus_od_growth_splm = VALUES(six_plus_od_growth_splm)
                ");
                foreach ($targets as $t) {
                    $stmt->execute([
                        $t['territory_id'], $t['month'], $t['files'], $t['proj_files'], $t['amount'], $t['proj_reg'], $t['proj_adv'],
                        $t['lm_np_target_amount'], $t['lm_np_target_files'], $t['total_od'], $t['od_growth_sply'],
                        $t['per_file_od'], $t['six_plus_od_files'], $t['six_plus_od_growth_splm']
                    ]);
                }
            }

            $pdo->commit();
            invalidateCache(); // Clear cache on modification
            echo json_encode(['success' => true]);
            break;

        case 'sync-users':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Method Not Allowed");
            $users = $input['users'];

            $pdo->beginTransaction();
            $pdo->exec("DELETE FROM users WHERE role = 'officer'");

            $officers = array_filter($users, function($u) { return $u['role'] === 'officer'; });
            if (!empty($officers)) {
                $stmt = $pdo->prepare("INSERT INTO users (username, officer_name, role, password, territory_id) VALUES (?, ?, ?, ?, ?)");
                foreach ($officers as $u) {
                    $stmt->execute([$u['username'], $u['officerName'], $u['role'], $u['password'], $u['territoryId']]);
                }
            }

            $pdo->commit();
            invalidateCache(); // Clear cache on modification
            echo json_encode(['success' => true]);
            break;

        case 'sync-vehicle-perf':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Method Not Allowed");
            $data = $input['data'];

            $pdo->beginTransaction();
            $pdo->exec("DELETE FROM vehicle_performance");

            if (!empty($data)) {
                $stmt = $pdo->prepare("INSERT INTO vehicle_performance (customer_id, customer_name, model, km1, km2, earning, overdue_no, overdue_amt, extra1, extra2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                foreach ($data as $v) {
                    $stmt->execute([$v['customerId'], $v['customerName'], $v['model'], $v['km1'], $v['km2'], $v['earning'], $v['overdueNo'], $v['overdueAmt'], $v['extra1'], $v['extra2']]);
                }
            }

            $pdo->commit();
            invalidateCache(); // Clear cache on modification
            echo json_encode(['success' => true]);
            break;

        case 'settings':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Method Not Allowed");
            $key = $input['key'];
            $value = $input['value'];

            $stmt = $pdo->prepare("INSERT INTO system_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)");
            $stmt->execute([$key, $value]);
            
            invalidateCache(); // Clear cache on modification
            echo json_encode(['success' => true]);
            break;

        case 'unlock':
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') throw new Exception("Method Not Allowed");
            $territoryId = $input['territoryId'];
            $unlockUntil = $input['unlockUntil'];

            $stmt = $pdo->prepare("INSERT INTO admin_unlocks (territory_id, unlock_until) VALUES (?, ?) ON DUPLICATE KEY UPDATE unlock_until = VALUES(unlock_until)");
            $stmt->execute([$territoryId, $unlockUntil]);
            
            invalidateCache(); // Clear cache on modification
            echo json_encode(['success' => true]);
            break;

        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found: ' . htmlspecialchars($route)]);
            break;
    }

} catch (Exception $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
