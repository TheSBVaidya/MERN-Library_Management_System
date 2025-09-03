package com.example.user.toolbar_set_up;

import android.view.MenuItem;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

public abstract class TBSetUp extends AppCompatActivity {

    protected void setupToolbar(Toolbar toolbar) {
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
        }
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        // Check if the clicked item is the back arrow
        if (item.getItemId() == android.R.id.home) {
            finish(); // Closes the current activity and returns to the previous one
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
