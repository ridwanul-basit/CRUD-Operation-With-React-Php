<?php
$host = "localhost";   // usually localhost
$user = "root";        // default XAMPP user
$pass = "";            // default XAMPP password
$dbname = "college";   //  database name

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}
?>
