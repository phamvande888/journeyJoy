package com.journeyjoy.entity;

import java.util.Date;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @AllArgsConstructor @Getter @Setter
@Entity
@Table(name = "booking")
public class Booking {
    public static final Integer NOT_CHECKED_IN = 0;
    public static final Integer CHECKED_IN = 1;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long user_id;

    private Long tour_id;

    private Integer so_luong_nguoi;

    private Date ngay_khoi_hanh;

    private Long tong_tien;

    private Integer trang_thai;

    private Date booking_at;

    private Integer pt_thanh_toan;

    private String ghi_chu;

    @PrePersist
    public void onCreate() {
        this.booking_at = new Date();
    }
    @Column(name = "checked_in")
    private Integer checked_in;

    public void setCheckin(Integer checked_in) {
        this.checked_in = checked_in;
    }
}