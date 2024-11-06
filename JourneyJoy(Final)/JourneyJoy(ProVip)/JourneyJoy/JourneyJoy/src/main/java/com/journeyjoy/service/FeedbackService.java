package com.journeyjoy.service;

import com.journeyjoy.dto.FeedbackDTO;
import com.journeyjoy.entity.Feedback;
import java.util.List;

public interface FeedbackService {

    List<FeedbackDTO> getAllFeedback();

    Feedback findByIdAndTourId(Long tourId, Long feedbackId);

    List<FeedbackDTO> getFeedbacksByTourId(Long tourId);

    void saveFeedback(FeedbackDTO feedbackDTO);

    void deleteFeedback(Long tourId, Long feedbackId);

    boolean updateFeedback(FeedbackDTO feedbackDTO);

    boolean replyAdmin(Long feedbackId, String adminReply);

    FeedbackDTO convertToFeedbackDTO(Feedback feedback);

    FeedbackDTO findByIdAndConvertToDTO(Long feedbackId);
}