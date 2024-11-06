package com.journeyjoy.service.impl;

import com.journeyjoy.dto.DailyStatisticsDTO;
import com.journeyjoy.entity.Booking;
import com.journeyjoy.repository.BookingRepository;
import com.journeyjoy.repository.FeedbackRepository;
import com.journeyjoy.repository.TourRepository;
import com.journeyjoy.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class StatisticsServiceImpl implements StatisticsService {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private BookingRepository bookingRepository;

    private static final DecimalFormat currencyFormat = new DecimalFormat("#,###");

    @Override
    public Map<String, Object> getAllTourStatistics() {
        Map<String, Object> allStatistics = new LinkedHashMap<>();

        // Tổng số booking đã được đặt
        long totalToursBooked = bookingRepository.countAllBookings();
        allStatistics.put("totalToursBooked", totalToursBooked);

        // Tổng số booking chưa thanh toán (trạng thái = 0)
        long pendingBookingsCount = bookingRepository.countBookingsWithStatus(0);
        allStatistics.put("pendingBookingsCount", pendingBookingsCount);
        // Số phần trăm booking chưa thanh toán (trạng thái = 0)
        double pendingBookingsPercentage = (totalToursBooked > 0) ? (double) pendingBookingsCount / totalToursBooked * 100 : 0.0;
        allStatistics.put("pendingBookingsPercentage", pendingBookingsPercentage);

        // Tổng số tour đã được hoàn thành (trạng thái = 1,2,3)
        long completedBookingsCount = bookingRepository.countBookingsWithStatusIn(Arrays.asList(1, 2, 3));
        allStatistics.put("completedBookingsCount", completedBookingsCount);
        // Số phần trăm tour đã được hoàn thành (trạng thái = 1,2,3)
        double completedBookingsPercentage = (totalToursBooked > 0) ? (double) completedBookingsCount / totalToursBooked * 100 : 0.0;
        allStatistics.put("completedBookingsPercentage", completedBookingsPercentage);

        // Tổng số booking đã bị huỷ (trạng thái = 4)
        long cancelledBookingsCount = bookingRepository.countBookingsWithStatus(4);
        allStatistics.put("cancelledBookingsCount", cancelledBookingsCount);
        // Số phần trăm booking đã bị huỷ (trạng thái = 4)
        double cancelledBookingsPercentage = (totalToursBooked > 0) ? (double) cancelledBookingsCount / totalToursBooked * 100 : 0.0;
        allStatistics.put("cancelledBookingsPercentage", cancelledBookingsPercentage);

        // Tổng số tiền kiếm được từ tất cả các tour đã được đặt
        Double totalRevenue = tourRepository.calculateTotalRevenue();
        String formattedRevenue = totalRevenue != null ? currencyFormat.format(totalRevenue) : "0.00";
        allStatistics.put("totalRevenue", formattedRevenue);

        // Tổng đánh giá trung bình của tất cả các tour
        Double overallAverageRating = feedbackRepository.calculateOverallAverageRating();

        if (overallAverageRating != null) {
            BigDecimal bd = new BigDecimal(overallAverageRating).setScale(2, RoundingMode.HALF_UP);
            allStatistics.put("overallAverageRating", bd.doubleValue());
        } else {
            allStatistics.put("overallAverageRating", 0.0);
        }

        return allStatistics;
    }

    @Override
    public List<DailyStatisticsDTO> getDailyStatistics() {
        List<Booking> bookings = bookingRepository.findAll();

        Map<String, List<Booking>> bookingsByDate = bookings.stream()
                .collect(Collectors.groupingBy(booking -> {
                    SimpleDateFormat dateFormatter = new SimpleDateFormat("MM-dd-yyyy");
                    return dateFormatter.format(booking.getBooking_at());
                }));

        return bookingsByDate.entrySet().stream()
                .map(entry -> {
                    String date = entry.getKey();
                    List<Booking> dailyBookings = entry.getValue();

                    long totalBookings = dailyBookings.size();

                    long unpaidBookingsCount = dailyBookings.stream()
                            .filter(booking -> booking.getTrang_thai() == 0)
                            .count();

                    long paidBookingsCount = dailyBookings.stream()
                            .filter(booking -> booking.getTrang_thai() == 1 || booking.getTrang_thai() == 2 || booking.getTrang_thai() == 3)
                            .count();

                    long cancelledBookingsCount = dailyBookings.stream()
                            .filter(booking -> booking.getTrang_thai() == 4)
                            .count();

                    double totalRevenue = dailyBookings.stream()
                            .filter(booking -> booking.getTrang_thai() == 1 || booking.getTrang_thai() == 2 || booking.getTrang_thai() == 3)
                            .mapToDouble(Booking::getTong_tien)
                            .sum();

                    return new DailyStatisticsDTO(date, totalBookings, unpaidBookingsCount, paidBookingsCount, cancelledBookingsCount, totalRevenue);
                })
                .collect(Collectors.toList());
    }

}