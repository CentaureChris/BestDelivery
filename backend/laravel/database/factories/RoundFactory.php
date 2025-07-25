<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Round;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Round>
 */
class RoundFactory extends Factory
{
    protected $model = Round::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
      $optimTypes = ['short', 'fast', 'eco'];

        return [
            'user_id' => User::factory(),
            'date' => $this->faker->date(),
            'type_optimisation' => $this->faker->randomElement($optimTypes),
            'itinerary' => null
        ];
    }
}
