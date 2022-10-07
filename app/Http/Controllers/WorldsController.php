<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Worlds;
use App\Models\User;
use Auth;
use Log;
use Exception;
use Carbon\Carbon;

class WorldsController extends Controller
{
    // get worlds list
    public function getWorlds(){
        try{
           $worlds = Worlds::all();
           return response()->json($worlds);
        }
        catch(Exception $e)
        {
            Log::error($e);
        }
    }
    /// get individual world
    public function getWorldDetails(Request $request){
        try{
           $world = Worlds::findOrFail($request->get("worldId"));
           return response()->json($world);
        }
        catch(Exception $e)
        {
            Log::error($e);
        }
    }
    /// update individual world
    public function updateWorldData(Request $request){
        try{
            $id = $request->get("worldId");
            $payload = $request->get("data");
            $name =  $payload["name"];
            $data = $payload["data"];

            $sceneData = $payload["data"];
            // $scenes = $sceneData["scenes"];
            // $countRoom = count($scenes);

           $world = Worlds::findOrFail($request->get("worldId"));
           Worlds::where('id', $id)->update([
            'name'=> $name
           ]);
           return response()->json([
            'id'=>$id,
            'name'=>$name
           ]);
        }
        catch(Exception $e)
        {
            Log::error($e);
        }
    }
    public function changeOwner(Request $request){
        try{
            $id = $request->get("worldId");
            $userId = $request->get("userId");
            // $countRoom = count($scenes);

           $world = Worlds::findOrFail($request->get("worldId"));
           Worlds::where('id', $id)->update([
            'creator'=> $userId
           ]);
           return response()->json([
            $world
           ]);
        }
        catch(Exception $e)
        {
            Log::error($e);
        }
    }
    public function duplicate(Request $request){
        try{
            $id = $request->get("worldId");
            $sourceWorld = Worlds::findOrFail($id);

            ///TODO :: find how to get user ID

            // $userId = Auth::user()->id;
            // dd($sourceWorld);
            // $user = Auth::user();
            // print($user->id);

            $model =$sourceWorld->replicate();
            $sourceWorld->created_at = Carbon::now();
            $model->name = 'Copy of ' . $sourceWorld->name;
            $model->description = $sourceWorld->description;
            $model->creator = 1;
            $model->data = $sourceWorld->data;
            $model->save();
            
           return response()->json([
            "success"=>true
           ]);
        }
        catch(Exception $e)
        {
            Log::error($e);
        }
    }
    public function getWorldData(Request $request){
        try{
            $id = $request->get("worldId");
            $sourceWorld = Worlds::findOrFail($id); 
            return response()->json([
                "data"=>$sourceWorld->data
            ]);
        }
        catch(Exception $e)
        {
            Log::error($e);
        }
    }
}
