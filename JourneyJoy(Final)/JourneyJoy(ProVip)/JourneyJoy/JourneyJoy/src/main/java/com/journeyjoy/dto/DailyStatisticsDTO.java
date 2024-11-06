package com.journeyjoy.dto;

import lombok.Getter;
import lombok.Setter;

import java.text.DecimalFormat;

@Getter @Setter
public class DailyStatisticsDTO {
    private String formattedDate;
    private long totalBookings;
    private long unpaidBookingsCount;
    private long paidBookingsCount;
    private long cancelledBookingsCount;
    private String formattedTotalRevenue;

    public DailyStatisticsDTO(String formattedDate, long totalBookings, long unpaidBookingsCount,
                              long paidBookingsCount, long cancelledBookingsCount, double totalRevenue) {
        this.formattedDate = formattedDate;
        this.totalBookings = totalBookings;
        this.unpaidBookingsCount = unpaidBookingsCount;
        this.paidBookingsCount = paidBookingsCount;
        this.cancelledBookingsCount = cancelledBookingsCount;
        this.formattedTotalRevenue = formatTotalRevenue(totalRevenue);
    }

    private String formatTotalRevenue(double totalRevenue) {
        DecimalFormat formatter = new DecimalFormat("#,###");
        return formatter.format(totalRevenue);
    }

}
