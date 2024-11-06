package com.journeyjoy.repository;

import com.journeyjoy.entity.TinTuc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TinTucRepository extends JpaRepository<TinTuc,Long> {
    @Query(value = "SELECT t FROM TinTuc t ORDER BY t.ngay_dang DESC ")
    public Page<TinTuc> findAllPage(Pageable pageable);

    @Query("SELECT t FROM TinTuc t WHERE t.id=:id")
    public TinTuc findOnePage(@Param("id") Long id);

    @Query(value = "SELECT COUNT(*)>0 FROM TinTuc t WHERE t.tieu_de=:tieu_de")
    public boolean checkExistTieuDe(@Param("tieu_de") String tieu_de);
}
