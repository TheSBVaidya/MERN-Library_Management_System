package com.example.user.activity;

import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.widget.Toolbar;

import com.example.user.R;
import com.example.user.entities.Books;
import com.example.user.toolbar_set_up.TBSetUp;
import com.example.user.utils.ApiService;
import com.example.user.utils.BackendResponse;
import com.example.user.utils.RetrofitClient;
import com.google.android.material.chip.Chip;
import com.google.gson.Gson;
import com.google.gson.JsonElement;

import java.lang.reflect.Type;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class BookDetailsActivity extends TBSetUp {

    private static final String TAG = "BookDetailsActivity";

    Toolbar toolbar;
    TextView tvBookTitle, tvBookAuthor, tvIsbn, tvPrice, tvSubject, tvTotalCopies;
    Chip chipAvailability;
    Button btnBorrow, btnViewCopies;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_book_details);

        toolbar = findViewById(R.id.toolbar);
        tvBookTitle = findViewById(R.id.tvBookTitle);
        tvBookAuthor = findViewById(R.id.tvBookAuthor);
        tvIsbn = findViewById(R.id.tvIsbn);
        tvPrice = findViewById(R.id.tvPrice);
        tvSubject = findViewById(R.id.tvSubject);
        tvTotalCopies = findViewById(R.id.tvTotalCopies);
        chipAvailability = findViewById(R.id.chipAvailability);
        btnBorrow = findViewById(R.id.btnBorrow);
        btnViewCopies = findViewById(R.id.btnViewCopies);
        int id = 0;

        setupToolbar(toolbar);

        if (getIntent().hasExtra("Book_ID")) {
             id = getIntent().getIntExtra("Book_ID", 0);
             Log.e(TAG, "ID: "+id);
            if (id != 0) {
                APICallBook(id);
            } else {
                Toast.makeText(this, "Error: Invalid Book ID.", Toast.LENGTH_SHORT).show();
            }
        }
    }


    private void APICallBook(int id) {
        Log.e(TAG, "ID Under: "+id);

        ApiService apiService = RetrofitClient.getApiService(this);
        Call<BackendResponse> call = apiService.getBookById(id);

        call.enqueue(new Callback<BackendResponse>() {
            @Override
            public void onResponse(Call<BackendResponse> call, Response<BackendResponse> response) {
                if (response.isSuccessful()) {
                    BackendResponse backendResponse = response.body();

                    if ("success".equals(backendResponse.getStatus())) {
                        JsonElement dataElement = backendResponse.getData();

                        if (dataElement != null && dataElement.isJsonObject()) {
                            Books booksData = new Gson().fromJson(dataElement, Books.class);

                            Log.e(TAG, "data: " + booksData.toString());

                            // set Book Details in page TextView
                            tvBookTitle.setText(booksData.getName());
                            tvBookAuthor.setText("by "+ booksData.getAuthor());
                            tvIsbn.setText(booksData.getIsbn());
                            tvPrice.setText("₹" +booksData.getPrice());
                            tvSubject.setText(booksData.getSubject());
                            chipAvailability.setText("Available - " + booksData.getAvailableCopies() +" copies in library");
                            tvTotalCopies.setText(booksData.getTotalCopies() + " copies");
                        } else {
                            Log.e(TAG, "Data Unable to detch");
                            Toast.makeText(BookDetailsActivity.this, "Data Unable to Fetch", Toast.LENGTH_SHORT).show();
                        }
                    } else if ("error".equals(backendResponse.getStatus())) {
                        Log.e(TAG, "API Error: " + backendResponse.getMessage());
                    }
                }else {
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