package com.example.user.activity;

import android.app.AlertDialog;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

//import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.example.user.R;
import com.example.user.entities.Members;
import com.example.user.utils.ApiService;
import com.example.user.utils.RetrofitClient;
import com.example.user.utils.BackendResponse;
import com.google.gson.Gson;
import com.google.gson.JsonElement;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {

    private static final String TAG = "MainActivity";

    EditText editName, editPhone, editEmail, editPasswd;
    Button btnSubmit, btnCancel;
    Toolbar toolbar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

//        getSupportActionBar().setTitle("Register");

        editName = findViewById(R.id.editName);
        editPhone = findViewById(R.id.editPhone);
        editEmail = findViewById(R.id.editEmail);
        editPasswd = findViewById(R.id.editPassword);
        btnSubmit = findViewById(R.id.btnSubmit);
        btnCancel = findViewById(R.id.btnCancel);
        toolbar = findViewById(R.id.toolbar);

        setSupportActionBar(toolbar);

        btnSubmit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                String name = editName.getText().toString();
                String phone = editPhone.getText().toString();
                String email = editEmail.getText().toString();
                String password = editPasswd.getText().toString();

//                SharedPreferences pref = getSharedPreferences("app_pref", MODE_PRIVATE);
//                boolean hasConsent = pref.getBoolean("internet_allowed", false);


                    if (name.isEmpty() || phone.isEmpty() || email.isEmpty() || password.isEmpty()) {
                        Toast.makeText(RegisterActivity.this, "Please fill all fields", Toast.LENGTH_SHORT).show();
                        return;
                    }

                    Members members = new Members();
                    members.setEmail(email);
                    members.setName(name);
                    members.setPhone(phone);
                    members.setPassword(password);

                    //get the APi service and create call
                    ApiService apiService = RetrofitClient.getApiService();
                    Call<BackendResponse> call = apiService.registerUser(members);

                    call.enqueue(new Callback<BackendResponse>() {
                        @Override
                        public void onResponse(Call<BackendResponse> call, Response<BackendResponse> response) {
                            if (response.isSuccessful() && response.body() != null) {
                                BackendResponse backendResponse = response.body();

                                if ("success".equals(backendResponse.getStatus())) {

                                    JsonElement datElemet = backendResponse.getData();
                                    
                                    if (datElemet != null && datElemet.isJsonObject()) {
                                        Members membersdata = new Gson().fromJson(datElemet, Members.class);
//                                    Log.e(TAG, "API Success: " + membersdata.);
                                        Toast.makeText(RegisterActivity.this, "Hello " + membersdata.getName(), Toast.LENGTH_SHORT).show();
                                    } else {
                                        Toast.makeText(RegisterActivity.this, "Registration successful, but received unexpected data format.", Toast.LENGTH_SHORT).show();
                                    }
                                    
                                } else if ("error".equals(backendResponse.getStatus())) {
                                    Log.e(TAG, "API Error: " + backendResponse.getMessage());
                                }
                            } else {
                                Log.e(TAG, "API Error: " + response.code() + " - " + response.message());
                            }
                        }

                        @Override
                        public void onFailure(Call<BackendResponse> call, Throwable t) {
                            Log.e(TAG, "Network Failure: " + t.getMessage());
                        }
                    });
            }
        });

        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
    }

    private void showInternetConsentDialog() {
        new AlertDialog.Builder(this)
                .setTitle("Network Access")
                .setMessage("This app needs to use the internet to function. Do you want to proceed?")
                .setPositiveButton("Allow", (dialog, which) -> {
                    SharedPreferences prefs = getSharedPreferences("app_prefs", MODE_PRIVATE);
                    SharedPreferences.Editor editor = prefs.edit();
                    editor.putBoolean("internet_allowed", true);
                    editor.apply();
                    Toast.makeText(this, "Internet access allowed.", Toast.LENGTH_SHORT).show();
        })
                .setNegativeButton("Cancel" , (dialog, which) -> {
                    // User declined. Save this choice.
                    SharedPreferences prefs = getSharedPreferences("app_prefs", MODE_PRIVATE);
                    SharedPreferences.Editor editor = prefs.edit();
                    editor.putBoolean("internet_allowed", false);
                    editor.apply();

                    Toast.makeText(this, "Internet access denied.", Toast.LENGTH_SHORT).show();
                    dialog.dismiss();
                })
                .setCancelable(false)
                .show();
    }



}
