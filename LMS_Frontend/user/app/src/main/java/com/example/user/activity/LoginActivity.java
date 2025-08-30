package com.example.user.activity;

import static androidx.fragment.app.FragmentManager.TAG;

import android.content.Intent;
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
import com.google.gson.Gson;
import com.google.gson.JsonElement;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;

public class LoginActivity extends AppCompatActivity {

    private static final String TAG = "LoginActivity";

    EditText editEmail, editPassword;
    Button btnSubmit, btnCancel, btnRegister;

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

                ApiService apiService = RetrofitClient.getApiService();
                Call<BackendResponse> call = apiService.loginUser(members);

                call.enqueue(new Callback<BackendResponse>() {
                    @Override
                    public void onResponse(Call<BackendResponse> call, Response<BackendResponse> response) {
                        if (response.isSuccessful() && response.body() != null) {
                            BackendResponse backendResponse = response.body();

                            if ("success".equals(backendResponse.getStatus())) {

                                JsonElement dataElement = backendResponse.getData();

                                if (dataElement != null && dataElement.isJsonObject()) {
                                    Members membersdata = new Gson().fromJson(dataElement, Members.class);
                                    Log.e(TAG, "API Success: " + membersdata.getName());
                                    Toast.makeText(LoginActivity.this, "Welcome Back: " + membersdata.getName(), Toast.LENGTH_SHORT).show();

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