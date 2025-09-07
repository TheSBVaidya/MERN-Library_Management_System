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
public class Copies {

    @SerializedName("id")
    private int id;

    @SerializedName("book_id")
    private int book_id;

    @SerializedName("rack")
    private String rack;

    @SerializedName("status")
    private String status;
}
