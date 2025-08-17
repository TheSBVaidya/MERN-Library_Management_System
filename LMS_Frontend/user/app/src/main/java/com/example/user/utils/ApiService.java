package com.example.user.utils;

import com.example.user.entities.ChangePassword;
import com.example.user.entities.Members;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {

    String BASE_URL = "http://192.168.44.103:3000";

    @POST("/members/register")
    Call<BackendResponse> registerUser(@Body Members members);

    @POST("/members/login")
    Call<BackendResponse> loginUser(@Body Members members);

    @PATCH("/members/updatePassword/{id}")
    Call<BackendResponse> updatePassword(@Body ChangePassword changePassword, @Path("id") int id);
}
