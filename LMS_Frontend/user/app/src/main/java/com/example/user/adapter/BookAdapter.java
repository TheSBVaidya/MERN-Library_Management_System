package com.example.user.adapter;

import android.content.Context;
import android.content.Intent;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.user.R;
import com.example.user.activity.BookDetailsActivity;
import com.example.user.entities.Books;

import java.util.List;

public class BookAdapter extends RecyclerView.Adapter<BookAdapter.BookViewHolder> {


    private List<Books> booksList;

    public BookAdapter(List<Books> booksList) {
        this.booksList = booksList;
    }

    @NonNull
    @Override
    public BookAdapter.BookViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.item_book_result, parent, false);
        return new BookViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull BookAdapter.BookViewHolder holder, int position) {
        Books currentBooks = booksList.get(position);

        holder.tvBookTitle.setText(currentBooks.getName());
        holder.tvBookAuthor.setText("by " + currentBooks.getAuthor());
        holder.tvSubject.setText(currentBooks.getSubject());
        holder.tvIsbn.setText(currentBooks.getIsbn());
        holder.tvPrice.setText("₹"+ currentBooks.getPrice());
        holder.tvAvailability.setText("Available");  // change later

        holder.btnViewDetails.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                int id = currentBooks.getId();
                Context context = view.getContext();
                Intent intent = new Intent(context, BookDetailsActivity.class);
                intent.putExtra("Book_ID", id);
//                Toast.makeText(context, "Selected Id: "+ id, Toast.LENGTH_SHORT).show();
                context.startActivity(intent);
            }
        });
    }

    @Override
    public int getItemCount() {
        return booksList.size();
    }

    // A helper method to update the data in the adapter and refresh the RecyclerView.
    public void updateBook(List<Books> newBooks) {
        this.booksList.clear();
        this.booksList.addAll(newBooks);
        notifyDataSetChanged();
    }

    public static class BookViewHolder extends RecyclerView.ViewHolder {

        TextView tvBookTitle, tvBookAuthor, tvSubject, tvIsbn, tvPrice, tvAvailability;
        Button btnViewDetails;
        public BookViewHolder(@NonNull View itemView) {
            super(itemView);
            tvBookTitle = itemView.findViewById(R.id.tvBookTitle);
            tvBookAuthor = itemView.findViewById(R.id.tvBookAuthor);
            tvSubject = itemView.findViewById(R.id.tvSubject);
            tvIsbn = itemView.findViewById(R.id.tvIsbn);
            tvPrice = itemView.findViewById(R.id.tvPrice);
            tvAvailability = itemView.findViewById(R.id.tvAvailability);
            btnViewDetails = itemView.findViewById(R.id.btnViewDetails);
        }
    }
}
