package com.journeyjoy.service;

import com.journeyjoy.entity.TinTuc;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TinTucService {
    Page<TinTuc> getAllPage(Pageable pageable);
    TinTuc findOnePage(Long id);
    void deleteOnePage(Long id);
    TinTuc createOnePage(TinTuc newTinTuc);
    TinTuc updateTinTuc(TinTuc updateTinTuc, Long id);
}
