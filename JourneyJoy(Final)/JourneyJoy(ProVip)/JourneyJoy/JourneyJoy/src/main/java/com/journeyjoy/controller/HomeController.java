package com.journeyjoy.controller;

import com.journeyjoy.dto.*;
import com.journeyjoy.entity.Feedback;
import com.journeyjoy.entity.Image;
import com.journeyjoy.entity.TinTuc;
import com.journeyjoy.entity.User;
import com.journeyjoy.repository.ImageRepository;
import com.journeyjoy.repository.TourStartRepository;
import com.journeyjoy.service.*;
import com.journeyjoy.service.impl.UserServiceImpl;
import com.journeyjoy.utilities.ConvertUserToDto;
import com.journeyjoy.utilities.JwtUtil;
import com.journeyjoy.utilities.SessionUtilities;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.sql.Timestamp;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/")
public class HomeController {

    @Autowired
    public TourService tourService;

    @Autowired
    private TourStartRepository tourStartRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private BookingService bookingService;

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private TinTucService tinTucService;

    @GetMapping("")
    public ResponseEntity<List<TourDTO>> index() {
        Page<TourDTO> tourPage = this.tourService.findAllTour(null, null, null, null, null, Pageable.unpaged());
        List<TourDTO> tours = tourPage.getContent();
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/tour/trong-nuoc")
    public ResponseEntity<List<TourDTO>> tourTrongNuoc(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer pageIndex,
            @RequestParam(value = "ten_tour", required = false) String ten_tour,
            @RequestParam(value = "gia_tour", required = false) Long gia_tour,
            @RequestParam(value = "ngay_khoi_hanh", required = false) String ngay_khoi_hanh) {

        Long gia_tour_from = null;
        Long gia_tour_to = null;
        if (gia_tour != null) {
            gia_tour_from = gia_tour == 0 ? null : (gia_tour == 1 ? 0 : (gia_tour == 2 ? 10000000L : 50000000L));
            gia_tour_to = gia_tour == 0 ? null : (gia_tour == 1 ? 10000000L : (gia_tour == 2 ? 50000000L : 500000000L));
        }

        DateFormat format = new SimpleDateFormat("MM/dd/yyyy");
        Date ngay_khoi_hanh_value = null;
        try {
            ngay_khoi_hanh_value = ngay_khoi_hanh != null ? format.parse(ngay_khoi_hanh) : null;
        } catch (ParseException e) {
            e.printStackTrace();
        }

        Page<TourDTO> tourPage = this.tourService.findAllTour(ten_tour, gia_tour_from, gia_tour_to, ngay_khoi_hanh_value, 1, Pageable.unpaged());
        List<TourDTO> tours = tourPage.getContent();
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/tour/ngoai-nuoc")
    public ResponseEntity<List<TourDTO>> tourNgoaiNuoc(
            @RequestParam(value = "page", required = false, defaultValue = "1") Integer pageIndex,
            @RequestParam(value = "ten_tour", required = false) String ten_tour,
            @RequestParam(value = "gia_tour", required = false) Long gia_tour,
            @RequestParam(value = "ngay_khoi_hanh", required = false) String ngay_khoi_hanh) {

        Long gia_tour_from = null;
        Long gia_tour_to = null;
        if (gia_tour != null) {
            gia_tour_from = gia_tour == 0 ? null : (gia_tour == 1 ? 0 : (gia_tour == 2 ? 10000000L : 50000000L));
            gia_tour_to = gia_tour == 0 ? null : (gia_tour == 1 ? 10000000L : (gia_tour == 2 ? 50000000L : 500000000L));
        }

        DateFormat format = new SimpleDateFormat("MM/dd/yyyy");
        Date ngay_khoi_hanh_value = null;
        try {
            ngay_khoi_hanh_value = ngay_khoi_hanh != null ? format.parse(ngay_khoi_hanh) : null;
        } catch (ParseException e) {
            e.printStackTrace();
        }

        Page<TourDTO> tourPage = this.tourService.findAllTour(ten_tour, gia_tour_from, gia_tour_to, ngay_khoi_hanh_value, 2, Pageable.unpaged());
        List<TourDTO> tours = tourPage.getContent();
        return ResponseEntity.ok(tours);
    }

    @GetMapping("/tour/{id}")
    public ResponseEntity<?> tourDetail(@PathVariable(name = "id", required = true) Long id) {
        TourDTO tour = this.tourService.findTourById(id);
        if (tour == null) {
            return ResponseEntity.notFound().build();
        }
        List<Image> imageList = this.imageRepository.findByTourId(id);
        List<TourStartDTO> listDate = this.tourStartRepository.getDateStartByTourId(id);
        List<FeedbackDTO> listFeedback = this.feedbackService.getFeedbacksByTourId(id);
        List<RecommendedTourDTO> recommendedTours = this.tourService.findRecommendedTours(id, tour.getGia_tour());

        Integer maxGuests = tour.getMaxGuests();
        Integer currentGuests = tour.getCurrentGuests();
        return ResponseEntity.ok(new TourDetailResponse(tour, imageList, listDate, listFeedback, recommendedTours, maxGuests, currentGuests));
    }

    @PostMapping("/tour/{id}/create_feedback")
    public ResponseEntity<Map<String, String>> createFeedback(
            @PathVariable(name = "id") Long tourId,
            @RequestBody FeedbackDTO feedbackDTO) {

        Map<String, String> response = new HashMap<>();

        if (!userService.checkLogin()) {
            response.put("message", "You need to login to perform this action");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        Long userId = userService.getCurrentUserId();

        if (!tourService.hasUserAttendedTour(userId, tourId)) {
            response.put("message", "You must complete this tour to be able to give feedback!");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        feedbackDTO.setTourId(tourId);
        feedbackDTO.setUserId(userId);
        feedbackDTO.setCreatedAt(new Timestamp(System.currentTimeMillis())); // Thiết lập thời gian hiện tại dưới dạng Timestamp

        feedbackService.saveFeedback(feedbackDTO);

        response.put("message", "Feedback was created successfully");
        return ResponseEntity.ok(response);
    }


    @DeleteMapping("/tour/{tourId}/feedback/{feedbackId}")
    public ResponseEntity<Map<String, String>> deleteFeedback(@PathVariable Long tourId, @PathVariable Long feedbackId) {
        Feedback feedback = feedbackService.findByIdAndTourId(feedbackId, tourId);
        Map<String, String> response = new HashMap<>();

        if (feedback == null) {
            response.put("message", "Feedback not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        feedbackService.deleteFeedback(tourId, feedbackId);
        response.put("message", "Feedback deleted successfully");
        return ResponseEntity.ok(response);
    }


    @PutMapping("/tour/{tourId}/feedback/{feedbackId}")
    public ResponseEntity<Map<String, String>> updateFeedback(@PathVariable Long tourId, @PathVariable Long feedbackId, @RequestBody FeedbackDTO feedbackDTO) {
        Feedback existingFeedback = feedbackService.findByIdAndTourId(feedbackId, tourId);

        Map<String, String> response = new HashMap<>();

        if (existingFeedback == null) {
            response.put("message", "Feedback not found with id " + feedbackId + " for tour " + tourId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        feedbackDTO.setId(feedbackId);
        feedbackDTO.setTourId(tourId);
        boolean isUpdated = feedbackService.updateFeedback(feedbackDTO);

        if (isUpdated) {
            response.put("message", "Feedback updated successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Failed to update feedback with id " + feedbackId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginAction(@RequestBody LoginDTO login) {
        // Thực hiện đăng nhập
        if (!this.userService.login(login)) {
            // Kiểm tra nếu lỗi do tài khoản bị cấm
            User user = this.userService.findUserBySdt(login.getSdt());
            if (user != null && user.getBanned() != null && user.getBanned()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your account is banned");
            }
            // Nếu thông tin đăng nhập sai
            return ResponseEntity.badRequest().body("Incorrect account information.");
        }

        // Lấy thông tin user và token từ SessionUtilities
        UserDTO userDTO = SessionUtilities.getUser();
        String token = SessionUtilities.getToken();

        // Tạo phản hồi chứa thông tin user và token
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", userDTO);

        return ResponseEntity.ok(response);
    }


    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerAction(@RequestBody com.journeyjoy.dto.RegisterDTO user) {
        Map<String, String> response = new HashMap<>();
        if (!this.userService.register(user)) {
            response.put("message", UserServiceImpl.ErrorMessageStorage.getErrorMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
        response.put("message", "Success");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        // Hủy bỏ session hiện tại
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // Xóa thông tin người dùng và token trong SessionUtilities
        SessionUtilities.setUser(null);
        SessionUtilities.setToken(null);
        SessionUtilities.setSdt(null);

        // Tạo đối tượng phản hồi
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");

        // Trả về phản hồi dạng JSON
        return ResponseEntity.ok(response);
    }


    @GetMapping("/account")
    public ResponseEntity<?> account() {
        if (SessionUtilities.getSdt() == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }
        return ResponseEntity.ok(SessionUtilities.getUser());
        /*return ResponseEntity.ok(SessionUtilities.getAdmin());*/
    }

    @PostMapping("/changePassword")
    public ResponseEntity<?> changePasswordAction(@RequestBody ChangePasswordDTO changePasswordDTO) {
        if (changePasswordDTO.getNewPassword() != null && changePasswordDTO.getOldPassword() != null) {
            if (this.userService.changePassword(changePasswordDTO)) {
                return ResponseEntity.ok("Password changed successfully");
            }
        }
        return ResponseEntity.badRequest().body("Old password is incorrect");
    }

    @PostMapping("/updateAccount")
    public ResponseEntity<?> updateAccountAction(@RequestBody UpdateUserDTO updateUserDTO) {
        log.info("Update account: {}", updateUserDTO);

        if (userService.updateUser(updateUserDTO)) {
            // Cập nhật thành công, lấy thông tin user mới
            UserDTO updatedUser = ConvertUserToDto.convertUsertoDto(userService.findUserBySdt(updateUserDTO.getSdt()));

            // Tạo lại token mới dựa trên thông tin user đã cập nhật
            String newToken = JwtUtil.generateToken(updatedUser);

            // Cập nhật lại thông tin user trong SessionUtilities
            SessionUtilities.setUser(updatedUser);

            // Tạo phản hồi chứa thông tin user mới và token mới
            Map<String, Object> response = new HashMap<>();
            response.put("token", newToken);
            response.put("user", updatedUser);

            return ResponseEntity.ok(response);
        } else {
            // Xử lý khi cập nhật thất bại
            return ResponseEntity.badRequest().body("An error occurred while updating user information");
        }
    }


    @PostMapping("/tour/booking/{id}")
    public ResponseEntity<?> createBooking(@PathVariable("id") Long tour_id,
                                           @RequestBody CreateBookingRequest createBookingRequest) {
        Logger logger = LoggerFactory.getLogger(getClass());

        logger.info("Start creating booking for tour id: {}, number of people: {}", tour_id, createBookingRequest.getSo_nguoi());

        if (SessionUtilities.getSdt() == null) {
            logger.warn("User not logged in");
            Map<String, String> response = new HashMap<>();
            response.put("message", "Not logged in");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        TourDTO tour = this.tourService.findTourById(tour_id);
        if (tour == null) {
            logger.warn("Tour with id {} not found", tour_id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tour does not exist");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        Integer maxGuests = tour.getMaxGuests();
        logger.info("Max guests for tour id {}: {}", tour_id, maxGuests);
        if (maxGuests == null) {
            logger.warn("Max guests for tour id {} is not set", tour_id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Maximum number of guests has not been set for the tour");
            return ResponseEntity.badRequest().body(response);
        }

        int currentBookingsCount = this.bookingService.getTotalGuestsForTour(tour_id);
        if (currentBookingsCount + createBookingRequest.getSo_nguoi() > maxGuests) {
            logger.warn("Number of guests exceeds maximum limit for tour id {}", tour_id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Number of guests exceeds tour limit");
            return ResponseEntity.badRequest().body(response);
        }

        Long giaTour = tour.getGia_tour();
        if (giaTour == null) {
            logger.warn("Price for tour id {} is not valid", tour_id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tour price is invalid");
            return ResponseEntity.badRequest().body(response);
        }
        Long tongTien = giaTour * createBookingRequest.getSo_nguoi();

        DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date ngay_khoi_hanh_value;
        try {
            ngay_khoi_hanh_value = format.parse(createBookingRequest.getNgay_khoi_hanh());
        } catch (ParseException e) {
            logger.error("Invalid departure date format: {}", createBookingRequest.getNgay_khoi_hanh(), e);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Invalid departure date");
            return ResponseEntity.badRequest().body(response);
        }

        BookingDTO bookingDTO = new BookingDTO();
        bookingDTO.setSo_luong_nguoi(createBookingRequest.getSo_nguoi());
        bookingDTO.setGhi_chu(null);
        bookingDTO.setNgay_khoi_hanh(ngay_khoi_hanh_value);
        bookingDTO.setTong_tien(tongTien);
        bookingDTO.setTour_id(tour_id);
        bookingDTO.setUser_id(SessionUtilities.getUser().getId());
        bookingDTO.setTen_tour(tour.getTen_tour());

        BookingDTO savedBooking;
        try {
            savedBooking = this.bookingService.createBooking(bookingDTO);
        } catch (Exception e) {
            logger.error("Error occurred while creating booking: {}", e.getMessage(), e);
            Map<String, String> response = new HashMap<>();
            response.put("message", "An error occurred while creating a booking");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }

        if (savedBooking == null) {
            logger.error("Booking creation failed");
            Map<String, String> response = new HashMap<>();
            response.put("message", "Cannot create booking");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        int updatedCurrentGuests = currentBookingsCount;
        this.tourService.updateCurrentGuests(tour_id, updatedCurrentGuests);
        logger.info("Booking created successfully: {}", savedBooking);
        return ResponseEntity.ok(savedBooking);
    }


    @PostMapping("/booking/update/{booking_id}")
    public ResponseEntity<?> updateBooking(@PathVariable("booking_id") Long booking_id,
                                           @RequestBody UpdateBookingRequest updateRequest) {
        Logger logger = LoggerFactory.getLogger(getClass());
        if (!this.userService.checkLogin()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Not logged in");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        BookingDTO bookingDTO = this.bookingService.getBookingById(booking_id);
        if (bookingDTO == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Booking does not exist");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        TourDTO tour = this.tourService.findTourById(bookingDTO.getTour_id());
        if (tour == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tour does not exist");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        // Kiểm tra số lượng khách cập nhật có vượt quá giới hạn không
        int maxGuests = tour.getMaxGuests();
        int currentBookingsCount = this.bookingService.getTotalGuestsForTour(bookingDTO.getTour_id());
        int existingBookingGuests = bookingDTO.getSo_luong_nguoi();
        if (updateRequest.getSo_luong_nguoi() > maxGuests) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Number of guests exceeds tour limit");
            return ResponseEntity.badRequest().body(response);
        }

        bookingDTO.setSo_luong_nguoi(updateRequest.getSo_luong_nguoi());
        bookingDTO.setGhi_chu(updateRequest.getGhi_chu());
        bookingDTO.setPt_thanh_toan(updateRequest.getPt_thanh_toan());

        Long giaTour = tour.getGia_tour();
        if (giaTour == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Tour price is invalid");
            return ResponseEntity.badRequest().body(response);
        }

        Long tongTien = giaTour * updateRequest.getSo_luong_nguoi();
        bookingDTO.setTong_tien(tongTien);

        BookingDTO updatedBooking = this.bookingService.updateBooking(bookingDTO);
        if (updatedBooking == null) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "An error occurred while updating the booking");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
        if (updateRequest.getPt_thanh_toan() == 1) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Your reservation can be held for 24 hours, please pay at the cashier");
            return ResponseEntity.ok(response);
        }
        // Cập nhật số người hiện tại trong tour sau khi cập nhật booking thành công
        int updatedCurrentGuests = currentBookingsCount + updateRequest.getSo_luong_nguoi();
        this.tourService.updateCurrentGuests(bookingDTO.getTour_id(), updatedCurrentGuests);

        return ResponseEntity.ok(updatedBooking);
    }

    @GetMapping("/user/StartDate/{id}")
    public ResponseDTO getAllStartDateForUser(@PathVariable("id") Long id) {

        if(!this.userService.checkLogin()) {
            return new ResponseDTO("You need to login to perform this action", null);
        }

        return new ResponseDTO("Success", this.tourStartRepository.getDateStartByTourId(id));
    }

    private static class TourDetailResponse {
        public TourDTO tour;
        public List<Image> images;
        public List<TourStartDTO> tourStartDates;
        public List<FeedbackDTO> feedbacks;
        public List<RecommendedTourDTO> recommendedTours;
        public Integer maxGuests;
        public Integer currentGuests;

        public TourDetailResponse(TourDTO tour, List<Image> images, List<TourStartDTO> tourStartDates, List<FeedbackDTO> feedbacks, List<RecommendedTourDTO> recommendedTours, Integer maxGuests, Integer currentGuests) {
            this.tour = tour;
            this.images = images;
            this.tourStartDates = tourStartDates;
            this.feedbacks = feedbacks;
            this.recommendedTours = recommendedTours;
            this.maxGuests = maxGuests;
            this.currentGuests = currentGuests;
        }
    }

    @GetMapping("/user/bookings")
    public ResponseEntity<?> getUserBookings() {
        if (!this.userService.checkLogin()) {
            return ResponseEntity.status(401).body("Not logged in");
        }
        Long userId = SessionUtilities.getUser().getId();
        List<BookingDTO> bookings = this.bookingService.findBookingByUserId(userId);

        // Lấy và thiết lập hình ảnh của tour cho mỗi booking
        for (BookingDTO booking : bookings) {
            TourDTO tour = this.tourService.findTourById(booking.getTour_id());
            if (tour != null) {
                booking.setTourImage(tour.getAnh_tour());
            }
        }

        return ResponseEntity.ok(bookings);
    }

    // Method to cancel a booking
    @PostMapping("/cancel/{id}")
    public ResponseDTO cancelBooking(@PathVariable Long id) {
        if (!this.userService.checkLogin()) {
            return new ResponseDTO("Not logged in", null);
        }

        if (id == null) {
            return new ResponseDTO("Booking ID cannot be blank", null);
        }

        BookingDTO bookingDTO = this.bookingService.getBookingById(id);

        if (bookingDTO == null) {
            return new ResponseDTO("Booking does not exist", null);
        }

        // Assuming status 4 is for cancelled bookings
        if (bookingDTO.getTrang_thai() == 0 || bookingDTO.getTrang_thai() == 1) {
            this.bookingService.approveBooking(id, 4); // Update the status to cancelled
            return new ResponseDTO("Booking cancelled successfully", null);
        } else {
            return new ResponseDTO("Booking was previously cancelled", null);
        }
    }

    // Method to get booking details
    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getBookingDetail(@PathVariable Long id) {
        if (!this.userService.checkLogin()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Not logged in");
        }

        BookingDTO bookingDTO = this.bookingService.getBookingById(id);

        if (bookingDTO == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking does not exist");
        }

        return ResponseEntity.ok(bookingDTO);
    }

    @DeleteMapping("/deleteBooking/{id}")
    public ResponseDTO deleteBooking(@PathVariable("id") Long id) {

        if(!this.userService.checkLogin()) {
            return new ResponseDTO("Not logged in", null);
        }

        if(this.bookingService.deleteBooking(id)) {
            return new ResponseDTO("Cancellation successful", null);
        }

        // Since you want to remove the last condition, we'll not handle the failure explicitly
        // Assuming any failure in deletion is handled inside `deleteBooking` method of the service
        return new ResponseDTO("Cancellation failed. Please try again", null);
    }

    @Autowired
    private WishlistService wishlistService;

    @PostMapping("/wishlist/add")
    public ResponseEntity<Map<String, String>> addToWishlist(@RequestBody WishlistRequest request) {
        Map<String, String> response = new HashMap<>();

        if (SessionUtilities.getSdt() == null) {
            response.put("message", "Not logged in");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        if (request.getUserId() == null || request.getTourId() == null) {
            response.put("message", "User ID and Tour ID must not be null.");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            // Check if the tour already exists in the wishlist
            List<TourDTO> wishlist = wishlistService.getWishlistByUser(request.getUserId());
            boolean tourExists = wishlist.stream().anyMatch(tour -> tour.getId().equals(request.getTourId()));

            if (tourExists) {
                response.put("message", "The tour already exists");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }

            boolean added = wishlistService.addToWishlist(request.getUserId(), request.getTourId());
            if (added) {
                response.put("message", "Item added to wishlist successfully.");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Item could not be added to wishlist.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
        } catch (Exception e) {
            response.put("message", "An error occurred while processing your request.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @GetMapping("/wishlist/user/{userId}")
    public ResponseEntity<?> getWishlistByUser(@PathVariable Long userId) {
        Map<String, String> response = new HashMap<>();

        if (SessionUtilities.getSdt() == null) {
            response.put("message", "Not logged in");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        List<TourDTO> wishlist = wishlistService.getWishlistByUser(userId);
        if (wishlist.isEmpty()) {
            response.put("message", "Wishlist is empty");
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
        }

        return ResponseEntity.ok(wishlist);
    }


    @DeleteMapping("/wishlist/remove")
    public ResponseEntity<Map<String, String>> removeFromWishlist(@RequestBody WishlistRequest request) {
        Map<String, String> response = new HashMap<>();

        if (SessionUtilities.getSdt() == null) {
            response.put("message", "Not logged in");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        if (request.getUserId() == null || request.getTourId() == null) {
            response.put("message", "User ID and Tour ID must not be null.");
            return ResponseEntity.badRequest().body(response);
        }
        try {
            boolean removed = wishlistService.removeFromWishlist(request.getUserId(), request.getTourId());
            if (removed) {
                response.put("message", "Tour removed from wishlist successfully.");
                return ResponseEntity.ok(response);
            } else {
                response.put("message", "Wishlist entry not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            response.put("message", "An error occurred while processing your request.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @PostMapping("/search")
    public ResponseEntity<List<TourDTO>> searchToursByName(@RequestBody SearchRequestDTO searchRequest) {
        List<TourDTO> tours = tourService.searchToursByName(searchRequest.getTen_tour());
        return ResponseEntity.ok(tours);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        boolean result = userService.forgotPassword(request.getEmail());
        Map<String, String> response = new HashMap<>();
        if (result) {
            response.put("message", "A new password has been sent to your email! Please login again with the new password.");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Email not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }


    @GetMapping("/getAllTintuc")
    public ResponseDTO getAllPage() {
        List<TinTuc> tinTucList = this.tinTucService.getAllPage(Pageable.unpaged()).getContent();
        return new ResponseDTO("Success", tinTucList);
    }

    @GetMapping("/tintuc/{id}")
    public ResponseDTO getOnePage(@PathVariable("id") Long id) {
        return new ResponseDTO("Success", this.tinTucService.findOnePage(id));
    }
}
