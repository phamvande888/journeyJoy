package com.journeyjoy.repository;

import com.journeyjoy.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByTourId(Long tourId);

    Feedback findByIdAndTourId(Long tourId, Long feedbackId);

    @Query("SELECT AVG(f.rating) FROM Feedback f")
    Double calculateOverallAverageRating();
}
