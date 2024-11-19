package com.journeyjoy.controller.api.admin;

import com.journeyjoy.dto.LoginDTO;
import com.journeyjoy.dto.ResponseDTO;
import com.journeyjoy.dto.UserDTO;
import com.journeyjoy.service.BookingService;
import com.journeyjoy.service.TourService;
import com.journeyjoy.service.UserService;
import com.journeyjoy.utilities.SessionUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/tourguide")
public class TourGuideController {

    @Autowired
    private UserService userService;

    @Autowired
    private TourService tourService;

    @Autowired
    private BookingService bookingService;

    @GetMapping("/account")
    public ResponseEntity<?> account() {
        if (SessionUtilities.getSdt() == null) {
            return ResponseEntity.status(401).body("Chưa đăng nhập");
        }
        return ResponseEntity.ok(SessionUtilities.getTourGuide());
    }

    @PostMapping("/login")
    public ResponseEntity<?> tourGuideLogin(@RequestBody LoginDTO loginDTO) {
        if (userService.tourGuideLogin(loginDTO)) {
            UserDTO tourGuide = SessionUtilities.getTourGuide();
            String token = SessionUtilities.getToken();
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", tourGuide);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized access");
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?> tourGuideLogout() {
        userService.tourGuideLogout();
        return ResponseEntity.ok("Logged out successfully");
    }


    @GetMapping("/bookings")
    public ResponseEntity<?> getBookings() {
        if(!userService.checkTourGuideLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }
        return ResponseEntity.ok(this.tourService.findAllTourAdmin(null, null, null, null, null, null));
    }

    @GetMapping("/tour/{tourId}/bookings")
    public ResponseEntity<?> getBookingsForTour(@PathVariable("tourId") Long tourId, Pageable pageable) {
        if (!userService.checkTourGuideLogin()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Unauthorized access");
            return ResponseEntity.status(403).body(response);
        }
        try {
            return ResponseEntity.ok(bookingService.findBookingByTourId(tourId, pageable));
        } catch (RuntimeException e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/booking/{bookingId}/user")
    public ResponseDTO getUserInfoByBookingId(@PathVariable("bookingId") Long bookingId) {
        // Kiểm tra xem người dùng đã đăng nhập là tour guide chưa
        if (!userService.checkTourGuideLogin()) {
            return new ResponseDTO("Unauthorized access", null);
        }

        try {
            // Lấy thông tin user từ bookingId
            UserDTO userDTO = userService.getUserByBookingId(bookingId);
            if (userDTO != null) {
                return new ResponseDTO("Success", userDTO);
            } else {
                return new ResponseDTO("User not found", null);
            }
        } catch (Exception e) {
            return new ResponseDTO("Error: " + e.getMessage(), null);
        }
    }

    @GetMapping("/contactAdmin")
    public ResponseDTO getAllAdmins() {
        if (!userService.checkTourGuideLogin()) {
            return new ResponseDTO("Not have access", null);
        }

        List<UserDTO> admins = userService.findAllAdmins();
        return new ResponseDTO("Success", admins);
    }
}