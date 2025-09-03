package com.example.user.dto;

// This is a Plain Old Java Object (POJO) that represents a single borrowed book.
// It holds all the information needed to populate the list item layout.
public class Book {

    // An enum to represent the book's status, which helps in styling the UI accordingly.
    public enum BookStatus {
        GOOD_STANDING,
        DUE_SOON,
        OVERDUE
    }

    private final String title;
    private final String author;
    private final String dueDate;
    private final int daysRemaining;
    private final String copyId;
    private final String borrowedDate;
    private final String rackLocation;
    private final BookStatus status;

    public Book(String title, String author, String dueDate, int daysRemaining, String copyId, String borrowedDate, String rackLocation, BookStatus status) {
        this.title = title;
        this.author = author;
        this.dueDate = dueDate;
        this.daysRemaining = daysRemaining;
        this.copyId = copyId;
        this.borrowedDate = borrowedDate;
        this.rackLocation = rackLocation;
        this.status = status;
    }

    // Getter methods for all fields
    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public String getDueDate() {
        return dueDate;
    }

    public int getDaysRemaining() {
        return daysRemaining;
    }

    public String getCopyId() {
        return copyId;
    }

    public String getBorrowedDate() {
        return borrowedDate;
    }

    public String getRackLocation() {
        return rackLocation;
    }

    public BookStatus getStatus() {
        return status;
    }
}
