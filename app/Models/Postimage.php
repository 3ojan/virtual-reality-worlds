<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Postimage extends Model
{
    ///saves image to folder
    //Store image
    public function storeImage(Request $request){
        $data= new Postimage();
        if($request->file('image')){
            $file= $request->file('image');
            $filename= date('YmdHi').$file->getClientOriginalName();
            $file-> move(public_path('public/image'), $filename);
            $data['image']= $filename;
        }
        $data->save();
        // return redirect()->route('images.view');
    }
    //View post
    public function viewImage(){
        $imageData= Postimage::all();
        return view('Image.view_image', compact('imageData'));
    }
}
