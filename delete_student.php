<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

// Only admin can delete
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(["success" => false, "message" => "Not authorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (isset($data['id'])) {
    $id = $conn->real_escape_string($data['id']);
    $sql = "DELETE FROM students_details WHERE id='$id'";
    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => "Student deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to delete student"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "ID required"]);
}

$conn->close();
?>
