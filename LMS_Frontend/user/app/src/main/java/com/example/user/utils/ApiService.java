package com.example.user.utils;

import com.example.user.dto.ChangePasswordDTO;
import com.example.user.entities.Members;
import java.util.Map;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.PATCH;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.Path;
import retrofit2.http.QueryMap;

public interface ApiService {

    String BASE_URL = "http://192.168.44.100:3000";

    @POST("/members/register")
    Call<BackendResponse> registerUser(@Body Members members);

    @POST("/members/login")
    Call<BackendResponse> loginUser(@Body Members members);

    @PATCH("/members/updatePassword/{id}")
    Call<BackendResponse> updatePassword(@Body ChangePasswordDTO changePassword, @Path("id") int id);

    @GET("/members/getBookByNAIS")
    Call<BackendResponse> getBookByNAISP(@QueryMap Map<String, String> options);

    @GET("/members/getBookById/{id}")
    Call<BackendResponse> getBookById(@Path("id") int id);

    @GET("/members/getUserById/{id}")
    Call<BackendResponse> getUserById(@Path("id") int id);

    @PUT("/members/updateProfile/{id}")
    Call<BackendResponse> updateProfile(@Body Members members, @Path("id") int id);

    @GET("/members/getBookDetails/{id}")
    Call<BackendResponse> getBookDetails(@Path("id") int id);

    @PATCH("/members/returnBook/{id}")
    Call<BackendResponse> returnBook(@Path("id") int id);
}
