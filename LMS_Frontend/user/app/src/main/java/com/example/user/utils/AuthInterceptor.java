package com.example.user.utils;

import android.content.Context;
import android.content.SharedPreferences;

import androidx.annotation.NonNull;

import com.example.user.activity.LoginActivity;

import java.io.IOException;

import okhttp3.Interceptor;
import okhttp3.Request;
import okhttp3.Response;

public class AuthInterceptor implements Interceptor {

    private Context context;

    public AuthInterceptor(Context context) {
        this.context = context;
    }

    @NonNull
    @Override
    public Response intercept(@NonNull Chain chain) throws IOException {

        // get original request
        Request.Builder requestBuilder = chain.request().newBuilder();

        //get token from shared preference
        SharedPreferences sp = context.getSharedPreferences(LoginActivity.SHARED_PREFS, Context.MODE_PRIVATE);
        String token = sp.getString(LoginActivity.AUTH_TOKEN_KEY, null);

        // token exist add to header
        if (token != null) {
            requestBuilder.addHeader("Authorization", "Bearer " + token);
        }

        return chain.proceed(requestBuilder.build());
    }
}
