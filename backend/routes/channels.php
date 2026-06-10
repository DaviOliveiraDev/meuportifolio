<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('profile.{profileId}', function ($user, $profileId) {
    // Verifica se o usuário autenticado é o dono do perfil
    return (string) $user->id === (string) \App\Infrastructure\Models\Profile::find($profileId)?->user_id;
});
