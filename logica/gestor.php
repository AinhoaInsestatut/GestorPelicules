<?php

require_once '../includes/connexio.php';

// Respuesta a las solicitudes
$response = ['status' => 'error', 'message' => 'Acción no válida'];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'addActor') {
        $name = $_POST['nombreActor'];
        $country = $_POST['nacionalidadActor'];
        $image = $_POST['imagen'] ?: 'default.jpg';

        // Evitar inyección SQL: Usar escapes si es necesario
        $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
        $country = (int) $country; // Asegúrate de convertirlo en un entero
        $image = htmlspecialchars($image, ENT_QUOTES, 'UTF-8');

        // Inserción directa en la base de datos
        $query = "INSERT INTO actor (nombreActor, nacionalidadActor, imagen) 
                  VALUES ('$name', '$country', '$image')";
        $pdo->query($query);

        $response = ['status' => 'success', 'message' => 'Actor añadido correctamente'];
    } elseif ($action === 'deleteActor') {
        $id = (int) $_POST['idActor']; // Convertir id a entero para evitar inyecciones

        // Eliminación directa en la base de datos
        $query = "DELETE FROM actor WHERE idActor = $id";
        $pdo->query($query);

        $response = ['status' => 'success', 'message' => 'Actor eliminado correctamente'];
    } elseif ($action === 'addCountry') {
        $name = $_POST['nombrePais'];

        // Evitar inyección SQL
        $name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');

        // Inserción directa en la base de datos
        $query = "INSERT INTO pais (nombrePais) VALUES ('$name')";
        $pdo->query($query);

        $response = ['status' => 'success', 'message' => 'País añadido correctamente'];
    } elseif ($action === 'deleteCountry') {
        $id = (int) $_POST['idPais'];

        // Eliminación directa en la base de datos solo si no está relacionado con actores
        $query = "DELETE FROM pais WHERE idPais = $id AND idPais NOT IN (SELECT nacionalidadActor FROM actor)";
        $pdo->query($query);

        $response = ['status' => 'success', 'message' => 'País eliminado correctamente'];
    }
}

// Obtener datos para la vista
$actors = $pdo->query("SELECT actor.idActor, actor.nombreActor, pais.nombrePais, actor.imagen 
                       FROM actor 
                       JOIN pais ON actor.nacionalidadActor = pais.idPais")->fetchAll();

$countries = $pdo->query("SELECT * FROM pais")->fetchAll();

// Devolver datos para ser consumidos
echo json_encode(['actors' => $actors, 'countries' => $countries, 'response' => $response]);
