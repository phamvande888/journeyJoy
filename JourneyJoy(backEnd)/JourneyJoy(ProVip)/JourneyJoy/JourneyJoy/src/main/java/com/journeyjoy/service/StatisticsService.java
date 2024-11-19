package com.journeyjoy.service;

import com.journeyjoy.dto.DailyStatisticsDTO;
import java.util.List;
import java.util.Map;

public interface StatisticsService {
    Map<String, Object> getAllTourStatistics();
    List<DailyStatisticsDTO> getDailyStatistics();
}