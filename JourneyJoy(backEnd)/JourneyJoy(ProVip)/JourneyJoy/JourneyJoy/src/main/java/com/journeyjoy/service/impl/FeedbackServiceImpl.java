package com.journeyjoy.service.impl;

import com.journeyjoy.dto.FeedbackDTO;
import com.journeyjoy.entity.Feedback;
import com.journeyjoy.entity.Tour;
import com.journeyjoy.entity.User;
import com.journeyjoy.repository.FeedbackRepository;
import com.journeyjoy.repository.TourRepository;
import com.journeyjoy.repository.UserRepository;
import com.journeyjoy.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourRepository tourRepository;

    @Override
    public List<FeedbackDTO> getAllFeedback() {
        List<Feedback> feedbacks = feedbackRepository.findAll();
        List<FeedbackDTO> feedbackDTOs = new ArrayList<>();

        for (Feedback feedback : feedbacks) {
            User user = userRepository.findById(feedback.getUserId()).orElse(null);
            String hoTen = (user != null) ? user.getHo_ten() : "Unknown";

            Tour tour = tourRepository.findById(feedback.getTourId()).orElse(null);
            String tenTour = (tour != null) ? tour.getTen_tour() : "Unknown";

            FeedbackDTO feedbackDTO = new FeedbackDTO(
                    feedback.getId(),
                    feedback.getTourId(),
                    tenTour,
                    feedback.getUserId(),
                    hoTen,
                    feedback.getRating(),
                    feedback.getComment(),
                    feedback.getCreatedAt(), // LocalDateTime
                    feedback.getAdminReply(),
                    feedback.getAdminReplyCreatedAt() // LocalDateTime
            );
            feedbackDTOs.add(feedbackDTO);
        }

        return feedbackDTOs;
    }

    @Override
    public Feedback findByIdAndTourId(Long tourId, Long feedbackId) {

        return feedbackRepository.findByIdAndTourId(tourId, feedbackId);
    }

    @Override
    public List<FeedbackDTO> getFeedbacksByTourId(Long tourId) {
        List<Feedback> feedbacks = feedbackRepository.findByTourId(tourId);
        List<FeedbackDTO> feedbackDTOs = new ArrayList<>();
        for (Feedback feedback : feedbacks) {
            User user = userRepository.findById(feedback.getUserId()).orElse(null);
            Tour tour = tourRepository.findById(feedback.getTourId()).orElse(null);
            String tenTour = (tour != null) ? tour.getTen_tour() : "Unknown";
            String hoTen = (user != null) ? user.getHo_ten() : "Unknown";
            FeedbackDTO feedbackDTO = new FeedbackDTO(
                    feedback.getId(),
                    feedback.getTourId(),
                    tenTour,
                    feedback.getUserId(),
                    hoTen,
                    feedback.getRating(),
                    feedback.getComment(),
                    feedback.getCreatedAt(),
                    feedback.getAdminReply(),
                    feedback.getAdminReplyCreatedAt()
            );
            feedbackDTOs.add(feedbackDTO);
        }
        return feedbackDTOs;
    }


    @Override
    public void saveFeedback(FeedbackDTO feedbackDTO) {
        Feedback feedback = new Feedback();
        feedback.setTourId(feedbackDTO.getTourId());
        feedback.setUserId(feedbackDTO.getUserId());
        feedback.setRating(feedbackDTO.getRating());
        feedback.setComment(feedbackDTO.getComment());

        // Sử dụng Timestamp trực tiếp
        Timestamp createdAt = feedbackDTO.getCreatedAt() != null
                ? feedbackDTO.getCreatedAt()
                : new Timestamp(System.currentTimeMillis());

        feedback.setCreatedAt(createdAt);

        feedbackRepository.save(feedback);
    }


    @Override
    public void deleteFeedback(Long tourId, Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId).orElseThrow(() -> new RuntimeException("Feedback not found"));
        feedbackRepository.delete(feedback);
    }

    @Override
    public boolean updateFeedback(FeedbackDTO feedbackDTO) {
        Optional<Feedback> optionalFeedback = feedbackRepository.findById(feedbackDTO.getId());

        if (optionalFeedback.isPresent()) {
            Feedback feedback = optionalFeedback.get();

            if (feedbackDTO.getRating() != null) {
                feedback.setRating(feedbackDTO.getRating());
            }
            if (feedbackDTO.getComment() != null) {
                feedback.setComment(feedbackDTO.getComment());
            }
            feedback.setAdminReply(feedbackDTO.getAdminReply());
            feedback.setAdminReplyCreatedAt(feedbackDTO.getAdminReplyCreatedAt());


            feedbackRepository.save(feedback);
            return true;
        }

        return false;
    }


    @Override
    @Transactional
    public boolean replyAdmin(Long feedbackId, String adminReply) {
        Optional<Feedback> optionalFeedback = feedbackRepository.findById(feedbackId);
        if (optionalFeedback.isPresent()) {
            Feedback feedback = optionalFeedback.get();

            // Update admin reply fields
            feedback.setAdminReply(adminReply);

            // Cập nhật thời gian phản hồi bằng Timestamp
            Timestamp now = Timestamp.valueOf(LocalDateTime.now().withNano(0));
            feedback.setAdminReplyCreatedAt(now);

            // Lưu lại thông tin vào cơ sở dữ liệu
            feedbackRepository.save(feedback);

            return true;
        }
        return false;
    }

    @Override
    public FeedbackDTO convertToFeedbackDTO(Feedback feedback) {
        FeedbackDTO feedbackDTO = new FeedbackDTO();
        feedbackDTO.setId(feedback.getId());
        feedbackDTO.setTourId(feedback.getTourId());
        feedbackDTO.setUserId(feedback.getUserId());
        feedbackDTO.setRating(feedback.getRating());
        feedbackDTO.setComment(feedback.getComment());
        feedbackDTO.setCreatedAt(feedback.getCreatedAt());
        feedbackDTO.setAdminReply(feedback.getAdminReply());
        feedbackDTO.setAdminReplyCreatedAt(feedback.getAdminReplyCreatedAt());
        return feedbackDTO;
    }

    @Override
    public FeedbackDTO findByIdAndConvertToDTO(Long feedbackId) {
        Optional<Feedback> optionalFeedback = feedbackRepository.findById(feedbackId);
        if (optionalFeedback.isPresent()) {
            Feedback feedback = optionalFeedback.get();
            return convertToFeedbackDTO(feedback);
        }
        return null; // or throw NotFoundException or handle as needed
    }

}

