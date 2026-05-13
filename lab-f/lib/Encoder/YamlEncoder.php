<?php
namespace App\Encoder;

class YamlEncoder implements EncoderInterface {
    public function supports(string $format): bool {
        return in_array($format, ['yml', 'yaml']);
    }

    public function encode(array $data, string $format): string {
        return yaml_emit($data);
    }

    public function decode(string $data, string $format): array {
        return yaml_parse($data) ?: [];
    }
}