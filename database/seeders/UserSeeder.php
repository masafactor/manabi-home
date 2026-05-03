<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => '管理者ユーザー',
                'email' => 'admin@example.com',
                'role' => 'admin',
            ],
            [
                'name' => '先生ユーザー',
                'email' => 'teacher@example.com',
                'role' => 'teacher',
            ],
            [
                'name' => '生徒ユーザー',
                'email' => 'student@example.com',
                'role' => 'student',
            ],
            [
                'name' => '保護者ユーザー',
                'email' => 'guardian@example.com',
                'role' => 'guardian',
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make('password'),
                    'role' => $user['role'],
                ]
            );
        }
    }
}