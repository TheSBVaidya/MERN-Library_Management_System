package com.example.user.activity;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.cardview.widget.CardView;

import com.example.user.R;
import com.google.android.material.card.MaterialCardView;

public class DashboardActivity extends AppCompatActivity {

    Toolbar toolbar;
    MaterialCardView btnSearchBook;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_dashboard);

        toolbar = findViewById(R.id.toolbar);
        btnSearchBook = findViewById(R.id.btnSearchBook);

        setSupportActionBar(toolbar);

        btnSearchBook.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent intent = new Intent(getApplicationContext(), SearchBookActivity.class);
                startActivity(intent);
            }
        });
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.dashboard_menu, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.action_profile) {
            // Handle Profile click
            Toast.makeText(this, "Profile clicked", Toast.LENGTH_SHORT).show();

            Intent intent = new Intent(getApplicationContext(), ProfileManagementActivity.class);
            startActivity(intent);

            return true;
        } else if (id == R.id.action_sign_out) {
            // Handle Sign Out click
            Toast.makeText(this, "Sign Out clicked", Toast.LENGTH_SHORT).show();
            finish();
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}