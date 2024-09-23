<?php

namespace App\Http\Controllers;

use App\Models\Groupe;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Groupe $groupe)
    {
        // Fetch tasks related to the given groupe
        //$tasks = $groupe->tasks()->get();
        $tasks = $groupe->tasks()->with('etudiant')->get();

        // You can further process the tasks or pass them to a view
        return response()->json([
            'success' => true,
            'message' => 'Tasks fetched successfully',
            'tasks' => $tasks, // Assuming $tasks is a collection of Task instances
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'groupe_id' => 'required|exists:groupes,id',
            'etudiant_id' => 'required|exists:etudiants,id',
        ]);

        $task = Task::create($request->all());
        $task->load('etudiant');

        // Notify all group members in real-time
        // Reverb::broadcast(new TaskCreated($task));

        return response()->json($task, 201);
    }

    public function show(Task $task)
    {
        return response()->json($task);
    }

    public function update(Request $request, Task $task)
    {
        $task->update($request->all());

        // Notify all group members in real-time
        // Reverb::broadcast(new TaskUpdated($task));

        return response()->json($task);
    }

    public function destroy(Task $task)
    {
        $task->delete();

        // Notify all group members in real-time
        // Reverb::broadcast(new TaskDeleted($task));

        return response()->json(null, 204);
    }
}
