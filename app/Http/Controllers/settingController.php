<?php

namespace App\Http\Controllers;

use App\Models\SiteSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class settingController extends Controller
{
    public function update(Request $request)
    {
        $settings = SiteSetting::firstOrCreate(['id' => 1]);

        $request->validate([
            'site_name' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
            'favicon' => 'nullable|image|max:1024',
            'header_text' => 'nullable|string',
            'header_button_text' => 'nullable|string',
            'header_button_link' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'google_maps_embed_code' => 'nullable|string',
            'facebook_url' => 'nullable|url',
            'twitter_url' => 'nullable|url',
            'instagram_url' => 'nullable|url',
            'linkedin_url' => 'nullable|url',
            'youtube_url' => 'nullable|url',
            'meta_description' => 'nullable|string',
            'meta_keywords' => 'nullable|string',
        ]);

        $data = $request->except(['logo', 'favicon']);

        if ($request->hasFile('logo')) {
            if ($settings->logo_path && File::exists(public_path($settings->logo_path))) {
                File::delete(public_path($settings->logo_path));
            }
            $file = $request->file('logo');
            $filename = 'logo_' . time() . '.' . $file->getClientOriginalExtension();
            $path = public_path('site/');
            if (!File::exists($path)) {
                File::makeDirectory($path, 0755, true);
            }
            $file->move($path, $filename);
            $data['logo_path'] = 'site/' . $filename;
        }

        if ($request->hasFile('favicon')) {
            if ($settings->favicon_path && File::exists(public_path($settings->favicon_path))) {
                File::delete(public_path($settings->favicon_path));
            }
            $file = $request->file('favicon');
            $filename = 'favicon_' . time() . '.' . $file->getClientOriginalExtension();
            $path = public_path('site/');
            if (!File::exists($path)) {
                File::makeDirectory($path, 0755, true);
            }
            $file->move($path, $filename);
            $data['favicon_path'] = 'site/' . $filename;
        }

        $settings->update($data);

        return response()->json([
            'message' => 'Site settings updated successfully',
            'settings' => $settings
        ]);
    }
    public function index()
    {
        $settings = SiteSetting::first();
        return response()->json(['data'=>$settings]);
    }
}
