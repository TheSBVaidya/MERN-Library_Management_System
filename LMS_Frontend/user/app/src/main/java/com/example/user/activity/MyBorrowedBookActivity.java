package com.example.user.activity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.user.R;
import com.example.user.adapter.BooksAdapter;
import com.example.user.adapter.BorrowedBookAdapter;
import com.example.user.dto.Book;
import com.example.user.dto.BorrowedBookDTO;
import com.example.user.toolbar_set_up.TBSetUp;
import com.example.user.utils.ApiService;
import com.example.user.utils.BackendResponse;
import com.example.user.utils.RetrofitClient;
import com.example.user.utils.SessionManager;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MyBorrowedBookActivity extends TBSetUp {

    Toolbar toolbar;
    TextView tvBorrowedBook, tvDueSoon, tvOverdue, tvfines, tvReminder, tvBorrowedBooksTitle;
    RecyclerView booksRecyclerView;
    BorrowedBookAdapter borrowedBookAdapter;

    private static final String TAG = "MyBorrowedBookActivity";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_my_borrowed_book);

        toolbar = findViewById(R.id.toolbar);
        booksRecyclerView = findViewById(R.id.booksRecyclerView);
        tvBorrowedBook = findViewById(R.id.tvBorrowedBook);
        tvDueSoon = findViewById(R.id.tvDueSoon);
        tvOverdue = findViewById(R.id.tvOverdue);
        tvfines = findViewById(R.id.tvfines);
        tvReminder = findViewById(R.id.tvReminder);
        tvBorrowedBooksTitle = findViewById(R.id.tvBorrowedBooksTitle);

        setupToolbar(toolbar);

        setUpRecyclerView();

        SessionManager sessionManager = new SessionManager(this);
        int userId = sessionManager.getUserId();
        apiGetBorrowedBooks(userId);
    }

    private void setUpRecyclerView() {
        booksRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        // Initialize with an empty list
        borrowedBookAdapter = new BorrowedBookAdapter(new ArrayList<>(), this);
        booksRecyclerView.setAdapter(borrowedBookAdapter);
    }

    private void apiGetBorrowedBooks(int userId) {
        ApiService apiService = RetrofitClient.getApiService(this);
        Call<BackendResponse> call = apiService.getBookDetails(userId);

        call.enqueue(new Callback<BackendResponse>() {
            @Override
            public void onResponse(Call<BackendResponse> call, Response<BackendResponse> response) {

                if (response.isSuccessful()) {
                    BackendResponse backendResponse = response.body();
                    if ("success".equals(backendResponse.getStatus())) {
                        JsonElement dataElemet = backendResponse.getData();

                        if (dataElemet != null && dataElemet.isJsonArray()) {

                            Type borrowedBookType = new TypeToken<ArrayList<BorrowedBookDTO>>(){}.getType();
                            List<BorrowedBookDTO> booksData = new Gson().fromJson(dataElemet, borrowedBookType);

                            for (BorrowedBookDTO book : booksData) {
                                book.calculateStatusAndDaysRemaining();
                            }

                            Log.e(TAG, booksData.toString());

                            // update adapter
                            borrowedBookAdapter.updateBooks(booksData);

                            //dashboard card
                            updateDashboardCards(booksData);

                            Toast.makeText(MyBorrowedBookActivity.this, "Found " + booksData.size() + " books", Toast.LENGTH_SHORT).show();
                        } else {
                            borrowedBookAdapter.updateBooks(new ArrayList<>());
                            Toast.makeText(MyBorrowedBookActivity.this, "Error: " + response.code(), Toast.LENGTH_SHORT).show();
                        }
                    } else {
                        Toast.makeText(MyBorrowedBookActivity.this, "API Error: " + backendResponse.getStatus(), Toast.LENGTH_SHORT).show();
                    }
                }
            }

            @Override
            public void onFailure(Call<BackendResponse> call, Throwable t) {
                Toast.makeText(MyBorrowedBookActivity.this, "Network Failure: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e(TAG, "Network Failure:", t);
            }
        });
    }

    private void updateDashboardCards(List<BorrowedBookDTO> books) {
        int borrowedCount = books.size();
        int dueSoonCount = 0;
        int overdueCount = 0;
        int totalFine = 0;
        int soonestDueDate = Integer.MAX_VALUE;

        for (BorrowedBookDTO book : books) {
            if (book.getStatus() == BorrowedBookDTO.BookStatus.DUE_SOON) {
                dueSoonCount++;
                // Find the minimum number of days remaining for the reminder message
                if (book.getDaysRemaining() < soonestDueDate) {
                    soonestDueDate = book.getDaysRemaining();
                }
            } else if (book.getStatus() == BorrowedBookDTO.BookStatus.OVERDUE) {
                overdueCount++;
                // Fine is 50 per day. daysRemaining is negative, so we use its absolute value.
                int overdueDays = Math.abs(book.getDaysRemaining());
                totalFine += overdueDays * 50;
            }
        }

        // Set the text for the dashboard cards
        tvBorrowedBook.setText(String.valueOf(borrowedCount));
        tvDueSoon.setText(String.valueOf(dueSoonCount));
        tvOverdue.setText(String.valueOf(overdueCount));

        // Set the calculated fine
        tvfines.setText(String.format(Locale.getDefault(), "₹%d", totalFine));

        // Update the title for the RecyclerView
        tvBorrowedBooksTitle.setText(String.format(Locale.getDefault(), "Currently Borrowed Books (%d)", borrowedCount));

        // Update the reminder text based on the soonest due book
        if (dueSoonCount > 0) {
            tvReminder.setVisibility(View.VISIBLE);
            tvReminder.setText(String.format(Locale.getDefault(),
                    "Reminder: You have %d book(s) due within the next %d days. Please plan to return them on time to avoid fines.",
                    dueSoonCount, soonestDueDate));
        } else {
            tvReminder.setVisibility(View.GONE);
        }
    }

}