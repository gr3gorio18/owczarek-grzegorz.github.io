<?php
namespace App;

use App\Encoder\EncoderInterface;

class Serializer {
    private array $encoders = [];

    public function addEncoder(EncoderInterface $encoder): void {
        $this->encoders[] = $encoder;
    }

    public function deserialize(string $data, string $format): array {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder->decode($data, $format);
            }
        }
        throw new \Exception("Nieobsługiwany format wejściowy: $format");
    }

    public function serialize(array $data, string $format): string {
        foreach ($this->encoders as $encoder) {
            if ($encoder->supports($format)) {
                return $encoder->encode($data, $format);
            }
        }
        throw new \Exception("Nieobsługiwany format wyjściowy: $format");
    }
}