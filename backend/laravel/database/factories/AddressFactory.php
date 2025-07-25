<?php

namespace Database\Factories;

use App\Models\Address;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Address>
 */
class AddressFactory extends Factory
{
    protected $model = Address::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $frenchFaker = \Faker\Factory::create('fr_FR');
        return [
            'address_text' => $frenchFaker->address,
            'latitude' => $this->faker->latitude,
            'longitude' => $this->faker->longitude,
            'order' => $this->faker->numberBetween(1, 10),
            'comments' => $this->faker->optional()->sentence,
            'delivered' => $this->faker->boolean(70), // 20% chance delivered
        ];
    }
}
