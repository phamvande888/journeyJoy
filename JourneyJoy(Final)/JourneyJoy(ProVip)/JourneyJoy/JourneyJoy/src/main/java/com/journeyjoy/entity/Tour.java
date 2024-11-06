package com.journeyjoy.entity;

import java.util.Date;
import jakarta.persistence.*;
import org.springframework.format.annotation.DateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @AllArgsConstructor @Getter @Setter
@Entity
@Table(name = "tour")
public class Tour {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String ten_tour;

    private String gioi_thieu_tour;

    private Integer so_ngay;

    private String noi_dung_tour;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date ngay_khoi_hanh;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date ngay_ket_thuc;

    private String diem_den;

    private Integer loai_tour;

    private String anh_tour;

    private String diem_khoi_hanh;

    private Integer trang_thai;

    private Long gia_tour;

    @Column(name = "max_guests")
    private Integer maxGuests;

    @Column(name = "current_guests")
    private Integer currentGuests;
}
