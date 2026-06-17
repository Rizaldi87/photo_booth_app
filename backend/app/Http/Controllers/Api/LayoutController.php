<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Layout;
use Illuminate\Http\Request;

class LayoutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Layout::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $layout = Layout::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'photo_count' => $request->photo_count,
            'column' => $request->column,
            'row' => $request->row,
            'isActive' => $request->isActive
        ]);

        return response()->json([
            'message' => 'Layout Created',

        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return Layout::find($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Layout $layout)
    {
        $layout->update([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'photo_count' => $request->photo_count,
            'column' => $request->column,
            'row' => $request->row,
            'isActive' => $request->isActive
        ]);

        return response()->json([
            'message' => 'Layout updated'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Layout $layout)
    {
        $layout->delete();
        return response()->json([
            'message' => 'Layout Deleted'
        ]);
    }

    /**
     * Get active layouts
     */
    public function getActive()
    {
        $layout = Layout::where('isActive', 1)->get();
        return response()->json([
            'message' => 'Getting active layouts',
            'data' => $layout
        ]);
    }

}
