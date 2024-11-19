package com.journeyjoy.dto;

public class CreateBookingRequest {
    private String ngay_khoi_hanh;
    private Integer so_nguoi;

    // Getters and setters
    public String getNgay_khoi_hanh() {
        return ngay_khoi_hanh;
    }

    public void setNgay_khoi_hanh(String ngay_khoi_hanh) {
        this.ngay_khoi_hanh = ngay_khoi_hanh;
    }

    public Integer getSo_nguoi() {
        return so_nguoi;
    }

    public void setSo_nguoi(Integer so_nguoi) {
        this.so_nguoi = so_nguoi;
    }
}