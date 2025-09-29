<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");  
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    echo json_encode(["loggedIn" => true, "name" => $_SESSION['admin_name']]);
} else {
    echo json_encode(["loggedIn" => false]);
}
?>
