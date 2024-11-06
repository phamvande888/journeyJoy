package com.journeyjoy.service.impl;

import java.util.*;
import com.journeyjoy.dto.RecommendedTourDTO;
import com.journeyjoy.repository.BookingRepository;
import com.journeyjoy.utilities.StringUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.journeyjoy.dto.TourDTO;
import com.journeyjoy.entity.Tour;
import com.journeyjoy.repository.TourRepository;
import com.journeyjoy.service.TourService;

@Slf4j
@Service
public class TourServiceImpl implements TourService {

    @Autowired
    private TourRepository tourRepository;

    @Autowired
    private BookingRepository bookingRepository;


    @Override
    public Page<TourDTO> findAllTour(String ten_tour,Long gia_tour_from,Long gia_tour_to,Date ngay_khoi_hanh,Integer loai_tour,Pageable pageable) {
        Page<TourDTO> page = this.tourRepository.findAll(ten_tour, gia_tour_from, gia_tour_to,ngay_khoi_hanh, loai_tour, pageable);
        return page;
    }

    @Override
    public Page<TourDTO> findAllTourAdmin(String ten_tour,Long gia_tour_from,Long gia_tour_to,Date ngay_khoi_hanh,Integer loai_tour,Pageable pageable) {
        Page<TourDTO> page = this.tourRepository.findAllAdmin(ten_tour, gia_tour_from, gia_tour_to,ngay_khoi_hanh, loai_tour, pageable);
        return page;
    }

    @Override
    public TourDTO findTourById(Long id) {
        TourDTO tourDTO = this.tourRepository.findTourById(id);

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(tourDTO.getNgay_khoi_hanh());
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        tourDTO.setNgay_khoi_hanh(calendar.getTime());


        calendar.setTime(tourDTO.getNgay_ket_thuc());
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        tourDTO.setNgay_ket_thuc(calendar.getTime());

        if(tourDTO!=null) {
            return tourDTO;
        }
        return null;
    }

    @Override
    public boolean saveTour(Tour tour) {
        if(this.tourRepository.save(tour) != null) {
            return true;
        }
        return false;
    }

    @Override
    public Tour findFirstByOrderByIdDesc() {
        return this.tourRepository.findFirstByOrderByIdDesc();
    }

    @Override
    public Tour addTour(TourDTO tourDTO) {

        Tour tour = new Tour();
        tour.setTen_tour(tourDTO.getTen_tour());
        tour.setAnh_tour(tourDTO.getAnh_tour());
        tour.setLoai_tour(tourDTO.getLoai_tour());
        tour.setGia_tour(tourDTO.getGia_tour());
        tour.setGioi_thieu_tour(tourDTO.getGioi_thieu_tour());
        tour.setDiem_den(tourDTO.getDiem_den());
        tour.setNoi_dung_tour(tourDTO.getNoi_dung_tour());
        tour.setDiem_khoi_hanh(tourDTO.getDiem_khoi_hanh());
        tour.setNgay_khoi_hanh(tourDTO.getNgay_khoi_hanh());
        tour.setSo_ngay(tourDTO.getSo_ngay());
        tour.setTrang_thai(tourDTO.getTrang_thai());
        tour.setNgay_ket_thuc(tourDTO.getNgay_ket_thuc());

        return this.tourRepository.save(tour);
    }

