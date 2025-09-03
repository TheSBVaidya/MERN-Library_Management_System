package com.example.user.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.user.activity.LoginActivity;

public class SessionManager {

    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;

    public SessionManager(Context context) {
        sharedPreferences = context.getSharedPreferences(LoginActivity.SHARED_PREFS, Context.MODE_PRIVATE);
        editor = sharedPreferences.edit();
    }

    public void saveUserId(int userId) {
        editor.putInt(LoginActivity.USER_ID_KEY, userId);
        editor.apply();
    }
    public int getUserId() {
        int currentUserId = sharedPreferences.getInt(LoginActivity.USER_ID_KEY, -1);
        return currentUserId;
    }

    public void saveAuthToken(String token) {
        editor.putString(LoginActivity.AUTH_TOKEN_KEY, token);
        editor.apply();
    }

    public String getAuthToken() {
        return sharedPreferences.getString(LoginActivity.AUTH_TOKEN_KEY, null);
    }

    public boolean isLoggedIn() {
        return getUserId() != -1;
    }

    public void logoutUser() {
        editor.clear();
        editor.apply();
    }
}
