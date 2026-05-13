<?php
require_once 'autoload.php';

use App\Serializer;
use App\Encoder\CsvEncoder;
use App\Encoder\JsonEncoder;
use App\Encoder\YamlEncoder;

$serializer = new Serializer();
$serializer->addEncoder(new CsvEncoder());
$serializer->addEncoder(new JsonEncoder());
$serializer->addEncoder(new YamlEncoder());

$inputData = $_COOKIE['input_data'] ?? '';
$inputFormat = $_COOKIE['input_format'] ?? 'csv';
$outputFormat = $_COOKIE['output_format'] ?? 'json';
$outputData = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $inputData = $_POST['input_data'] ?? '';
    $inputFormat = $_POST['input_format'] ?? 'csv';
    $outputFormat = $_POST['output_format'] ?? 'json';

    setcookie('input_data', $inputData, time() + (86400 * 30), "/");
    setcookie('input_format', $inputFormat, time() + (86400 * 30), "/");
    setcookie('output_format', $outputFormat, time() + (86400 * 30), "/");

    try {
        if (!empty(trim($inputData))) {
            $arrayData = $serializer->deserialize($inputData, $inputFormat);
            $outputData = $serializer->serialize($arrayData, $outputFormat);
        }
    } catch (\Exception $e) {
        $outputData = "Błąd: " . $e->getMessage();
    }
}

require 'templates/layout.php';