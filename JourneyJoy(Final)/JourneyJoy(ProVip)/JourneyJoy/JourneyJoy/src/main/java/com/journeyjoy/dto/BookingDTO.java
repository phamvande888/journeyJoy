package com.journeyjoy.dto;

import java.util.Date;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class BookingDTO {

    private String tourImage;

    private Long id;

    private Long user_id; // New field

    private Long tour_id; // New field

    private String ten_tour;

    private Integer so_luong_nguoi;

    private Date ngay_khoi_hanh;

    private Long tong_tien;

    private Integer trang_thai;

    private Integer pt_thanh_toan;

    private String ghi_chu;

    private Date booking_at;

    private Integer checked_in;

    public BookingDTO(Long id, Long user_id, Long tour_id, String ten_tour, Integer so_luong_nguoi, Date ngay_khoi_hanh, Long tong_tien, Integer trang_thai, Integer pt_thanh_toan, String ghi_chu, Date booking_at,Integer checked_in) {
        this.id = id;
        this.user_id = user_id;
        this.tour_id = tour_id;
        this.ten_tour = ten_tour;
        this.so_luong_nguoi = so_luong_nguoi;
        this.ngay_khoi_hanh = ngay_khoi_hanh;
        this.tong_tien = tong_tien;
        this.trang_thai = trang_thai;
        this.pt_thanh_toan = pt_thanh_toan;
        this.ghi_chu = ghi_chu;
        this.booking_at = booking_at;
        this.checked_in= checked_in;
    }

}