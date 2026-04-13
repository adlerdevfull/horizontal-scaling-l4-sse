<?php
declare(strict_types=1);
namespace Domain\Event\Repositories;

use Domain\Event\Entities\Event;

interface EventRepositoryInterface
{
    public function store(Event $event): void;
    public function publish(Event $event): void;
    /** @return Event[] */
    public function getAfterEventId(int $userId, string $lastEventId): array;
    /** @return Event[] */
    public function getRecent(int $userId, int $limit = 50): array;
    public function pollForUser(int $userId): ?string;
    public function pollBroadcast(): ?string;
}
