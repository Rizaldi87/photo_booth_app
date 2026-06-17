<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Frame;
use Illuminate\Http\Request;

class FrameController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Frame::all();
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        Frame::create($request->all());
        return response()->json([
            'message' => 'Frame created successfully',

        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Frame $frame)
    {
        return response()->json($frame);

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Frame $frame)
    {
        $frame->update($request->all());

        return response()->json([
            'message' => 'Frame updated successfully',

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Frame $frame)
    {
        $frame->delete();

        return response()->json([
            'message' => 'Frame deleted successfully'
        ]);
    }
}
