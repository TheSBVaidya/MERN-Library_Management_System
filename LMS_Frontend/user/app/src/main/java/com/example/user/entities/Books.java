package com.example.user.entities;

import com.google.gson.annotations.SerializedName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
@ToString
public class Books {

    @SerializedName("id")
    private int id;

    @SerializedName("name")
    private String name;

    @SerializedName("author")
    private String author;

    @SerializedName("subject")
    private String subject;

    @SerializedName("price")
    private String price;

    @SerializedName("isbn")
    private String isbn;

    // from copies
    @SerializedName("availableCopies")
    private String availableCopies;

    @SerializedName("totalCopies")
    private String totalCopies;

}
