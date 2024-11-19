package com.journeyjoy.repository;

import com.journeyjoy.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(Long userId);
    List<Wishlist> findByUserIdAndTourId(Long userId, Long tourId);
}