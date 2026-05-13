<?php
declare(strict_types=1);
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Application\Event\Commands\EventDispatcher;
use Domain\Event\Enums\EventType;
use Domain\Event\Repositories\EventRepositoryInterface;
use Infrastructure\SSE\SSEStreamHandler;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EventController extends Controller
{
    public function __construct(
        private readonly SSEStreamHandler $sse,
        private readonly EventDispatcher $dispatcher,
        private readonly EventRepositoryInterface $events,
    ) {}

    public function stream(Request $request): StreamedResponse
    {
        return $this->sse->stream(auth('api')->id(), $request->header('Last-Event-ID'));
    }

    public function dispatch(Request $request): JsonResponse
    {
        $data = $request->validate(['type'=>'required|in:order.updated,stock.changed,task.completed,system.alert','data'=>'required|array','user_id'=>'sometimes|integer']);
        $event = $this->dispatcher->dispatch(EventType::from($data['type']), $data['data'], $data['user_id'] ?? null);
        return response()->json(['data' => $event->toArray()], 201);
    }

    public function recent(): JsonResponse
    {
        $events = $this->events->getRecent(auth('api')->id());
        return response()->json(['data' => array_map(fn($e) => $e->toArray(), $events)]);
    }

    public function health(): JsonResponse
    {
        return response()->json(['status' => 'ok', 'instance' => env('APP_INSTANCE', 'unknown'), 'timestamp' => now()->toIso8601String()]);
    }
}
