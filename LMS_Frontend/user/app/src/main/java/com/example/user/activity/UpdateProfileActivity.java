package com.example.user.activity;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.user.R;
import com.example.user.entities.Members;
import com.example.user.utils.ApiService;
import com.example.user.utils.BackendResponse;
import com.example.user.utils.RetrofitClient;
import com.example.user.utils.SessionManager;
import com.google.gson.JsonElement;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class UpdateProfileActivity extends AppCompatActivity {

    private static final String TAG = "UpdateProfileActivity";

    EditText etName, etEmail, etPhone;
    Button btnUpdate, btnCancel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_update_profile);

        etName = findViewById(R.id.etName);
        etEmail = findViewById(R.id.etEmail);
        etPhone = findViewById(R.id.etPhone);
        btnUpdate = findViewById(R.id.btnUpdate);
        btnCancel = findViewById(R.id.btnCancel);

        loadUserDetails();

        SessionManager sessionManager = new SessionManager(this);
        int userId = sessionManager.getUserId();

        btnUpdate.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                APIUpdateUser(userId);
            }
        });

        btnCancel.setOnClickListener(v -> {
            finish();
        });


    }

    private void loadUserDetails() {
        Bundle extras = getIntent().getExtras();

        if (extras != null) {
            String fname = extras.getString("Full_Name");
            String email = extras.getString("Email");
            String phone = extras.getString("Phone");

            etName.setText(fname);
            etEmail.setText(email);
            etPhone.setText(phone);
        }
    }

    private void APIUpdateUser(int userId) {

        Members members = new Members();
        members.setEmail(etEmail.getText().toString());
        members.setName(etName.getText().toString());
        members.setPhone(etPhone.getText().toString());

        ApiService apiService = RetrofitClient.getApiService(this);
        Call<BackendResponse> call = apiService.updateProfile(members, userId);

        call.enqueue(new Callback<BackendResponse>() {
            @Override
            public void onResponse(Call<BackendResponse> call, Response<BackendResponse> response) {
                if (response.isSuccessful()) {
                    BackendResponse backendResponse = response.body();

                    if ("success".equals(backendResponse.getStatus())) {

                            Toast.makeText(UpdateProfileActivity.this, "Profile Updated Successfully !", Toast.LENGTH_SHORT).show();
                            setResult(Activity.RESULT_OK);
                            finish();

                    } else {
                        Log.e(TAG, "API Error: " + response.code() + " - " + response.message());
//                        Toast.makeText(UpdateProfileActivity.this, "API Error: " + response.code() + " - " + response.message(), Toast.LENGTH_SHORT).show();
                    }
                }  else {
                    Log.e(TAG, "API Error: " + response.code() + " - " + response.message());
                }
            }

            @Override
            public void onFailure(Call<BackendResponse> call, Throwable t) {
                Log.e(TAG, "Network Failure: " + t.getMessage());
            }
        });


    }
}