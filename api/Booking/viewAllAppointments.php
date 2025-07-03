<?php
header("Content-Type: application/json");
include(__DIR__."/../../includes/conf.php");


$admin_id = $_POST['user_id'] ?? $_SESSION['user_id'] ?? null;
$role = $_POST['role'] ?? $_SESSION['role'] ?? null;

$sql = "SELECT id FROM users WHERE id = ? AND role = 'admin' AND is_active = 1";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $admin_id);
$stmt->execute();
$stmt->bind_result($id);
$stmt->fetch();
$stmt->close();

if((int)$id !== (int)$admin_id){
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized access1"
    ]);
    exit;
}

if ($role !== 'admin' || !$admin_id) {
    echo json_encode([
        "status" => "error",
        "message" => "Unauthorized access"
    ]);
    exit;
}


$filter = $_POST['filter'] ?? 'all';
$conditions = [];
$params = [];
$types = '';

// Base condition to always start from (e.g., avoid deactivated appointments if needed)
// Example: $conditions[] = 'a.is_active = 1';

switch ($filter) {
    case 'today':
        $conditions[] = 'a.date = CURDATE()';
        break;

    case 'upcoming':
        $conditions[] = 'a.date > CURDATE()';
        break;

    case 'past':
        $conditions[] = 'a.date < CURDATE()';
        break;

    case 'completed':
        $conditions[] = 'LOWER(a.status) = "completed"';
        break;

    case 'pending':
        $conditions[] = 'LOWER(a.status) = "pending"';
        break;

    case 'cancelled':
        $conditions[] = 'LOWER(a.status) = "cancelled"';
        break;

    case 'by_client_name':
    $client_name = $_POST['client_name'] ?? null;
    if ($client_name) {
        $conditions[] = 'u.full_name LIKE ?';
        $params[] = '%' . $client_name . '%';  // partial match
        $types .= 's'; // 's' for string, 'i' for integer (limit and offset)
    }
    else{
        echo json_encode([
        "status" => "error",
        "message" => "Missing client_name for this filter."
    ]);
    exit;
    }
    break;


    case 'by_staff_name':
        $staff_name = $_POST['staff_name'] ?? null;
        if ($staff_name) {
            $conditions[] = 'st.full_name LIKE ?';
            $params[] = '%' . $staff_name . '%';
            $types .= 's'; // 's' for string, 'i' for integer (limit and offset)
        }
        else{
            echo json_encode([
        "status" => "error",
        "message" => "Missing staff_name for this filter."
    ]);
    exit;
        }
        break;

    case 'by_specific_date':
        $specific_date = $_POST['date'] ?? null; // format: YYYY-MM-DD
        if ($specific_date) {
            $conditions[] = 'a.date = ?';
            $params[] = $specific_date;
            $types .= 's'; // 's' for string, 'i' for integer (limit and offset)
        }
        else{
            echo json_encode([
        "status" => "error",
        "message" => "Missing date for this filter."
    ]);
    exit;
        }
        break;

    default:
        // 'all' or no filter — no extra conditions
        break;
}

$whereClause = '';
if (!empty($conditions)) {
    $whereClause = 'WHERE ' . implode(' AND ', $conditions);
}

$page_num = isset($_GET['page']) && is_numeric($_GET['page']) ? intval($_GET['page']) : 1;  //This is ternary operator, it's syntax is: condition ? value_if_true : value_if_false
    $limit = 10;
    $offset = ($page_num - 1) * $limit;
    $types .= 'ii'; // 'i' for integer (limit and offset)

$params [] = $limit;  // for pagination
$params [] = $offset; // for pagination


$sql = "
    SELECT 
        a.id AS appointment_id,
        u.full_name AS client_name,
        st.full_name AS staff_name,
        s.name AS service_name,
        s.price,
        a.date,
        a.time,
        a.status
    FROM appointments a
    JOIN users u ON a.client_id = u.id
    JOIN services s ON a.service_id = s.id
    JOIN users st ON a.staff_id = st.id
    $whereClause
    ORDER BY a.date, a.time
    LIMIT ? OFFSET ?
";

$stmt = $conn->prepare($sql);
if(!empty($params)){
$stmt->bind_param($types, ...$params);
}
if(!$stmt->execute()){
    echo json_encode(
        [
            "status" => "error",
            "message" => "SQL execution error."
        ]
        );
        exit;
}

$result = $stmt->get_result();

$appointments = [];
while($row = $result->fetch_assoc()){
    $appointments [] = $row;
}

echo json_encode(
    [
        "status" => "success!",
        "data" => $appointments
    ]
    );

    $stmt->close();
    $conn->close();

?>