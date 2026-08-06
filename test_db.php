<?php
$dbFile = __DIR__ . '/db/recovery.db';
$pdo = new PDO('sqlite:' . $dbFile);
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$stmt = $pdo->query("SELECT sql FROM sqlite_master WHERE type='table' AND name='users'");
print_r($stmt->fetch(PDO::FETCH_ASSOC));
?>
