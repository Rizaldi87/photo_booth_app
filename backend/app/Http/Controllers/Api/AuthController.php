<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $req)
    {
        $req->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!Auth::attempt($req->only('email', 'password'), $req->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $req->session()->regenerate();

        $user = Auth::user();

        if ($user->role !== 'admin') {
            Auth::logout();
            $req->session()->invalidate();
            $req->session()->regenerateToken();

            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);

    }

    public function me(Request $req)
    {
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        $user = $req->user();
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);

    }

    public function logout(Request $req)
    {
        Auth::guard('web')->logout();

        $req->session()->invalidate();
        $req->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }
}
