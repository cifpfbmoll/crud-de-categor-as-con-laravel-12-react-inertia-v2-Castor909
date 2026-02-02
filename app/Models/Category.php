<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    /**
     * Campos que pueden ser asignados masivamente.
     */
    protected $fillable = [
        'name',
        'description',
        'color',
        'active',
    ];

    /**
     * Conversiones de tipos automáticas.
     */
    protected $casts = [
        'active' => 'boolean',
    ];

    /**
     * Relación: una categoría tiene muchos productos.
     */
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}
