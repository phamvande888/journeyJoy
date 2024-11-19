package com.journeyjoy.repository;

import jakarta.persistence.TemporalType;
import org.springframework.data.domain.Pageable;
import java.util.Date;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Temporal;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.journeyjoy.dto.TourDTO;
import com.journeyjoy.entity.Tour;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long>,JpaSpecificationExecutor<Tour>, CrudRepository<Tour, Long> {

    @Query("SELECT SUM(b.tong_tien) FROM Booking b WHERE b.trang_thai = 1 OR b.trang_thai = 2 OR b.trang_thai = 3")
    Double calculateTotalRevenue();

    @Query("SELECT new com.journeyjoy.dto.TourDTO(t.id,t.ten_tour,t.gioi_thieu_tour,t.so_ngay,t.noi_dung_tour,t.ngay_ket_thuc,t.ngay_khoi_hanh,t.diem_den,t.loai_tour,t.anh_tour,t.diem_khoi_hanh,t.trang_thai,t.gia_tour,t.maxGuests,t.currentGuests) FROM Tour t WHERE (:loaiTour IS NULL OR t.loai_tour = :loaiTour)")
    Page<TourDTO> findAllByLoaiTour(Integer loaiTour, Pageable pageable);

    @Query("SELECT t FROM Tour t WHERE t.gia_tour BETWEEN :minPrice AND :maxPrice AND t.id <> :tourId")
    List<Tour> findRecommendedTours(Long tourId, Long minPrice, Long maxPrice);

    @Query(value= "SELECT new com.journeyjoy.dto.TourDTO(t.id,t.ten_tour,t.gioi_thieu_tour,t.so_ngay,t.noi_dung_tour,t.ngay_ket_thuc,t.ngay_khoi_hanh,t.diem_den,t.loai_tour,t.anh_tour,t.diem_khoi_hanh,t.trang_thai,t.gia_tour,t.maxGuests,t.currentGuests) FROM Tour t "
            + " WHERE (:ten_tour IS NULL OR :ten_tour='' OR t.ten_tour LIKE CONCAT('%', :ten_tour, '%'))"
            + " AND ( :loai_tour IS NULL OR t.loai_tour = :loai_tour )"
            + " AND ( :ngay_khoi_hanh IS NULL OR t.ngay_khoi_hanh = :ngay_khoi_hanh )"
            + " AND ( :gia_tour_from IS NULL OR  :gia_tour_to IS NULL OR (t.gia_tour BETWEEN :gia_tour_from AND :gia_tour_to)) AND t.trang_thai=1 "
            + " ORDER BY t.id ")
    Page<TourDTO> findAll(
            @Param("ten_tour") String ten_tour,
            @Param("gia_tour_from") Long gia_tour_from,
            @Param("gia_tour_to") Long gia_tour_to,
            @Param("ngay_khoi_hanh") @Temporal(TemporalType.DATE) Date ngay_khoi_hanh,
            @Param("loai_tour") Integer loai_tour,
            Pageable pageable
    );



    @Query(value= "SELECT new com.journeyjoy.dto.TourDTO(t.id,t.ten_tour,t.gioi_thieu_tour,t.so_ngay,t.noi_dung_tour,t.ngay_ket_thuc,t.ngay_khoi_hanh,t.diem_den,t.loai_tour,t.anh_tour,t.diem_khoi_hanh,t.trang_thai,t.gia_tour,t.maxGuests,t.currentGuests) FROM Tour t "
            + " WHERE (:ten_tour IS NULL OR :ten_tour='' OR t.ten_tour LIKE CONCAT('%', :ten_tour, '%'))"
            + " AND ( COALESCE(:loai_tour, t.loai_tour) = t.loai_tour )"
            + " AND ( COALESCE(:ngay_khoi_hanh, t.ngay_khoi_hanh) = t.ngay_khoi_hanh )"
            + " AND ( COALESCE(:gia_tour_from, t.gia_tour) <= t.gia_tour AND COALESCE(:gia_tour_to, t.gia_tour) >= t.gia_tour)  "
            + " ORDER BY t.id ")
    Page<TourDTO> findAllAdmin(
            @Param("ten_tour") String ten_tour,
            @Param("gia_tour_from") Long gia_tour_from,
            @Param("gia_tour_to") Long gia_tour_to,
            @Param("ngay_khoi_hanh") Date ngay_khoi_hanh,
            @Param("loai_tour") Integer loai_tour,
            Pageable pageable
    );

    @Query(value = "SELECT new com.journeyjoy.dto.TourDTO(t.id, t.ten_tour, t.gioi_thieu_tour, t.so_ngay, t.noi_dung_tour, t.ngay_ket_thuc, t.ngay_khoi_hanh, t.diem_den, t.loai_tour, t.anh_tour, t.diem_khoi_hanh, t.trang_thai, t.gia_tour, t.maxGuests,t.currentGuests) FROM Tour t "
            + " WHERE t.id = :id")
    TourDTO findTourById(Long id);

    @Query(value ="SELECT new com.journeyjoy.dto.TourDTO(t.id,t.ten_tour,t.gioi_thieu_tour,t.so_ngay,t.noi_dung_tour,t.ngay_ket_thuc,t.ngay_khoi_hanh,t.diem_den,t.loai_tour,t.anh_tour,t.diem_khoi_hanh,t.trang_thai,t.gia_tour,t.maxGuests,t.currentGuests) FROM Tour t "
            + " JOIN Booking b ON t.id = b.tour_id WHERE b.tour_id = :booking_id" )
    TourDTO findTourByBookingId(@Param("booking_id") Long booking_id);

    @Query("SELECT COUNT(*) > 0 FROM Booking b WHERE b.tour_id = :tourId")
    boolean existsBookingByTourId(@Param("tourId") Long tourId);

    Tour findFirstByOrderByIdDesc();

    @Query("SELECT new com.journeyjoy.dto.TourDTO(t.id, t.ten_tour, t.gioi_thieu_tour, t.so_ngay, t.noi_dung_tour, t.ngay_ket_thuc, t.ngay_khoi_hanh, t.diem_den, t.loai_tour, t.anh_tour, t.diem_khoi_hanh, t.trang_thai, t.gia_tour, t.maxGuests, t.currentGuests) " +
            "FROM Tour t WHERE unaccent(LOWER(t.ten_tour)) LIKE unaccent(LOWER(CONCAT('%', :ten_tour, '%')))")
    List<TourDTO> searchByName(@Param("ten_tour") String ten_tour);

    @Query("SELECT new com.journeyjoy.dto.TourDTO(t.id, t.ten_tour, t.gioi_thieu_tour, t.so_ngay, t.noi_dung_tour, t.ngay_ket_thuc, t.ngay_khoi_hanh, t.diem_den, t.loai_tour, t.anh_tour, t.diem_khoi_hanh, t.trang_thai, t.gia_tour, t.maxGuests, t.currentGuests) " +
            "FROM Tour t WHERE " +
            "(COALESCE(:startDate, :endDate) IS NULL OR " +
            "(t.ngay_khoi_hanh BETWEEN COALESCE(:startDate, t.ngay_khoi_hanh) AND COALESCE(:endDate, t.ngay_ket_thuc)) OR " +
            "(t.ngay_khoi_hanh >= :startDate) OR " +
            "(t.ngay_ket_thuc <= :endDate)) " +
            "AND (t.gia_tour BETWEEN COALESCE(:minPrice, 0) AND COALESCE(:maxPrice, t.gia_tour)) " +
            "AND (COALESCE(:diemDen, '') = '' OR unaccent(t.diem_den) LIKE CONCAT('%', unaccent(:diemDen), '%'))")
    List<TourDTO> findToursByFilters(@Param("startDate") @Temporal(TemporalType.DATE) Date startDate,
                                     @Param("endDate") @Temporal(TemporalType.DATE) Date endDate,
                                     @Param("minPrice") Long minPrice,
                                     @Param("maxPrice") Long maxPrice,
                                     @Param("diemDen") String diemDen);

    @Query("SELECT new com.journeyjoy.dto.TourDTO(t.id, t.ten_tour, t.gioi_thieu_tour, t.so_ngay, t.noi_dung_tour, t.ngay_ket_thuc, t.ngay_khoi_hanh, t.diem_den, t.loai_tour, t.anh_tour, t.diem_khoi_hanh, t.trang_thai, t.gia_tour, t.maxGuests, t.currentGuests) " +
            "FROM Tour t WHERE " +
            "(COALESCE(:startDate, :endDate) IS NULL OR " +
            "(t.ngay_ket_thuc BETWEEN COALESCE(:startDate, t.ngay_khoi_hanh) AND COALESCE(:endDate, t.ngay_ket_thuc)) OR " +
            "(t.ngay_khoi_hanh >= :startDate) OR " +
            "(t.ngay_ket_thuc <= :endDate)) " +
            "AND (t.gia_tour BETWEEN COALESCE(:minPrice, 0) AND COALESCE(:maxPrice, t.gia_tour)) " +
            "AND (COALESCE(:diemDen, '') = '' OR unaccent(t.diem_den) LIKE CONCAT('%', unaccent(:diemDen), '%'))")
    List<TourDTO> findToursByFiltersEnd(@Param("startDate") @Temporal(TemporalType.DATE) Date startDate,
                                        @Param("endDate") @Temporal(TemporalType.DATE) Date endDate,
                                        @Param("minPrice") Long minPrice,
                                        @Param("maxPrice") Long maxPrice,
                                        @Param("diemDen") String diemDen);

    @Query("SELECT new com.journeyjoy.dto.TourDTO(t.id, t.ten_tour, t.gioi_thieu_tour, t.so_ngay, t.noi_dung_tour, t.ngay_ket_thuc, t.ngay_khoi_hanh, t.diem_den, t.loai_tour, t.anh_tour, t.diem_khoi_hanh, t.trang_thai, t.gia_tour, t.maxGuests, t.currentGuests) " +
            "FROM Tour t WHERE " +
            "(COALESCE(:startDate, :endDate) IS NULL OR " +
            "(t.ngay_khoi_hanh BETWEEN COALESCE(:startDate, t.ngay_khoi_hanh) AND COALESCE(:endDate, t.ngay_ket_thuc)))" +
            "AND (t.ngay_ket_thuc <= COALESCE(:endDate, t.ngay_ket_thuc)) " +
            "AND (t.gia_tour BETWEEN COALESCE(:minPrice, 0) AND COALESCE(:maxPrice, t.gia_tour)) " +
            "AND (COALESCE(:diemDen, '') = '' OR unaccent(t.diem_den) LIKE CONCAT('%', unaccent(:diemDen), '%'))")
    List<TourDTO> findToursByFiltersBoth(@Param("startDate") @Temporal(TemporalType.DATE) Date startDate,
                                         @Param("endDate") @Temporal(TemporalType.DATE) Date endDate,
                                         @Param("minPrice") Long minPrice,
                                         @Param("maxPrice") Long maxPrice,
                                         @Param("diemDen") String diemDen);
}