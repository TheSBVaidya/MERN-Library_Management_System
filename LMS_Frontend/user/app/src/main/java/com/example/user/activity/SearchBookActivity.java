package com.example.user.activity;

import android.os.Bundle;
import android.text.InputType;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.user.R;
import com.example.user.adapter.BookAdapter;
import com.example.user.entities.Books;
import com.example.user.utils.ApiService;
import com.example.user.utils.BackendResponse;
import com.example.user.utils.RetrofitClient;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;


public class SearchBookActivity extends AppCompatActivity {

    Spinner spinnerSearchBy;
    Toolbar toolbar;
    Button btnSearch;
    EditText editSearchQuery;
    RecyclerView recyclerViewResult;
    BookAdapter bookAdapter;
    private static final String TAG = "SearchBookActivity";


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_search_book);

        spinnerSearchBy = findViewById(R.id.spinnerSearchBy);
        toolbar = findViewById(R.id.toolbar);
        btnSearch = findViewById(R.id.btnSearch);
        editSearchQuery = findViewById(R.id.editSearchQuery);
        recyclerViewResult = findViewById(R.id.recyclerViewResults);

        setSupportActionBar(toolbar);

        setupToolbar();
        setupSpinners();
        setupRecyclerView();

        btnSearch.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                getBooks();
            }
        });
    }

    private void setupToolbar() {
        setSupportActionBar(toolbar);
        if (getSupportActionBar() != null) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
        }
    }

    private void setupSpinners() {
        ArrayAdapter<CharSequence> searchByAdapter = ArrayAdapter.createFromResource(
                this, R.array.search_by_array, android.R.layout.simple_spinner_item);
        searchByAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinnerSearchBy.setAdapter(searchByAdapter);
    }

    private void setupRecyclerView() {
        recyclerViewResult.setLayoutManager(new LinearLayoutManager(this));
        // Initialize with an empty list
        bookAdapter = new BookAdapter(new ArrayList<>());
        recyclerViewResult.setAdapter(bookAdapter);

        spinnerSearchBy.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> adapterView, View view, int i, long l) {
                String selectedItem = adapterView.getItemAtPosition(i).toString();
                if (selectedItem.equals("ISBN") || selectedItem.equals("Price")) {
                    editSearchQuery.setInputType(InputType.TYPE_CLASS_NUMBER);
                } else {
                    editSearchQuery.setInputType(InputType.TYPE_CLASS_TEXT);
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> adapterView) {}
        });
    }

    @Override
    public boolean onOptionsItemSelected(@NonNull MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            finish();
            return true;
        }
        return super.onOptionsItemSelected(item);
    }

    private void getBooks() {

        String searchedCategory = spinnerSearchBy.getSelectedItem().toString().toLowerCase();
        String searched = editSearchQuery.getText().toString();

        if (searched.isEmpty()) {
            Toast.makeText(this, "Please enter a search term", Toast.LENGTH_SHORT).show();
            return;
        }

        Map<String, String> searchParams = new HashMap<>();
        searchParams.put(searchedCategory, searched);

        ApiService apiService = RetrofitClient.getApiService();
        Call<BackendResponse> call = apiService.getBookByNAISP(searchParams);

        call.enqueue(new Callback<BackendResponse>() {
            @Override
            public void onResponse(Call<BackendResponse> call, Response<BackendResponse> response) {
                if (response.isSuccessful()) {
                    BackendResponse backendResponse = response.body();

                    if ("success".equals(backendResponse.getStatus())) {
                        JsonElement dataElement = backendResponse.getData();

                        if (dataElement != null && dataElement.isJsonArray()) {

                            Type bookListType = new TypeToken<ArrayList<Books>>(){}.getType();
                            List<Books> booksData = new Gson().fromJson(dataElement, bookListType);

                            bookAdapter.updateBook(booksData);

                            Toast.makeText(SearchBookActivity.this, "Found " + booksData.size() + " books", Toast.LENGTH_SHORT).show();
                            Log.d(TAG, "API Success: Found " + booksData.size() + " books.");
                            for (Books book : booksData) {
                                Log.d(TAG, "Book found: " + book.getName() + " by " + book.getAuthor());
                            }
                        } else {
                            bookAdapter.updateBook(new ArrayList<>());
                            Toast.makeText(SearchBookActivity.this, "Error: " + response.code(), Toast.LENGTH_SHORT).show();
                        }
                    }
                }
            }

            @Override
            public void onFailure(Call<BackendResponse> call, Throwable t) {
                Toast.makeText(SearchBookActivity.this, "Network Failure: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e(TAG, "Network Failure:", t);

            }
        });
    }
}