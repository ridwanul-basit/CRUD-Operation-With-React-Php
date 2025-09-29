<?php
session_start();
include 'db.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if(isset($data['email'],$data['password'])){
    $email = $data['email'];
    $password = $data['password'];

    $stmt = $conn->prepare("SELECT * FROM admins WHERE email=? LIMIT 1");
    $stmt->bind_param("s",$email);
    $stmt->execute();
    $result = $stmt->get_result();

    if($result && $result->num_rows>0){
        $admin = $result->fetch_assoc();
        if(password_verify($password, $admin['password'])){
            $_SESSION['admin_logged_in']=true;
            $_SESSION['admin_id']=$admin['id'];
            $_SESSION['admin_name']=$admin['name'];
            echo json_encode(["success"=>true,"message"=>"Login successful"]);
        } else echo json_encode(["success"=>false,"message"=>"Invalid email or password"]);
    } else echo json_encode(["success"=>false,"message"=>"Invalid email or password"]);
} else echo json_encode(["success"=>false,"message"=>"Email and password required"]);

$conn->close();
?>
