package com.example.user.utils;

import com.example.user.entities.Members;
import com.google.gson.annotations.SerializedName;

import lombok.Getter;

@Getter
public class BackendResponse {

    @SerializedName("status")
    private String status;

    @SerializedName("data")
    private Members membersData;

    @SerializedName("message")
    private String message;
}
