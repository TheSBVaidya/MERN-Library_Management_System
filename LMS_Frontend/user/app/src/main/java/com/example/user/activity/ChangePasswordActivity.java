package com.example.user.activity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.user.R;
import com.example.user.dto.ChangePasswordDTO;
import com.example.user.utils.ApiService;
import com.example.user.utils.BackendResponse;
import com.example.user.utils.RetrofitClient;
import com.example.user.utils.SessionManager;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChangePasswordActivity extends AppCompatActivity {

    EditText etCP, etNP, etCNP;
    Button btnUpdatePasswd, btnCancel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_change_password);

        etCP = findViewById(R.id.etCP);
        etNP = findViewById(R.id.etNP);
        etCNP = findViewById(R.id.etCNP);
        btnUpdatePasswd = findViewById(R.id.updatePasswordButton);
        btnCancel = findViewById(R.id.cancelButton);

        SessionManager sessionManager = new SessionManager(this);
        int userId = sessionManager.getUserId();
        
        btnCancel.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                finish();
            }
        });
        
        btnUpdatePasswd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                APIChangePass(userId);
            }
        });

    }

    private void APIChangePass(int userId) {
        String CP = etCP.getText().toString();
        String NP = etNP.getText().toString();
        String CNP = etCNP.getText().toString();

        if (!NP.equals(CNP)) {
            Toast.makeText(ChangePasswordActivity.this, "Changing Password must be same", Toast.LENGTH_SHORT).show();
        } else {

            ChangePasswordDTO changePassword = new ChangePasswordDTO();
            changePassword.setCurrPassword(CP);
            changePassword.setNewPassword(NP);

            ApiService apiService = RetrofitClient.getApiService(getApplicationContext());
            Call<BackendResponse> call = apiService.updatePassword(changePassword, userId);

            call.enqueue(new Callback<BackendResponse>() {
                @Override
                public void onResponse(Call<BackendResponse> call, Response<BackendResponse> response) {
                    if (response.isSuccessful()) {
                        BackendResponse backendResponse = response.body();

                        if ("success".equals(backendResponse.getStatus())) {
                            Toast.makeText(ChangePasswordActivity.this, "Password Change Successfully", Toast.LENGTH_SHORT).show();
                            finish();
                        } else if ("error".equals(backendResponse.getStatus())) {
                            Toast.makeText(ChangePasswordActivity.this, "The Error Occure", Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Toast.makeText(ChangePasswordActivity.this, "API Error", Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<BackendResponse> call, Throwable t) {
                    Toast.makeText(ChangePasswordActivity.this, "Network Failure: "+t.getMessage(), Toast.LENGTH_SHORT).show();

                }
            });
            Toast.makeText(ChangePasswordActivity.this, "Password is change", Toast.LENGTH_SHORT).show();
        }
    }
}