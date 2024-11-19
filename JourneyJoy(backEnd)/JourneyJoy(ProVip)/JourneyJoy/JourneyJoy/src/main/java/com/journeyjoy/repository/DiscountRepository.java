package com.journeyjoy.repository;

import com.journeyjoy.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface DiscountRepository extends JpaRepository<Discount, Long> {
    @Query("SELECT d FROM Discount d WHERE d.minPeople <= :people ORDER BY d.minPeople DESC")
    List<Discount> findDiscountsByPeople(@Param("people") int people);
}
