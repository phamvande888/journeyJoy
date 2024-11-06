package com.journeyjoy.controller.api.admin;

import com.journeyjoy.dto.DailyStatisticsDTO;
import com.journeyjoy.service.StatisticsService;
import com.journeyjoy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private UserService userService;

    @GetMapping("/statistics")
    public ResponseEntity<?> getAllTourStatistics() {
        if (!userService.checkAdminLogin()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Only admins can view statistics.");
        }
        Map<String, Object> allStatistics = statisticsService.getAllTourStatistics();
        return ResponseEntity.ok(allStatistics);
    }

    @GetMapping("/statistics/daily")
    public ResponseEntity<List<DailyStatisticsDTO>> getDailyStatistics() {
        if (!userService.checkAdminLogin()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        List<DailyStatisticsDTO> dailyStatistics = statisticsService.getDailyStatistics();
        return ResponseEntity.ok(dailyStatistics);
    }

}