<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

// Only admin can update
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(["success" => false, "message" => "Not authorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id'], $data['name'], $data['email'], $data['roll'], $data['age'], $data['gender'], $data['university'], $data['cgpa'], $data['major'])) {
    $id = $conn->real_escape_string($data['id']);
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $roll = $conn->real_escape_string($data['roll']);
    $age = $conn->real_escape_string($data['age']);
    $gender = $conn->real_escape_string($data['gender']);
    $university = $conn->real_escape_string($data['university']);
    $cgpa = $conn->real_escape_string($data['cgpa']);
    $major = $conn->real_escape_string($data['major']);

    $sql = "UPDATE students_details SET
            name='$name', email='$email', roll='$roll', age='$age',
            gender='$gender', university='$university', cgpa='$cgpa', major='$major'
            WHERE id='$id'";

    if ($conn->query($sql)) {
        echo json_encode(["success" => true, "message" => "Student updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Failed to update student"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "All fields required"]);
}

$conn->close();
?>
