    package com.example.user.dto;

    import com.google.gson.annotations.SerializedName;

    import java.time.LocalDate;
    import java.time.format.DateTimeFormatter;
    import java.time.format.DateTimeParseException;
    import java.time.temporal.ChronoUnit;
    import java.util.Date;

    import lombok.AllArgsConstructor;
    import lombok.Getter;
    import lombok.RequiredArgsConstructor;
    import lombok.Setter;
    import lombok.ToString;

    @Getter
    @Setter
    @RequiredArgsConstructor
    @AllArgsConstructor
    @ToString
    public class BorrowedBookDTO {

        public enum BookStatus {
            GOOD_STANDING,
            DUE_SOON,
            OVERDUE
        }

        @SerializedName("issue_records_id")
        private int issue_records_id;

        @SerializedName("book_id")
        private int book_id;

        @SerializedName("name")
        private String name;

        @SerializedName("author")
        private String author;

        @SerializedName("issued")
        private String issued;

        @SerializedName("returndue")
        private String returndue;

        @SerializedName("copy_id")
        private int copy_id;

        @SerializedName("rack")
        private String rack;

        private BookStatus status;

        private int daysRemaining;

        /**
         * Calculates the days remaining until the due date and sets the book's status.
         * This method should be called after the book data is fetched from the backend.
         * We'll define "DUE_SOON" as 3 days or fewer.
         */
        public void calculateStatusAndDaysRemaining() {
            if (returndue == null || returndue.isEmpty()) {
                this.status = BookStatus.GOOD_STANDING;
                this.daysRemaining = 0;
                return;
            }

            try {
                // Use java.time for modern, easier date handling. Assumes "yyyy-MM-dd" format.
                LocalDate dueDate = LocalDate.parse(returndue, DateTimeFormatter.ISO_LOCAL_DATE);
                LocalDate today = LocalDate.now();

                long daysBetween = ChronoUnit.DAYS.between(today, dueDate);
                this.daysRemaining = (int) daysBetween;

                if (daysBetween < 0) {
                    this.status = BookStatus.OVERDUE;
                } else if (daysBetween <= 3) {
                    this.status = BookStatus.DUE_SOON;
                } else {
                    this.status = BookStatus.GOOD_STANDING;
                }

            } catch (DateTimeParseException e) {
                // Handle cases where the date format from the backend might be incorrect
                e.printStackTrace();
                this.status = BookStatus.GOOD_STANDING; // Default status on parse error
                this.daysRemaining = 0;
            }
        }

    }
