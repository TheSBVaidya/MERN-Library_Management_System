package com.example.user.activity;

import android.app.Activity;
import android.app.SearchManager;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Parcelable;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.user.R;
import com.example.user.entities.Members;
import com.example.user.toolbar_set_up.TBSetUp;
import com.example.user.utils.ApiService;
import com.example.user.utils.BackendResponse;
import com.example.user.utils.RetrofitClient;
import com.example.user.utils.SessionManager;
import com.google.gson.Gson;
import com.google.gson.JsonElement;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ProfileManagementActivity extends TBSetUp {

    private static final String TAG = "ProfileManagementActivity";



    TextView value_member_id, value_member_since, value_status, value_next_payment;
    EditText etFullName, etEmail, etPhone, etMembershipType, etJoinDate;
    Button btnUpdateProfile, btnChangePassword;
    Toolbar toolbar;
    private ActivityResultLauncher<Intent> updateProfileLauncher;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_profile_management);

        toolbar = findViewById(R.id.toolbar);
        btnUpdateProfile = findViewById(R.id.button_update_profile);
        btnChangePassword = findViewById(R.id.button_change_password);
        value_member_id = findViewById(R.id.value_member_id);
        value_member_since = findViewById(R.id.value_member_since);
        value_status = findViewById(R.id.value_status);
        value_next_payment = findViewById(R.id.value_next_payment);
        etFullName = findViewById(R.id.etFullName);
        etEmail = findViewById(R.id.etEmail);
        etPhone = findViewById(R.id.etPhone);
        etMembershipType = findViewById(R.id.etMembershipType);
        etJoinDate = findViewById(R.id.etJoinDate);

        setupToolbar(toolbar);

        // get id from SP
        SessionManager sessionManager = new SessionManager(this);
        int userId = sessionManager.getUserId();

        updateProfileLauncher = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    // Check if the activity finished successfully
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        // The profile was updated, so refresh the data
                        Toast.makeText(this, "Profile refreshed.", Toast.LENGTH_SHORT).show();
                        APICall(userId); // Re-run the API call to get the latest data
                    }
                });

        APICall(userId);

        btnUpdateProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getApplicationContext(), UpdateProfileActivity.class);
                intent.putExtra("Full_Name", etFullName.getText().toString());
                intent.putExtra("Email", etEmail.getText().toString());
                intent.putExtra("Phone", etPhone.getText().toString());
                updateProfileLauncher.launch(intent);
            }
        });

        btnChangePassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getApplicationContext(), ChangePasswordActivity.class);
                startActivity(intent);
            }
        });
    }
    private void APICall(int userId) {


        ApiService apiService = RetrofitClient.getApiService(this);
        Call<BackendResponse> call = apiService.getUserById(userId);

        call.enqueue(new Callback<BackendResponse>() {
            @Override
            public void onResponse(Call<BackendResponse> call, Response<BackendResponse> response) {
                if (response.isSuccessful()) {
                    BackendResponse backendResponse = response.body();

                    if ("success".equals(backendResponse.getStatus())) {
                        JsonElement dataElement = backendResponse.getData();

                        if (dataElement != null && dataElement.isJsonObject()) {

                            Members membersData = new Gson().fromJson(dataElement, Members.class);

                            etFullName.setText(membersData.getName());
                            etEmail.setText(membersData.getEmail());
                            etPhone.setText(membersData.getPhone());
                            value_member_id.setText("LMS00001");
                            value_member_since.setText("Jan 2023");
                            value_status.setText("Active");
                            value_next_payment.setText("Aug 30, 2025");
                            etMembershipType.setText("Standard Member");
                            etJoinDate.setText("January 15, 2023");

                        }else {
                            Toast.makeText(ProfileManagementActivity.this, "User Not Found", Toast.LENGTH_SHORT).show();
                        }
                    } else if ("error".equals(backendResponse.getStatus())) {
                        Log.e(TAG, "API Error: " + backendResponse.getMessage());

                    }
                }
            }

            @Override
            public void onFailure(Call<BackendResponse> call, Throwable t) {
                Log.e(TAG, "Network Failure: " + t.getMessage());
            }
        });
    }
}