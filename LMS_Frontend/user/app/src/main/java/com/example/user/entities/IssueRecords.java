package com.example.user.entities;

import com.google.gson.annotations.SerializedName;
import java.util.Date;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@RequiredArgsConstructor
@AllArgsConstructor
public class IssueRecords {

    @SerializedName("id")
    private int id;

    @SerializedName("copy_id")
    private int copy_id;

    @SerializedName("member_id")
    private int member_id;

    @SerializedName("issued")
    private Date issued;

    @SerializedName("returned")
    private Date returned;

    @SerializedName("returndue")
    private Date returndue;
}
