package com.journeyjoy.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
public class BookingDetailDTO {

    private Long id;

    private Long user_id;

    private String ho_ten;

    private String sdt;

    private Long tour_id;

    private String ten_tour;

    private Integer so_luong_nguoi;

    private Date ngay_khoi_hanh;

    private Long tong_tien;

    private Integer trang_thai;

    private Integer pt_thanh_toan;

    private String ghi_chu;

    private Date booking_at;

    public BookingDetailDTO(Long id, Long user_id,String ho_ten,String sdt, Long tour_id, String ten_tour, Integer so_luong_nguoi, Date ngay_khoi_hanh, Long tong_tien, Integer trang_thai, Integer pt_thanh_toan, String ghi_chu, Date booking_at) {
        this.id = id;
        this.user_id = user_id;
        this.tour_id = tour_id;
        this.ho_ten= ho_ten;
        this.sdt = sdt;
        this.ten_tour = ten_tour;
        this.so_luong_nguoi = so_luong_nguoi;
        this.ngay_khoi_hanh = ngay_khoi_hanh;
        this.tong_tien = tong_tien;
        this.trang_thai = trang_thai;
        this.pt_thanh_toan = pt_thanh_toan;
        this.ghi_chu = ghi_chu;
        this.booking_at = booking_at;
    }
}