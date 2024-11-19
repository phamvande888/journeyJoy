package com.journeyjoy.dto;

import lombok.Getter;
import lombok.Setter;
import java.sql.Timestamp;

@Getter @Setter
public class FeedbackDTO {
    private Long id;
    private Long tourId;
    private String tenTour;
    private Long userId;
    private String hoTen;
    private Integer rating;
    private String comment;
    private Timestamp createdAt;  // Thay đổi từ LocalDateTime thành Timestamp
    private String adminReply;
    private Timestamp adminReplyCreatedAt;  // Thay đổi từ LocalDateTime thành Timestamp
    public FeedbackDTO() {}

    public FeedbackDTO(Long id, Long tourId, String tenTour, Long userId, String hoTen, Integer rating, String comment, Timestamp createdAt, String adminReply, Timestamp adminReplyCreatedAt) {
        this.id = id;
        this.tourId = tourId;
        this.tenTour = tenTour;
        this.userId = userId;
        this.hoTen = hoTen;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
        this.adminReply = adminReply;
        this.adminReplyCreatedAt = adminReplyCreatedAt;
    }

}
