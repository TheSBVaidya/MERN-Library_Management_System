package com.example.user.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.user.R;
import com.example.user.dto.Book;
import com.google.android.material.card.MaterialCardView;

import java.util.List;

// This adapter is responsible for binding the Book data to the views in list_item_book.xml
public class BooksAdapter extends RecyclerView.Adapter<BooksAdapter.BookViewHolder> {

    private final List<Book> bookList;
    private final Context context;

    public BooksAdapter(Context context, List<Book> bookList) {
        this.context = context;
        this.bookList = bookList;
    }

    // Called when the RecyclerView needs a new ViewHolder.
    // It inflates the layout for a single list item.
    @NonNull
    @Override
    public BookViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View itemView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_borrowed_book, parent, false);
        return new BookViewHolder(itemView);
    }

    // Called by the RecyclerView to display the data at the specified position.
    // This method updates the contents of the ViewHolder to reflect the item at the given position.
    @Override
    public void onBindViewHolder(@NonNull BookViewHolder holder, int position) {
        Book currentBook = bookList.get(position);

        // Set the text for all TextViews
        holder.bookTitle.setText(currentBook.getTitle());
        holder.bookAuthor.setText("by " + currentBook.getAuthor());
        holder.bookDueDate.setText("Due: " + currentBook.getDueDate());
        holder.daysRemaining.setText("" + currentBook.getDaysRemaining());
        holder.copyId.setText("" + currentBook.getCopyId());
        holder.borrowedDate.setText("Borrowed: " + currentBook.getBorrowedDate());
        holder.rackLocation.setText("" + currentBook.getRackLocation());

        // Update the status view based on the book's status
        switch (currentBook.getStatus()) {
            case GOOD_STANDING:
                holder.bookStatus.setText("GOOD STANDING");
                holder.bookStatus.setBackgroundColor(ContextCompat.getColor(context, R.color.status_good_bg));
                holder.bookStatus.setTextColor(ContextCompat.getColor(context, R.color.status_good_text));
                holder.cardView.setStrokeColor(ContextCompat.getColor(context, R.color.card_default_stroke));
                holder.cardView.setStrokeWidth(2); // Default stroke width
                break;
            case DUE_SOON:
                holder.bookStatus.setText("DUE SOON");
                holder.bookStatus.setBackgroundColor(ContextCompat.getColor(context, R.color.status_due_soon_bg));
                holder.bookStatus.setTextColor(ContextCompat.getColor(context, R.color.status_due_soon_text));
                holder.cardView.setStrokeColor(ContextCompat.getColor(context, R.color.card_due_soon_stroke));
                holder.cardView.setStrokeWidth(4); // Make border thicker
                break;
            case OVERDUE:
                holder.bookStatus.setText("OVERDUE");
                holder.bookStatus.setBackgroundColor(ContextCompat.getColor(context, R.color.status_overdue_bg));
                holder.bookStatus.setTextColor(ContextCompat.getColor(context, R.color.status_overdue_text));
                holder.cardView.setStrokeColor(ContextCompat.getColor(context, R.color.card_overdue_stroke));
                holder.cardView.setStrokeWidth(4);
                break;
        }

        // Set click listeners for the buttons
        holder.returnButton.setOnClickListener(v -> Toast.makeText(context, "Returning '" + currentBook.getTitle() + "'", Toast.LENGTH_SHORT).show());
        holder.renewButton.setOnClickListener(v -> Toast.makeText(context, "Renewing '" + currentBook.getTitle() + "'", Toast.LENGTH_SHORT).show());
    }

    // Returns the total number of items in the data set held by the adapter.
    @Override
    public int getItemCount() {
        return bookList.size();
    }


    // The ViewHolder holds references to the views for a single list item.
    // This avoids repeatedly calling findViewById(), which is expensive.
    public static class BookViewHolder extends RecyclerView.ViewHolder {
        MaterialCardView cardView;
        TextView bookTitle, bookAuthor, bookStatus, bookDueDate, daysRemaining, copyId, borrowedDate, rackLocation;
        Button returnButton, renewButton;

        public BookViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = (MaterialCardView) itemView;
            bookTitle = itemView.findViewById(R.id.bookTitle);
            bookAuthor = itemView.findViewById(R.id.bookAuthor);
            bookStatus = itemView.findViewById(R.id.bookStatus);
            bookDueDate = itemView.findViewById(R.id.bookDueDate);
            daysRemaining = itemView.findViewById(R.id.daysRemainingValue);
            copyId = itemView.findViewById(R.id.copyIdValue);
            borrowedDate = itemView.findViewById(R.id.borrowedDate);
            rackLocation = itemView.findViewById(R.id.rackLocationValue);
            returnButton = itemView.findViewById(R.id.returnButton);
            renewButton = itemView.findViewById(R.id.renewButton);
        }
    }
}