    @Override
    public Tour updateTour(TourDTO newTour, Long id) {
        Optional<Tour> tourOptional = this.tourRepository.findById(id);

        if (tourOptional.isPresent()) {
            Tour updatedTour = tourOptional.get();

            // Cập nhật các trường thông tin của tour
            updatedTour.setTen_tour(newTour.getTen_tour());
            updatedTour.setLoai_tour(newTour.getLoai_tour());
            updatedTour.setGia_tour(newTour.getGia_tour());
            updatedTour.setGioi_thieu_tour(newTour.getGioi_thieu_tour());

            // Cập nhật ảnh chỉ khi có ảnh mới
            if (newTour.getAnh_tour() != null && !newTour.getAnh_tour().isEmpty()) {
                updatedTour.setAnh_tour(newTour.getAnh_tour());
            }

            updatedTour.setDiem_den(newTour.getDiem_den());
            updatedTour.setNoi_dung_tour(newTour.getNoi_dung_tour());
            updatedTour.setDiem_khoi_hanh(newTour.getDiem_khoi_hanh());
            updatedTour.setNgay_khoi_hanh(newTour.getNgay_khoi_hanh());
            updatedTour.setSo_ngay(newTour.getSo_ngay());
            updatedTour.setTrang_thai(newTour.getTrang_thai());
            updatedTour.setNgay_ket_thuc(newTour.getNgay_ket_thuc());

            // Lưu thông tin cập nhật vào cơ sở dữ liệu
            Tour savedTour = this.tourRepository.save(updatedTour);
            log.info("Tour cập nhật thành công với ID: {}", id);
            return savedTour;
        }

        log.warn("Không tìm thấy tour với ID: {}", id);
        return null;
    }


    @Override
    public boolean deleteTour(Long id) {
        Optional<Tour> tour = this.tourRepository.findById(id);
        if(tour.isPresent()) {
            if(this.tourRepository.existsBookingByTourId(id)==false) {
                this.tourRepository.deleteById(id);
                return true;
            }
        }
        return false;
    }

    @Override
    public Page<TourDTO> findAllTourTrongNuoc(Pageable pageable) {
        return tourRepository.findAllByLoaiTour(1, pageable);
    }

    @Override
    public Page<TourDTO> findAllTourNgoaiNuoc(Pageable pageable) {
        return tourRepository.findAllByLoaiTour(2, pageable);
    }

    @Override
    public boolean hasUserAttendedTour(Long userId, Long tourId) {
        return bookingRepository.existsByUserIdAndTourIdAndTrangThai(userId, tourId);
    }

    @Override
    public List<RecommendedTourDTO> findRecommendedTours(Long tourId, Long giaTour) {
        // Giả sử bạn cần tìm các tour có giá chênh lệch khoảng 500 nghìn đồng
        Long lowerPriceBound = giaTour - 5000000;
        Long upperPriceBound = giaTour + 5000000;

        // Gọi phương thức từ repository để lấy danh sách các tour đề xuất
        List<Tour> recommendedTours = this.tourRepository.findRecommendedTours(tourId, lowerPriceBound, upperPriceBound);

        // Chuyển đổi danh sách các tour thành đối tượng RecommendedTourDTO
        List<RecommendedTourDTO> recommendedTourDTOs = new ArrayList<>();
        for (Tour tour : recommendedTours) {
            recommendedTourDTOs.add(new RecommendedTourDTO(tour.getId(), tour.getTen_tour(), tour.getGia_tour(), tour.getAnh_tour()));
        }

        return recommendedTourDTOs;
    }

    @Override
    public List<TourDTO> searchToursByName(String ten_tour) {
        return tourRepository.searchByName(ten_tour);
    }

    @Override
    public List<TourDTO> findToursByFilters(Date startDate, Date endDate, Long minPrice, Long maxPrice, String diemDen) {
        if (diemDen != null && !diemDen.isEmpty()) {
            diemDen = StringUtil.toTitleCase(diemDen);
        }
        if(maxPrice == null){
            maxPrice = Long.MAX_VALUE;
        }
        if(minPrice == null){
            minPrice = 0L;
        }
        if(startDate == null && endDate != null){
            return this.tourRepository.findToursByFiltersEnd(startDate, endDate, minPrice, maxPrice, diemDen);
        }
        if(startDate != null && endDate != null){
            return this.tourRepository.findToursByFiltersBoth(startDate, endDate, minPrice, maxPrice, diemDen);
        }
        return this.tourRepository.findToursByFilters(startDate, endDate, minPrice, maxPrice, diemDen);
    }

    @Override
    public void updateCurrentGuests(Long tourId, int newCurrentGuests) {
        Optional<Tour> tourOpt = tourRepository.findById(tourId);
        if (tourOpt.isPresent()) {
            Tour tour = tourOpt.get();
            tour.setCurrentGuests(newCurrentGuests);
            tourRepository.save(tour);
        }
    }
}
