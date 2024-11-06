package com.journeyjoy.service;

import com.journeyjoy.dto.TourDTO;
import java.util.List;

public interface WishlistService {
    boolean addToWishlist(Long userId, Long tourId);
    boolean removeFromWishlist(Long userId, Long tourId);
    List<TourDTO> getWishlistByUser(Long userId);
}