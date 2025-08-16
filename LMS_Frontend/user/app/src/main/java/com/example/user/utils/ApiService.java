package com.example.user.utils;

import com.example.user.entities.Members;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.POST;

public interface ApiService {

    String BASE_URL = "http://192.168.44.103:3000";

    @POST("/members/register")
    Call<BackendResponse> registerUser(@Body Members members);

    @POST("/members/login")
    Call<BackendResponse> loginUser(@Body Members members);
}
