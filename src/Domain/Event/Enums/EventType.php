<?php
declare(strict_types=1);
namespace Domain\Event\Enums;

enum EventType: string
{
    case OrderUpdated = 'order.updated';
    case StockChanged = 'stock.changed';
    case TaskCompleted = 'task.completed';
    case SystemAlert = 'system.alert';
}
