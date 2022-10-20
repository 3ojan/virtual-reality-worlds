<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Postimage;
use Log;

class ImageUploadController extends Controller
{
    //Store image
//Store image
    public function storeImage(Request $request){
      $data= new Postimage();
			if($request->file('image')){
				$file= $request->file('image');
				$filename = date('YmdHi').$file->getClientOriginalName();
				$file->move(public_path('/image'), $filename);
				$data['image']= $filename;
			}else{
					return response()->json([
						"success"=>false
					]);
			}
			$data->save();
			return response()->json([
					"success"=>true,
					"data"=>$data,
					"filename"=>$filename,
					"path"=>"/public/image/".$filename,
					"file"=>$file
					]);
       
    }
		//View image
    public function viewImages(){
            $imageData= Postimage::all();
            return response()->json([
                        "images"=>$imageData
                    ]);
    }
}
