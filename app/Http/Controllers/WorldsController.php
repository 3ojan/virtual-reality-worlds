<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Worlds;
use App\Helpers\Uuidhelper;
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

            $userId = $request->user();
            $model =$sourceWorld->replicate();
            $sourceWorld->created_at = Carbon::now();
            $model->name = 'Copy of ' . $sourceWorld->name;
            $model->description = $sourceWorld->description;
            $model->creator = $userId;
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
    public function newWorld(Request $request){
        try{
            $userId = $request->user();
            $uuid = UuidHelper::generate();
            Log::info("Logging one variable: " . $userId);
            $model = new Worlds([
            "name" => 'New world',
            "description" => '',
            "is_draft" => 0,
            "creator" => $userId,
            "previewBackgroundImagePath" => "",
            "data" => '{"version": 3,"scenes": [{"id": "'.$uuid.'","name": "Default scene","publicName": "Default scene","startPositionX": null,"startPositionY": null,"background": {"type": "image","mediumPath": "virtualRealityFiles/dreamstime.jpg","sliceImage": true},"objects": [],"ambientAudio": {"type": "audio"},"introAudio": {"type": "audio"},"sceneRotationY": 0,
			"backgroundRotationX": 0,"backgroundRotationY": 0,"backgroundRotationZ": 0,"autorotateAfterSeconds": 0,"autorotateSpeed": 0.1,"actionIfBackgroundVideoEnds": "stop","goToSceneIdAfterBackgroundVideoEnds": "","weather": null, "publicStage": false}],"rules": {"visibleIf": {},"hiddenIf": {}},"copyrightLogo": {},"previewBackgroundImage": {"type": "image","mediumPath": "virtualRealityFiles/dreamstime_thumb.jpg","transparent": false},"socialMediaPreviewImage": {},"worldAmbientAudio": {},"customIcons": {},"elementTypeIconAssignments": {},"name": "Default world","description": "","creatorUserIdOfWorld": "'.$userId.'","publicAvailable": 1,"is_draft": 1}',
            "publicAvailable" => 0,
            "lockedForEditing" => 0,
            ]);
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
}
