<?php
namespace App\Encoder;

class CsvEncoder implements EncoderInterface {
    public function supports(string $format): bool {
        return in_array($format, ['csv', 'ssv', 'tsv']);
    }

    private function getDelimiter(string $format): string {
        if ($format === 'tsv') return "\t";
        if ($format === 'ssv') return ";";
        return ",";
    }

    public function encode(array $data, string $format): string {
        if (empty($data)) return "";

        $delimiter = $this->getDelimiter($format);
        $output = fopen('php://temp', 'r+');

        fputcsv($output, array_keys($data[0]), $delimiter, '"', '\\');

        foreach ($data as $row) {
            fputcsv($output, $row, $delimiter, '"', '\\');
        }

        rewind($output);
        $content = stream_get_contents($output);
        fclose($output);

        return $content;
    }

    public function decode(string $data, string $format): array {
        $data = trim($data);
        if (empty($data)) return [];

        $delimiter = $this->getDelimiter($format);
        $lines = explode("\n", $data);

        $header = str_getcsv(array_shift($lines), $delimiter, '"', '\\');

        $result = [];
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            $row = str_getcsv($line, $delimiter, '"', '\\');
            if (count($header) === count($row)) {
                $result[] = array_combine($header, $row);
            }
        }

        return $result;
    }
}