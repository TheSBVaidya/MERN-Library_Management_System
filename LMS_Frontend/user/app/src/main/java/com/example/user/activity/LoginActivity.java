package com.example.user.activity;

import static androidx.fragment.app.FragmentManager.TAG;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;


import com.example.user.R;
import com.example.user.entities.Members;
import com.example.user.utils.ApiService;
import com.example.user.utils.BackendResponse;
import com.example.user.utils.RetrofitClient;
import com.example.user.utils.SessionManager;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

    private static final String TAG = "LoginActivity";

    public static final String SHARED_PREFS = "sharedPrefs";
    public static final String AUTH_TOKEN_KEY = "authTokenKey";
    public static final String USER_ID_KEY = "userIdKey";

    EditText editEmail, editPassword;
    Button btnSubmit, btnRegister;
    Toolbar toolbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        editEmail = findViewById(R.id.editLoginEmail);
        editPassword = findViewById(R.id.editLoginPassword);
        btnSubmit = findViewById(R.id.btnLoginSubmit);
        btnRegister = findViewById(R.id.btnRegister);
        toolbar = findViewById(R.id.toolbar);

        setSupportActionBar(toolbar);

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String email = editEmail.getText().toString();
                String password = editPassword.getText().toString();

                if (email.isEmpty() || password.isEmpty()) {
                    Toast.makeText(LoginActivity.this, "Please fill all fields", Toast.LENGTH_SHORT).show();
                    return;
                }

                Members members = new Members();
                members.setEmail(email);
                members.setPassword(password);

                ApiService apiService = RetrofitClient.getApiService(getApplicationContext());
                Call<BackendResponse> call = apiService.loginUser(members);

                call.enqueue(new Callback<BackendResponse>() {
                    @Override
                    public void onResponse(Call<BackendResponse> call, Response<BackendResponse> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            BackendResponse backendResponse = response.body();

                            if ("success".equals(backendResponse.getStatus())) {

                                JsonElement dataElement = backendResponse.getData();

                                if (dataElement != null && dataElement.isJsonObject()) {
//                                    Members membersdata = new Gson().fromJson(dataElement, Members.class);

                                    JsonObject dataObject = dataElement.getAsJsonObject();

                                    String authToken = dataObject.get("token").getAsString();
                                    String userName = dataObject.get("name").getAsString();
                                    String userId = dataObject.get("id").getAsString();

                                    // save data in SharedPref
                                    SessionManager sessionManager = new SessionManager(getApplicationContext());
                                    sessionManager.saveAuthToken(authToken);
                                    sessionManager.saveUserId(Integer.parseInt(userId));

//                                    Log.e(TAG, "API Success: " + userName);
                                    Toast.makeText(LoginActivity.this, "Welcome: " + userName, Toast.LENGTH_SHORT).show();

//                                    Log.e(TAG, "member: " + membersdata.toString());

                                    // next page
                                    Intent intent = new Intent(getApplicationContext(), DashboardActivity.class);
                                    startActivity(intent);
                                } else {
                                    Toast.makeText(LoginActivity.this, "Login successful, but received unexpected data format.", Toast.LENGTH_SHORT).show();
                                }
                            } else if ("error".equals(backendResponse.getStatus())) {
                                Toast.makeText(LoginActivity.this, "Error: "+backendResponse.getMessage(), Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Log.e(TAG, "API Error: " + response.code() + " - " + response.message());
                            Toast.makeText(LoginActivity.this, "Api Error" + response.code() + " - " + response.message(), Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<BackendResponse> call, Throwable t) {
                        Log.e(TAG, "Network Failure: " + t.getMessage());
                        Toast.makeText(LoginActivity.this, "Network Failure:" + t.getMessage(), Toast.LENGTH_SHORT).show();
                    }

                });
            }
        });

        btnRegister.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getApplicationContext(), RegisterActivity.class);
                startActivity(intent);
            }
        });
    }

}