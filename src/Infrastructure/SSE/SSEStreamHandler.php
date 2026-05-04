<?php
declare(strict_types=1);
namespace Infrastructure\SSE;

use Domain\Event\Repositories\EventRepositoryInterface;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class SSEStreamHandler
{
    private const HEARTBEAT_INTERVAL = 15;
    private const MAX_EXECUTION = 3600;

    public function __construct(private readonly EventRepositoryInterface $events) {}

    public function stream(int $userId, ?string $lastEventId = null): StreamedResponse
    {
        return new StreamedResponse(function () use ($userId, $lastEventId) {
            if (ob_get_level()) ob_end_clean();
            ini_set('zlib.output_compression', '0');

            $startTime = time();
            $lastHeartbeat = time();
            $instance = env('APP_INSTANCE', 'unknown');

            // Send instance info
            echo "event: connected\ndata: {\"instance\":\"{$instance}\",\"user_id\":{$userId}}\n\n";
            flush();

            // Replay missed events
            if ($lastEventId) {
                $missed = $this->events->getAfterEventId($userId, $lastEventId);
                foreach ($missed as $event) {
                    echo $event->toSSE();
                    flush();
                }
            }

            // Main loop - polls Redis (shared across all instances)
            while (true) {
                if ((time() - $startTime) >= self::MAX_EXECUTION) {
                    echo "event: timeout\ndata: {\"message\":\"Reconnect\"}\n\n";
                    flush();
                    break;
                }

                if (connection_aborted()) break;

                // Poll user-specific events
                $message = $this->events->pollForUser($userId);
                if ($message) {
                    echo $message;
                    flush();
                }

                // Poll broadcast events
                $broadcast = $this->events->pollBroadcast();
                if ($broadcast) {
                    echo $broadcast;
                    flush();
                }

                // Heartbeat
                if ((time() - $lastHeartbeat) >= self::HEARTBEAT_INTERVAL) {
                    echo ": heartbeat {$instance}\n\n";
                    flush();
                    $lastHeartbeat = time();
                }

                gc_collect_cycles();
                usleep(100000); // 100ms
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache, no-store',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
            'X-Instance' => env('APP_INSTANCE', 'unknown'),
        ]);
    }
}
