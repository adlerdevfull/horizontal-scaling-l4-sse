<?php
declare(strict_types=1);
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::create(['name'=>'Test','email'=>'t@t.com','password'=>bcrypt('pass')]);
    $this->token = auth('api')->login($this->user);
});

test('health endpoint works without auth', function () {
    $this->getJson('/api/v1/health')->assertOk()->assertJsonStructure(['status','instance','timestamp']);
});

test('can dispatch event', function () {
    $this->withToken($this->token)->postJson('/api/v1/events/dispatch', [
        'type' => 'order.updated', 'data' => ['order_id' => 1],
    ])->assertStatus(201)->assertJsonPath('data.type', 'order.updated');
});

test('events endpoint requires auth', function () {
    $this->getJson('/api/v1/events')->assertStatus(401);
});
