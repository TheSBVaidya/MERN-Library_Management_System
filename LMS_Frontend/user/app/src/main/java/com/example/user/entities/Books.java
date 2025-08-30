package com.example.user.entities;

import com.google.gson.annotations.SerializedName;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@RequiredArgsConstructor
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
}
