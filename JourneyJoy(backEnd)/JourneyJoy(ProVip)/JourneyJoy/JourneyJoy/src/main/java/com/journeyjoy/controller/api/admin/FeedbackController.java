package com.journeyjoy.controller.api.admin;

import com.journeyjoy.dto.FeedbackDTO;
import com.journeyjoy.service.FeedbackService;
import com.journeyjoy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/feedback")
public class FeedbackController {

    @Autowired
    private UserService userService;

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/allFeedback")
    public ResponseEntity<?> getAllFeedback() {
        if (!userService.checkAdminLogin()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Only admins can view feedback.");
        }
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }

    @PostMapping("{feedbackId}/reply")
    public ResponseEntity<Map<String, Object>> replyFeedback(@PathVariable Long feedbackId, @RequestBody Map<String, String> requestBody) {
        Map<String, Object> response = new HashMap<>();

        if (!userService.checkAdminLogin()) {
            response.put("success", false);
            response.put("message", "Only admins can reply to feedback.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        FeedbackDTO existingFeedbackDTO = feedbackService.findByIdAndConvertToDTO(feedbackId);
        if (existingFeedbackDTO == null) {
            response.put("success", false);
            response.put("message", "Feedback not found with id " + feedbackId + " for tour");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        String replyContent = requestBody.get("adminReply");
        existingFeedbackDTO.setAdminReply(replyContent);

        // Set thời gian hiện tại với Timestamp và loại bỏ phần nhỏ hơn giây
        Timestamp now = Timestamp.valueOf(LocalDateTime.now().withNano(0));
        existingFeedbackDTO.setAdminReplyCreatedAt(now);

        boolean isUpdated = feedbackService.updateFeedback(existingFeedbackDTO);

        if (isUpdated) {
            response.put("success", true);
            response.put("message", "Reply added successfully to feedback with id " + feedbackId);
        } else {
            response.put("success", false);
            response.put("message", "Failed to add reply to feedback with id " + feedbackId);
        }

        return ResponseEntity.ok(response);
    }


    @PutMapping("{feedbackId}/editReply")
    public ResponseEntity<Map<String, Object>> editReply(@PathVariable Long feedbackId, @RequestBody Map<String, String> requestBody) {
        Map<String, Object> response = new HashMap<>();

        if (!userService.checkAdminLogin()) {
            response.put("success", false);
            response.put("message", "You are not an Admin?");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        FeedbackDTO existingFeedbackDTO = feedbackService.findByIdAndConvertToDTO(feedbackId);
        if (existingFeedbackDTO == null) {
            response.put("success", false);
            response.put("message", "Feedback not found with id " + feedbackId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        String replyContent = requestBody.get("adminReply");
        existingFeedbackDTO.setAdminReply(replyContent);

        boolean isUpdated = feedbackService.updateFeedback(existingFeedbackDTO);

        if (isUpdated) {
            response.put("success", true);
            response.put("message", "Reply updated successfully for feedback with id " + feedbackId);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Failed to update reply for feedback with id " + feedbackId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }


    @DeleteMapping("{feedbackId}/deleteReply")
    public ResponseEntity<Map<String, String>> deleteReply(@PathVariable Long feedbackId) {
        Map<String, String> response = new HashMap<>();

        if (!userService.checkAdminLogin()) {
            response.put("message", "You are not an Admin?");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        FeedbackDTO existingFeedbackDTO = feedbackService.findByIdAndConvertToDTO(feedbackId);
        if (existingFeedbackDTO == null) {
            response.put("message", "Feedback not found with id " + feedbackId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }

        existingFeedbackDTO.setAdminReply(null);
        existingFeedbackDTO.setAdminReplyCreatedAt(null);

        boolean isUpdated = feedbackService.updateFeedback(existingFeedbackDTO);

        if (isUpdated) {
            response.put("message", "Reply deleted successfully for feedback with id " + feedbackId);
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Failed to delete reply for feedback with id " + feedbackId);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
