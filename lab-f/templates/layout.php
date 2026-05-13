<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konwerter Danych</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { display: flex; gap: 20px; margin-bottom: 20px; }
        .column { flex: 1; display: flex; flex-direction: column; gap: 10px; }
        textarea, pre { width: 100%; height: 300px; box-sizing: border-box; resize: vertical; }
        pre { border: 1px solid #777; padding: 10px; overflow: auto; background: #fff; margin: 0; }
        select, button { padding: 5px; }
        button { width: 100%; padding: 10px; cursor: pointer; font-weight: bold;}
    </style>
</head>
<body>
<form method="POST">
    <div class="container">
        <div class="column">
            <select name="input_format">
                <option value="csv" <?= $inputFormat === 'csv' ? 'selected' : '' ?>>CSV</option>
                <option value="ssv" <?= $inputFormat === 'ssv' ? 'selected' : '' ?>>SSV</option>
                <option value="tsv" <?= $inputFormat === 'tsv' ? 'selected' : '' ?>>TSV</option>
                <option value="json" <?= $inputFormat === 'json' ? 'selected' : '' ?>>JSON</option>
                <option value="yml" <?= $inputFormat === 'yml' ? 'selected' : '' ?>>YAML</option>
            </select>
            <textarea name="input_data" placeholder="Wprowadź dane tutaj..."><?= htmlspecialchars($inputData) ?></textarea>
        </div>

        <div class="column">
            <select name="output_format">
                <option value="csv" <?= $outputFormat === 'csv' ? 'selected' : '' ?>>CSV</option>
                <option value="ssv" <?= $outputFormat === 'ssv' ? 'selected' : '' ?>>SSV</option>
                <option value="tsv" <?= $outputFormat === 'tsv' ? 'selected' : '' ?>>TSV</option>
                <option value="json" <?= $outputFormat === 'json' ? 'selected' : '' ?>>JSON</option>
                <option value="yml" <?= $outputFormat === 'yml' ? 'selected' : '' ?>>YAML</option>
            </select>
            <pre><?= htmlspecialchars($outputData) ?></pre>
        </div>
    </div>
    <button type="submit">Convert</button>
</form>
</body>
</html>