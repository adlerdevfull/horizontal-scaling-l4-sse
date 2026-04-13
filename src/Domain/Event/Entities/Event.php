<?php
declare(strict_types=1);
namespace Domain\Event\Entities;

use Domain\Event\Enums\EventType;

final class Event
{
    public function __construct(
        public readonly string $id,
        public readonly EventType $type,
        public readonly array $data,
        public readonly \DateTimeImmutable $occurredAt,
        public readonly ?int $userId = null,
        public readonly ?string $sourceInstance = null,
    ) {}

    public static function create(EventType $type, array $data, ?int $userId = null): self
    {
        return new self(
            id: hrtime(true) . '-' . bin2hex(random_bytes(4)),
            type: $type,
            data: $data,
            occurredAt: new \DateTimeImmutable(),
            userId: $userId,
            sourceInstance: env('APP_INSTANCE', 'unknown'),
        );
    }

    public function toSSE(): string
    {
        $payload = json_encode([
            'type' => $this->type->value,
            'data' => $this->data,
            'timestamp' => $this->occurredAt->format('c'),
            'source_instance' => $this->sourceInstance,
        ]);
        return "id: {$this->id}\nevent: {$this->type->value}\ndata: {$payload}\n\n";
    }

    public function toArray(): array
    {
        return ['id' => $this->id, 'type' => $this->type->value, 'data' => $this->data, 'occurred_at' => $this->occurredAt->format('c'), 'user_id' => $this->userId, 'source_instance' => $this->sourceInstance];
    }
}
