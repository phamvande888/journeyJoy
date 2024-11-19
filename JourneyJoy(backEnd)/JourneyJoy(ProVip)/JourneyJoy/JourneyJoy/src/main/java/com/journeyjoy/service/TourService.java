package com.journeyjoy.service;

import java.util.Date;
import java.util.List;
import com.journeyjoy.dto.RecommendedTourDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.journeyjoy.dto.TourDTO;
import com.journeyjoy.entity.Tour;

public interface TourService {

    Page<TourDTO> findAllTour(String ten_tour,Long gia_tour_from,Long gia_tour_to,Date ngay_khoi_hanh,Integer loai_tour,Pageable pageable);

    Page<TourDTO> findAllTourAdmin(String ten_tour,Long gia_tour_from,Long gia_tour_to,Date ngay_khoi_hanh,Integer loai_tour,Pageable pageable);

    TourDTO findTourById(Long id);

    boolean saveTour(Tour tour);

    Tour findFirstByOrderByIdDesc();

    Tour addTour(TourDTO tourDTO);

    Tour updateTour(TourDTO newTour,Long id);

    boolean deleteTour(Long id);

    Page<TourDTO> findAllTourTrongNuoc(Pageable pageable);

    Page<TourDTO> findAllTourNgoaiNuoc(Pageable pageable);

    boolean hasUserAttendedTour(Long userId, Long tourId);

    List<RecommendedTourDTO> findRecommendedTours(Long tourId, Long giaTour);

    List<TourDTO> searchToursByName(String ten_tour);

    List<TourDTO> findToursByFilters(Date startDate, Date endDate, Long minPrice, Long maxPrice, String diemDen);

    void updateCurrentGuests(Long tourId, int newCurrentGuests);
}
