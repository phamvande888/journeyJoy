package com.journeyjoy.controller.api.admin;

import com.journeyjoy.dto.ResponseDTO;
import com.journeyjoy.entity.TinTuc;
import com.journeyjoy.service.TinTucService;
import com.journeyjoy.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/tintuc")
public class TinTucController {

    @Autowired
    private TinTucService tinTucService;

    @Autowired
    private UserService userService;

    @GetMapping("/getAllPage")
    public ResponseDTO getAllPage() {
        List<TinTuc> tinTucList = this.tinTucService.getAllPage(Pageable.unpaged()).getContent();
        return new ResponseDTO("Success", tinTucList);
    }


    @GetMapping("/{id}")
    public ResponseDTO getOnePage(@PathVariable("id") Long id) {

        return new ResponseDTO("Success",this.tinTucService.findOnePage(id));

    }

    @PostMapping("/add")
    public ResponseEntity<?> addNewTintuc(@RequestBody TinTuc tinTuc) {
        if (!userService.checkAdminLogin()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Only admins can add news.");
        }
        try {
            // Lưu thông tin của tin tức vào cơ sở dữ liệu
            // (Lưu ý: Hình ảnh ở đây là URL được cung cấp từ frontend)
            return ResponseEntity.ok(new ResponseDTO("Success", this.tinTucService.createOnePage(tinTuc)));
        } catch (Exception e) {
            // Xử lý exception
            log.info("Lỗi khi lưu tin tức: {}", e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("Fail", null));
    }

    @PutMapping(value = "/update/{id}")
    public ResponseEntity<?> updateOneTinTuc(@PathVariable("id") Long id, @RequestBody TinTuc tinTuc) {
        if (!userService.checkAdminLogin()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Only admins can update news.");
        }
        try {
            // Cập nhật thông tin của tin tức vào cơ sở dữ liệu
            // (Lưu ý: Hình ảnh ở đây là URL được cung cấp từ frontend)
            return ResponseEntity.ok(new ResponseDTO("Success", this.tinTucService.updateTinTuc(tinTuc, id)));
        } catch (Exception e) {
            // Xử lý exception
            log.info("Lỗi khi cập nhật tin tức: {}", e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("Update failed", null));
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteOneTinTuc(@PathVariable("id") Long id) {
        if (!userService.checkAdminLogin()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Only admins can delete news.");
        }
        try {
            // Gọi service để xóa tin tức
            this.tinTucService.deleteOnePage(id);
            return ResponseEntity.ok(new ResponseDTO("Success", null));
        } catch (Exception e) {
            // Xử lý exception
            log.info("Lỗi khi xóa tin tức: {}", e.getMessage());
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ResponseDTO("Delete failed", null));
    }

}
