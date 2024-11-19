package com.journeyjoy.service.impl;

import com.journeyjoy.dto.TourDTO;
import com.journeyjoy.entity.Tour;
import com.journeyjoy.entity.User;
import com.journeyjoy.entity.Wishlist;
import com.journeyjoy.repository.TourRepository;
import com.journeyjoy.repository.UserRepository;
import com.journeyjoy.repository.WishlistRepository;
import com.journeyjoy.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TourRepository tourRepository;

    @Override
    public boolean addToWishlist(Long userId, Long tourId) {
        User user = userRepository.findById(userId).orElse(null);
        Tour tour = tourRepository.findById(tourId).orElse(null);
        if (user != null && tour != null) {
            Wishlist wishlist = new Wishlist();
            wishlist.setUser(user);
            wishlist.setTour(tour);
            wishlistRepository.save(wishlist);
            return true;
        }
        return false;
    }


    @Override
    public List<TourDTO> getWishlistByUser(Long userId) {
        List<Wishlist> wishlists = wishlistRepository.findByUserId(userId);
        return wishlists.stream().map(wishlist -> {
            Tour tour = wishlist.getTour();
            TourDTO dto = new TourDTO();
            dto.setId(tour.getId());
            dto.setTen_tour(tour.getTen_tour());
            dto.setGioi_thieu_tour(tour.getGioi_thieu_tour());
            dto.setSo_ngay(tour.getSo_ngay());
            dto.setNoi_dung_tour(tour.getNoi_dung_tour());
            dto.setNgay_ket_thuc(tour.getNgay_ket_thuc());
            dto.setNgay_khoi_hanh(tour.getNgay_khoi_hanh());
            dto.setDiem_den(tour.getDiem_den());
            dto.setLoai_tour(tour.getLoai_tour());
            dto.setAnh_tour(tour.getAnh_tour());
            dto.setDiem_khoi_hanh(tour.getDiem_khoi_hanh());
            dto.setTrang_thai(tour.getTrang_thai());
            dto.setGia_tour(tour.getGia_tour());
            return dto;
        }).collect(Collectors.toList());
    }

    @Override
    public boolean removeFromWishlist(Long userId, Long tourId) {
        List<Wishlist> wishlists = wishlistRepository.findByUserIdAndTourId(userId, tourId);
        if (!wishlists.isEmpty()) {
            wishlistRepository.deleteAll(wishlists);
            return true;
        }
        return false;
    }
}