package com.journeyjoy.service.impl;

import com.journeyjoy.entity.TinTuc;
import com.journeyjoy.repository.TinTucRepository;
import com.journeyjoy.service.TinTucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class TinTucServiceImpl implements TinTucService {

    @Autowired
    private TinTucRepository tinTucRepository;

    @Override
    public Page<TinTuc> getAllPage(Pageable pageable) {
        return this.tinTucRepository.findAll(pageable);
    }

    @Override
    public TinTuc findOnePage(Long id) {
        return this.tinTucRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteOnePage(Long id) {
        this.tinTucRepository.deleteById(id);
    }

    @Override
    public TinTuc createOnePage(TinTuc newTinTuc) {
        if(this.tinTucRepository.checkExistTieuDe(newTinTuc.getTieu_de())) {
            return null;
        }
        return this.tinTucRepository.save(newTinTuc);
    }

    @Override
    public TinTuc updateTinTuc(TinTuc updateTinTuc, Long id) {
        TinTuc tintuc = this.tinTucRepository.findById(id).orElse(null);

        if(tintuc == null) {
            return null;
        }

        tintuc.setHinh_anh(updateTinTuc.getHinh_anh());
        tintuc.setNgay_dang(updateTinTuc.getNgay_dang());
        tintuc.setTom_tat(updateTinTuc.getTom_tat());
        tintuc.setTieu_de(updateTinTuc.getTieu_de());
        tintuc.setNoi_dung(updateTinTuc.getNoi_dung());

        return this.tinTucRepository.save(tintuc);
    }
}
