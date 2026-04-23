<?php
declare(strict_types=1);
namespace Application\Event\Commands;

use Domain\Event\Entities\Event;
use Domain\Event\Enums\EventType;
use Domain\Event\Repositories\EventRepositoryInterface;

final readonly class EventDispatcher
{
    public function __construct(private EventRepositoryInterface $events) {}

    public function dispatch(EventType $type, array $data, ?int $userId = null): Event
    {
        $event = Event::create($type, $data, $userId);
        $this->events->store($event);
        $this->events->publish($event);
        return $event;
    }
}
