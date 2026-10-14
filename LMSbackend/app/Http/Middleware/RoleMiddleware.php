<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{

    public function handle(Request $request, Closure $next,...$roles): Response
    {
        if(!$request->user()) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        $user=$request->user();

        if($user->role==="superAdmin"){
            return $next($request);
        }

        if(in_array($user->role,$roles)){
            return $next($request);
        }
        
        return response()->json(['message' => 'You do not have permission to access this resource.'], 403);

    }
}
