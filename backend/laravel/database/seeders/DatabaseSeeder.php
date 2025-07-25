<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Round;
use App\Models\Address;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Address::factory(10)->create();
        User::factory(3)->create()->each(function ($user) {

            Round::factory(2)->create(['user_id' => $user->id])->each(function ($round) {
                $addresses = Address::factory(5)->create();

                foreach ($addresses as $idx => $address) {
                    $round->addresses()->attach($address->id, ['order' => $idx + 1]);
                }

                // Optionally, update itinerary JSON
                $round->itinerary = json_encode([
                    'steps' => $addresses->pluck('address_text'),
                ]);
                $round->save();
            });
        });
    }
}
