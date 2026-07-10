<?php
declare(strict_types=1);
use Domain\Event\Entities\Event;
use Domain\Event\Enums\EventType;

test('creates event with unique id', function () {
    $e1 = Event::create(EventType::OrderUpdated, ['id' => 1]);
    $e2 = Event::create(EventType::OrderUpdated, ['id' => 2]);
    expect($e1->id)->not->toBe($e2->id);
});

test('formats as SSE correctly', function () {
    $e = Event::create(EventType::StockChanged, ['product_id' => 5, 'qty' => -1]);
    $sse = $e->toSSE();
    expect($sse)->toContain("id: {$e->id}");
    expect($sse)->toContain("event: stock.changed");
    expect($sse)->toContain("data: ");
    expect($sse)->toEndWith("\n\n");
});

test('includes source instance', function () {
    $e = Event::create(EventType::SystemAlert, ['msg' => 'test']);
    expect($e->sourceInstance)->not->toBeNull();
});
