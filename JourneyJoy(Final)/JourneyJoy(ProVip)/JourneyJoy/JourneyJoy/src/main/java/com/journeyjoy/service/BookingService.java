package com.journeyjoy.service;

import java.util.List;
import com.journeyjoy.dto.BookingDetailDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.journeyjoy.dto.BookingDTO;

public interface BookingService {

    Page<BookingDTO> findAllBooking(Integer trang_thai,String ten_tour,Pageable pageable);

    List<BookingDTO> findBookingByUserId(Long userId);

    Page<BookingDTO> findBookingByTourId(Long tour_Id,Pageable pageable);

    BookingDTO createBooking(BookingDTO bookingDTO); // New method

    boolean approveBooking(Long bookingId,Integer trang_thai);

    boolean deleteBooking(Long id);

    BookingDTO getBookingById(Long id);

    boolean checkinBooking(Long bookingId, Integer checked_in);

    BookingDetailDTO getBookingDetailById(Long id);

    void updateBookingStatus(Long id, int trangThai);

    BookingDTO updateBooking(BookingDTO bookingDTO);

    int getTotalGuestsForTour(Long tourId);
}