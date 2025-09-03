package com.example.user.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.user.R;
import com.example.user.dto.BorrowedBookDTO;
import com.google.android.material.card.MaterialCardView;

import java.util.List;


public class BorrowedBookAdapter extends RecyclerView.Adapter<BorrowedBookAdapter.BorrowedBookViewHolder> {

    private List<BorrowedBookDTO> booksList;
    private Context context;

    public BorrowedBookAdapter(List<BorrowedBookDTO> booksList, Context context) {
        this.booksList = booksList;
        this.context = context;
    }

    @NonNull
    @Override
    public BorrowedBookViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_borrowed_book, parent, false);
        return new BorrowedBookViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BorrowedBookViewHolder holder, int position) {
        BorrowedBookDTO currentBooks = booksList.get(position);

        holder.bookTitle.setText(currentBooks.getName());
        holder.bookAuthor.setText("by " + currentBooks.getAuthor());
        holder.bookDueDate.setText("Due: " + currentBooks.getReturndue());
        holder.daysRemainingValue.setText("" + currentBooks.getDaysRemaining());
        holder.copyIdValue.setText("" + currentBooks.getCopy_id());
        holder.borrowedDate.setText("Borrowed: " + currentBooks.getIssued());
        holder.rackLocationValue.setText("" + currentBooks.getRack());

        switch (currentBooks.getStatus()) {
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

    }

    @Override
    public int getItemCount() {
        return booksList.size();
    }

    public void updateBooks(List<BorrowedBookDTO> newBooks) {
        this.booksList.clear();
        this.booksList.addAll(newBooks);
        notifyDataSetChanged();
    }

    public static class BorrowedBookViewHolder extends RecyclerView.ViewHolder {

        MaterialCardView cardView;

        TextView bookTitle, bookAuthor, bookStatus, bookDueDate, borrowedDate, daysRemainingValue, rackLocationValue, copyIdValue;
        Button returnButton, renewButton;

        public BorrowedBookViewHolder(@NonNull View itemView) {
            super(itemView);
            cardView = (MaterialCardView) itemView;
            bookTitle = itemView.findViewById(R.id.bookTitle);
            bookAuthor = itemView.findViewById(R.id.bookAuthor);
            bookStatus = itemView.findViewById(R.id.bookStatus);
            bookDueDate = itemView.findViewById(R.id.bookDueDate);
            borrowedDate = itemView.findViewById(R.id.borrowedDate);
            daysRemainingValue = itemView.findViewById(R.id.daysRemainingValue);
            rackLocationValue = itemView.findViewById(R.id.rackLocationValue);
            copyIdValue = itemView.findViewById(R.id.copyIdValue);
            returnButton = itemView.findViewById(R.id.returnButton);
            renewButton = itemView.findViewById(R.id.renewButton);
        }
    }
}
