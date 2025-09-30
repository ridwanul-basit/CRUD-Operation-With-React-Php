<?php
header("Access-Control-Allow-Origin: *");  
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include 'db.php';

// Get JSON data from React
$data = json_decode(file_get_contents("php://input"), true);

// Check required fields including password
if (
    isset($data['name'], $data['email'], $data['roll'], $data['age'], 
          $data['gender'], $data['university'], $data['cgpa'], $data['major'], $data['password'])
) {
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $roll = $conn->real_escape_string($data['roll']);
    $age = (int)$data['age'];
    $gender = $conn->real_escape_string($data['gender']);
    $university = $conn->real_escape_string($data['university']);
    $cgpa = (float)$data['cgpa'];
    $major = $conn->real_escape_string($data['major']);

    // Hash the password before storing
    $password = password_hash($data['password'], PASSWORD_BCRYPT);

    // Insert including password
    $sql = "INSERT INTO students_details 
            (name, email, roll, age, gender, university, cgpa, major, password) 
            VALUES 
            ('$name', '$email', '$roll', $age, '$gender', '$university', $cgpa, '$major', '$password')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["success" => true, "message" => "Student registered successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Database error: " . $conn->error]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
}

$conn->close();
