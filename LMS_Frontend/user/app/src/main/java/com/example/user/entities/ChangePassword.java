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
public class ChangePassword {

    @SerializedName("currentPassword")
    String currPassword;

    @SerializedName("newPassword")
    String newPassword;
}
