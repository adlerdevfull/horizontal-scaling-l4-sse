<?php
declare(strict_types=1);
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse {
        $data = $request->validate(['name'=>'required|string','email'=>'required|email|unique:users','password'=>'required|string|min:8']);
        $user = User::create(['name'=>$data['name'],'email'=>$data['email'],'password'=>Hash::make($data['password'])]);
        return response()->json(['data'=>['user'=>$user->only('id','name','email'),'token'=>auth('api')->login($user)]],201);
    }
    public function login(Request $request): JsonResponse {
        $request->validate(['email'=>'required|email','password'=>'required']);
        $token = auth('api')->attempt($request->only('email','password'));
        if (!$token) return response()->json(['error'=>'Invalid credentials'],401);
        return response()->json(['data'=>['token'=>$token,'expires_in'=>auth('api')->factory()->getTTL()*60]]);
    }
    public function me(): JsonResponse { return response()->json(['data'=>auth('api')->user()]); }
}
