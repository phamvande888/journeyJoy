package com.journeyjoy.service.impl;

import java.util.List;
import java.util.Optional;
import com.journeyjoy.entity.Discount;
import com.journeyjoy.repository.DiscountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.journeyjoy.dto.BookingDTO;
import com.journeyjoy.dto.BookingDetailDTO;
import com.journeyjoy.dto.TourDTO;
import com.journeyjoy.entity.Booking;
import com.journeyjoy.repository.BookingRepository;
import com.journeyjoy.repository.TourRepository;
import com.journeyjoy.service.BookingService;

@Service
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private DiscountRepository discountRepository;

    @Override
    public Page<BookingDTO> findAllBooking(Integer trang_thai, String ten_tour, Pageable pageable) {
        return this.bookingRepository.findAllBooking(trang_thai, ten_tour, pageable);
    }

    @Override
    public List<BookingDTO> findBookingByUserId(Long userId) {
        return this.bookingRepository.findBookingByUserId(userId);
    }

    @Override
    public Page<BookingDTO> findBookingByTourId(Long tour_Id, Pageable pageable) {
        return this.bookingRepository.findBookingByTourId(tour_Id, pageable);
    }


    @Override
    public boolean approveBooking(Long bookingId, Integer trang_thai) {
        Optional<Booking> booking = this.bookingRepository.findById(bookingId);

        if (booking.isPresent()) {
            Booking bookingUpdated = booking.get();
            bookingUpdated.setTrang_thai(trang_thai);
            this.bookingRepository.save(bookingUpdated);
            return true;
        }

        return false;
    }

    @Override
    public boolean checkinBooking(Long bookingId, Integer checked_in) {
        Optional<Booking> booking = this.bookingRepository.findById(bookingId);
        if (booking.isPresent()) {
            Booking bookingUpdated = booking.get();
            bookingUpdated.setCheckin(checked_in);
            if (checked_in == 1) {
                bookingUpdated.setTrang_thai(2);
            } else if (checked_in == 0) {
                bookingUpdated.setTrang_thai(3);
            }
            this.bookingRepository.save(bookingUpdated);

            // Fetch the updated booking from the database
            Optional<Booking> updatedBooking = this.bookingRepository.findById(bookingId);
            if (updatedBooking.isPresent()) {
                // If the updated booking's checkin status matches the new status, return true
                return updatedBooking.get().getChecked_in().equals(checked_in);
            }
        }
        return false;
    }

    @Override
    public boolean deleteBooking(Long id) {
        Optional<Booking> bookingOptional = this.bookingRepository.findById(id);
        if (bookingOptional.isPresent()) {
            this.bookingRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public BookingDTO getBookingById(Long id) {
        return this.bookingRepository.findBookingById(id);
    }

    @Override
    public BookingDetailDTO getBookingDetailById(Long id) {
        return this.bookingRepository.findBookingDetailById(id);
    }

    @Override
    public BookingDTO createBooking(BookingDTO bookingDTO) {

        // Retrieve tour information based on bookingDTO.getTour_id()
        TourDTO tourDTO = this.tourRepository.findTourById(bookingDTO.getTour_id());
        if (tourDTO == null) {

            return null; // or throw an exception
        }

        // Calculate total price based on number of people and tour price
        long totalPrice = tourDTO.getGia_tour() * bookingDTO.getSo_luong_nguoi();

        // Fetch the appropriate discount based on the number of people
        List<Discount> discounts = discountRepository.findDiscountsByPeople(bookingDTO.getSo_luong_nguoi());
        double discountRate = discounts.isEmpty() ? 0.0 : discounts.get(0).getDiscountRate();

        // Calculate discount amount
        double discountAmount = totalPrice * discountRate;

        // Subtract discount from total and round to Long
        totalPrice -= Math.round(discountAmount);

        // Create a new Booking entity
        Booking booking = new Booking();
        booking.setSo_luong_nguoi(bookingDTO.getSo_luong_nguoi());
        booking.setNgay_khoi_hanh(bookingDTO.getNgay_khoi_hanh());
        booking.setTong_tien(totalPrice);
        booking.setTour_id(bookingDTO.getTour_id());
        booking.setUser_id(bookingDTO.getUser_id());
        booking.setGhi_chu(bookingDTO.getGhi_chu());
        booking.setPt_thanh_toan(bookingDTO.getPt_thanh_toan());
        booking.setTrang_thai(0); // Assuming initial status is 0

        Booking savedBooking = this.bookingRepository.save(booking);

        BookingDTO savedBookingDTO = new BookingDTO();
        savedBookingDTO.setId(savedBooking.getId());
        savedBookingDTO.setSo_luong_nguoi(savedBooking.getSo_luong_nguoi());
        savedBookingDTO.setNgay_khoi_hanh(savedBooking.getNgay_khoi_hanh());
        savedBookingDTO.setTong_tien(savedBooking.getTong_tien());
        savedBookingDTO.setTour_id(savedBooking.getTour_id());
        savedBookingDTO.setUser_id(savedBooking.getUser_id());
        savedBookingDTO.setGhi_chu(savedBooking.getGhi_chu());
        savedBookingDTO.setPt_thanh_toan(savedBooking.getPt_thanh_toan());
        savedBookingDTO.setTrang_thai(savedBooking.getTrang_thai());
        savedBookingDTO.setChecked_in(savedBooking.getChecked_in());

        return savedBookingDTO;
    }

    private BookingDTO convertBookingToDto(Booking booking) {
        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setId(booking.getId());
        bookingDTO.setSo_luong_nguoi(booking.getSo_luong_nguoi());
        bookingDTO.setNgay_khoi_hanh(booking.getNgay_khoi_hanh());
        bookingDTO.setTong_tien(booking.getTong_tien());
        bookingDTO.setTour_id(booking.getTour_id());
        bookingDTO.setUser_id(booking.getUser_id());
        bookingDTO.setGhi_chu(booking.getGhi_chu());
        bookingDTO.setPt_thanh_toan(booking.getPt_thanh_toan());
        bookingDTO.setTrang_thai(booking.getTrang_thai());
        bookingDTO.setChecked_in(booking.getChecked_in());
        return bookingDTO;
    }

    @Override
    public void updateBookingStatus(Long id, int trangThai) {
        bookingRepository.updateBookingStatus(id, trangThai);
    }

    @Override
    public BookingDTO updateBooking(BookingDTO bookingDTO) {
        Optional<Booking> existingBookingOpt = bookingRepository.findById(bookingDTO.getId());
        if (!existingBookingOpt.isPresent()) {
            return null; // Hoặc throw exception
        }

        Booking existingBooking = existingBookingOpt.get();

        // Cập nhật thông tin
        existingBooking.setSo_luong_nguoi(bookingDTO.getSo_luong_nguoi());
        existingBooking.setGhi_chu(bookingDTO.getGhi_chu());
        existingBooking.setNgay_khoi_hanh(bookingDTO.getNgay_khoi_hanh());
        existingBooking.setPt_thanh_toan(bookingDTO.getPt_thanh_toan());

        // Tính lại tổng tiền
        TourDTO tour = this.tourRepository.findTourById(bookingDTO.getTour_id());
        long totalPrice = tour.getGia_tour() * bookingDTO.getSo_luong_nguoi();

        // Fetch the appropriate discount based on the number of people
        List<Discount> discounts = discountRepository.findDiscountsByPeople(bookingDTO.getSo_luong_nguoi());
        double discountRate = discounts.isEmpty() ? 0.0 : discounts.get(0).getDiscountRate();

        // Calculate discount amount
        double discountAmount = totalPrice * discountRate;

        // Subtract discount from total and round to Long
        totalPrice -= Math.round(discountAmount);

        existingBooking.setTong_tien(totalPrice);

        Booking updatedBooking = bookingRepository.save(existingBooking);
        return convertBookingToDto(updatedBooking);
    }

    @Override
    public int getTotalGuestsForTour(Long tourId) {
        Integer totalGuests = bookingRepository.sumSoLuongNguoiByTourId(tourId);
        return (totalGuests != null) ? totalGuests : 0;
    }
}
