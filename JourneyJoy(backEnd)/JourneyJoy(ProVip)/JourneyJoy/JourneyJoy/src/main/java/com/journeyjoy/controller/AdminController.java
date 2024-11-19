package com.journeyjoy.controller;

import com.journeyjoy.service.UserService;
import com.journeyjoy.service.TourService;
import com.journeyjoy.service.BookingService;
import com.journeyjoy.utilities.SessionUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(value = "/admin")
public class AdminController {

    @Autowired
    UserService userService;

    @Autowired
    TourService tourService;

    @Autowired
    BookingService bookingService;

    @GetMapping("/account")
    public ResponseEntity<?> account() {
        if (!this.userService.checkAdminLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }
        return ResponseEntity.ok(SessionUtilities.getUser());
    }

    @GetMapping("/user")
    public ResponseEntity<?> userManage() {
        if (!this.userService.checkAdminLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }
        Pageable pageable = Pageable.unpaged();
        return ResponseEntity.ok(this.userService.findAllUser(null, null, null, pageable));
    }

    @GetMapping("/getUser")
    public ResponseEntity<?> getNormalUsers() {
        if (!this.userService.checkAdminLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }
        Pageable pageable = Pageable.unpaged();
        return ResponseEntity.ok(this.userService.findUsersByRole(1, pageable));
    }

    @GetMapping("/getAdmin")
    public ResponseEntity<?> getAdminUsers() {
        if (!this.userService.checkAdminLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }
        Pageable pageable = Pageable.unpaged();
        return ResponseEntity.ok(this.userService.findUsersByRole(0, pageable));
    }

    @GetMapping("/getTourGuide")
    public ResponseEntity<?> getTourGuideUsers() {
        if (!this.userService.checkAdminLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }

        Pageable pageable = Pageable.unpaged();
        return ResponseEntity.ok(this.userService.findUsersByRole(2, pageable));
    }

    @GetMapping("/tour")
    public ResponseEntity<?> tourManage() {
        if(!this.userService.checkAdminLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }
        // Get all tours
        return ResponseEntity.ok(this.tourService.findAllTourAdmin(null, null, null, null, null, null));
    }

    @GetMapping("/tour-trongnuoc")
    public ResponseEntity<?> tourTrongNuoc() {
        if (!this.userService.checkAdminLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }
        Pageable pageable = Pageable.unpaged();
        return ResponseEntity.ok(this.tourService.findAllTourTrongNuoc(pageable));
    }

    @GetMapping("/tour-ngoainuoc")
    public ResponseEntity<?> tourNgoaiNuoc() {
        if (!this.userService.checkAdminLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }
        Pageable pageable = Pageable.unpaged();
        return ResponseEntity.ok(this.tourService.findAllTourNgoaiNuoc(pageable));
    }

    @GetMapping("/booking")
    public ResponseEntity<?> bookingManager() {
        if(!this.userService.checkAdminLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }

        Pageable pageable = Pageable.unpaged();
        return ResponseEntity.ok(this.bookingService.findAllBooking(null, null, pageable));
    }

    @GetMapping("/login")
    public ResponseEntity<?> adminLogin() {
        // Implement login logic here
        return ResponseEntity.ok("Login page");
    }

    @GetMapping("/tourStart/{id}")
    public ResponseEntity<?> tourStart(@PathVariable("id")Long id) {
        if(!this.userService.checkAdminLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }
        // Get tour start data
        return ResponseEntity.ok(this.tourService.findTourById(id));
    }

    @GetMapping("/tourImage/{id}")
    public ResponseEntity<?> tourImage(@PathVariable("id") Long id) {
        if(!this.userService.checkAdminLogin()) {
            return ResponseEntity.status(403).body("Unauthorized access");
        }
        // Get tour image data
        return ResponseEntity.ok(this.tourService.findTourById(id));
    }

    @GetMapping("/logout")
    public ResponseEntity<?> adminLogout() {
        this.userService.adminLogout();
        return ResponseEntity.ok("Logged out successfully");
    }

    @PostMapping("/user/updateBanStatus/{id}")
    public ResponseEntity<Map<String, String>> updateBanStatus(@PathVariable Long id, @RequestParam boolean banned) {
        if (!userService.checkAdminLogin()) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Unauthorized access");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }

        boolean isUpdated = userService.updateBanStatus(id, banned);
        Map<String, String> response = new HashMap<>();
        if (isUpdated) {
            response.put("message", "User ban status updated successfully.");
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "User not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}