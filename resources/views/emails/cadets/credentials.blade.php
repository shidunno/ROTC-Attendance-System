@component('mail::message')
# Welcome, {{ $name }}

Your cadet account has been created.

- **Cadet ID:** {{ $customId }}
- **Email:** {{ $email }}
- **Temporary Password:** {{ $temporaryPassword }}

Please log in and change your password as soon as possible.

@component('mail::button', ['url' => config('app.url').'/login'])
Log In
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent