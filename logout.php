<?php
session_start();

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Destroy session
session_destroy();

echo json_encode([
    "success" => true,
    "message" => "Logged out successfully"
]);
?>
