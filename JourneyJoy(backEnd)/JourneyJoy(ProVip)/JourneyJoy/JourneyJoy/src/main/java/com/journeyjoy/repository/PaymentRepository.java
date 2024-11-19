package com.journeyjoy.repository;

import com.journeyjoy.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Các phương thức tìm kiếm tùy chọn nếu cần
}
