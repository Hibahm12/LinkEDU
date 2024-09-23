<?php

namespace App\Http\Controllers;

use App\Mail\PasswordResetEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Password;





class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string', 'min:8'],
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'status' => 'Error ocured...',
                'message' => 'Credentials do not match',
            ], Response::HTTP_UNAUTHORIZED);
        }


        $user = User::with('etudiant', 'professeur')->where('email', $request->email)->first();
        return response()->json([
            'status' => 'Request was succesful',
            'data' => [
                'user' => $user,
                'token' => $user->createToken('Api token of ' . $user->name)->plainTextToken
            ]
        ]);
    }


    public function register(Request $request)
    {
        /**
         * bc we have 3 role every role has his own created user method,
         * bc admin the only one can add etudiants and professeurs
         */
    }


    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $email = $validated['email'];

        $user = User::where('email', $email)->first();

        $token = Password::createToken($user);

        // Send the password reset email
        Mail::to($email)->send(new PasswordResetEmail($token, $email));

        return response()->json([
            'status' => 'success',
            'message' => 'Password reset email sent.',
        ]);

    }


    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $status = Password::reset(
            $validated,
            function ($user, $password) {
                $user->password = Hash::make($password);
                $user->save();
            }
        );

        if ($status == Password::PASSWORD_RESET) {
            return response()->json([
                'status' => 'success',
                'message' => 'Password reset successful.',
            ]);
        }

        return response()->json([
            'status' => 'error',
            'message' => 'Password reset failed.',
        ], Response::HTTP_BAD_REQUEST);
    }


    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();
        return response()->json([
            'message' => "You have successfully been logged out"
        ], Response::HTTP_OK);
    }
}
