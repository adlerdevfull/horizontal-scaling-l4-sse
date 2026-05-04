<?php
declare(strict_types=1);
namespace Infrastructure\Persistence\Repositories;

use Domain\Event\Entities\Event;
use Domain\Event\Enums\EventType;
use Domain\Event\Repositories\EventRepositoryInterface;
use Illuminate\Support\Facades\Redis;

final class RedisEventRepository implements EventRepositoryInterface
{
    private const MAX_EVENTS = 50;
    private const TTL = 3600;

    public function store(Event $event): void
    {
        $key = "events:stored:" . ($event->userId ?? 'broadcast');
        Redis::rpush($key, json_encode($event->toArray()));
        Redis::ltrim($key, -self::MAX_EVENTS, -1);
        Redis::expire($key, self::TTL);
    }

    public function publish(Event $event): void
    {
        $sse = $event->toSSE();
        if ($event->userId) {
            Redis::rpush("events:queue:{$event->userId}", $sse);
            Redis::expire("events:queue:{$event->userId}", 60);
        } else {
            Redis::rpush("events:queue:broadcast", $sse);
            Redis::expire("events:queue:broadcast", 60);
        }
    }

    public function getAfterEventId(int $userId, string $lastEventId): array
    {
        $all = $this->getRecent($userId);
        $found = false;
        $result = [];
        foreach ($all as $event) {
            if ($found) $result[] = $event;
            if ($event->id === $lastEventId) $found = true;
        }
        return $result;
    }

    public function getRecent(int $userId, int $limit = 50): array
    {
        $items = Redis::lrange("events:stored:{$userId}", -$limit, -1);
        return array_map(fn ($json) => $this->deserialize($json), $items);
    }

    public function pollForUser(int $userId): ?string
    {
        return Redis::lpop("events:queue:{$userId}");
    }

    public function pollBroadcast(): ?string
    {
        return Redis::lpop("events:queue:broadcast");
    }

    private function deserialize(string $json): Event
    {
        $d = json_decode($json, true);
        return new Event($d['id'], EventType::from($d['type']), $d['data'], new \DateTimeImmutable($d['occurred_at']), $d['user_id'], $d['source_instance'] ?? null);
    }
}
