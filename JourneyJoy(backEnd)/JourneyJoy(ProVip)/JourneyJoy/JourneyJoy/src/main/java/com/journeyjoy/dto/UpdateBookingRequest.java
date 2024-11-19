package com.journeyjoy.dto;

public class UpdateBookingRequest {

    private Integer so_luong_nguoi;
    private String ghi_chu;
    private Integer pt_thanh_toan;

    // Getters and Setters
    public Integer getSo_luong_nguoi() {
        return so_luong_nguoi;
    }

    public void setSo_luong_nguoi(Integer so_luong_nguoi) {
        this.so_luong_nguoi = so_luong_nguoi;
    }

    public String getGhi_chu() {
        return ghi_chu;
    }

    public void setGhi_chu(String ghi_chu) {
        this.ghi_chu = ghi_chu;
    }

    public Integer getPt_thanh_toan() {
        return pt_thanh_toan;
    }

    public void setPt_thanh_toan(Integer pt_thanh_toan) {
        this.pt_thanh_toan = pt_thanh_toan;
    }
}