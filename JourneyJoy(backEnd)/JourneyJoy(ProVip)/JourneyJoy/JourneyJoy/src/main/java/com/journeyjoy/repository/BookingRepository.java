package com.journeyjoy.repository;

import com.journeyjoy.dto.BookingDetailDTO;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.journeyjoy.dto.BookingDTO;
import com.journeyjoy.entity.Booking;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>{

    @Query("SELECT COUNT(b) FROM Booking b")
    long countAllBookings();

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.trang_thai IN :statuses")
    long countBookingsWithStatusIn(List<Integer> statuses);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.trang_thai = :status")
    long countBookingsWithStatus(int status);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.trang_thai <> :trangThai")
    Long countBookingsWithStatusNot(@Param("trangThai") Integer trangThai);

    @Query(value = "SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END FROM booking WHERE user_id = :userId AND tour_id = :tourId AND trang_thai = 3", nativeQuery = true)
    boolean existsByUserIdAndTourIdAndTrangThai(@Param("userId") Long userId, @Param("tourId") Long tourId);

    @Query(value = "SELECT new com.journeyjoy.dto.BookingDTO(b.id,b.user_id,b.tour_id,t.ten_tour,b.so_luong_nguoi,b.ngay_khoi_hanh,b.tong_tien,b.trang_thai,b.pt_thanh_toan,b.ghi_chu,b.booking_at, b.checked_in ) "
            + " FROM Booking b JOIN Tour t ON b.tour_id = t.id  "
            + " WHERE ( :trang_thai IS NULL OR b.trang_thai = :trang_thai ) "
            + " AND ( :ten_tour IS NULL OR :ten_tour = '' OR t.ten_tour LIKE %:ten_tour% ) "
            + " ORDER BY b.id ")
    public Page<BookingDTO> findAllBooking(@Param("trang_thai") Integer trang_thai,@Param("ten_tour") String ten_tour,Pageable pageable);
    @Query(value = "SELECT new com.journeyjoy.dto.BookingDTO(b.id,b.user_id,b.tour_id,t.ten_tour,b.so_luong_nguoi,b.ngay_khoi_hanh,b.tong_tien,b.trang_thai,b.pt_thanh_toan,b.ghi_chu,b.booking_at, b.checked_in ) "
            + " FROM Booking  b JOIN User u ON b.user_id = u.id JOIN Tour t ON b.tour_id = t.id  WHERE b.user_id = :userId")
    List<BookingDTO> findBookingByUserId(@Param("userId")Long userId);


    @Query(value = "SELECT new com.journeyjoy.dto.BookingDTO(b.id,b.user_id,b.tour_id,t.ten_tour,b.so_luong_nguoi,b.ngay_khoi_hanh,b.tong_tien,b.trang_thai,b.pt_thanh_toan,b.ghi_chu,b.booking_at, b.checked_in ) "
            + " FROM Booking  b JOIN User u ON b.user_id = u.id JOIN Tour t ON b.tour_id = t.id  WHERE b.user_id = :userId ")
    List<BookingDTO> checkBookingByUserId(@Param("userId")Long userId);

    @Query(value = "SELECT new com.journeyjoy.dto.BookingDTO(b.id,b.user_id,b.tour_id,t.ten_tour,b.so_luong_nguoi,b.ngay_khoi_hanh,b.tong_tien,b.trang_thai,b.pt_thanh_toan,b.ghi_chu,b.booking_at, b.checked_in ) "
            + " FROM Booking  b  JOIN Tour t ON b.tour_id = t.id  WHERE b.tour_id = :tour_id")
    Page<BookingDTO> findBookingByTourId(@Param("tour_id") Long tour_id,Pageable pageable);

    @Query(value = "SELECT new com.journeyjoy.dto.BookingDTO(b.id,b.user_id,b.tour_id,t.ten_tour,b.so_luong_nguoi,b.ngay_khoi_hanh,b.tong_tien,b.trang_thai,b.pt_thanh_toan,b.ghi_chu,b.booking_at, b.checked_in ) "
            + " FROM Booking  b  JOIN Tour t ON b.tour_id = t.id  WHERE b.id = :id")
    BookingDTO findBookingById(@Param("id") Long id);

    @Query(value = "SELECT new com.journeyjoy.dto.BookingDetailDTO(b.id,b.user_id,u.ho_ten,u.sdt,b.tour_id,t.ten_tour,b.so_luong_nguoi,b.ngay_khoi_hanh,b.tong_tien,b.trang_thai,b.pt_thanh_toan,b.ghi_chu,b.booking_at) "
            + " FROM Booking  b  JOIN Tour t ON b.tour_id = t.id JOIN User u ON b.user_id = u.id WHERE b.id = :id")
    BookingDetailDTO findBookingDetailById(@Param("id") Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Booking b SET b.trang_thai = :trangThai WHERE b.id = :id")
    void updateBookingStatus(@Param("id") Long id, @Param("trangThai") int trangThai);
    @Query("SELECT SUM(b.so_luong_nguoi) FROM Booking b WHERE b.tour_id = :tourId and b.trang_thai = 1")
    Integer sumSoLuongNguoiByTourId(@Param("tourId") Long tourId);
}