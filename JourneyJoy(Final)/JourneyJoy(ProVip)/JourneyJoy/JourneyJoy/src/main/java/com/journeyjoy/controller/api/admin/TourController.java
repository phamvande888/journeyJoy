package com.journeyjoy.controller.api.admin;

import com.journeyjoy.dto.*;
import com.journeyjoy.entity.Tour;
import com.journeyjoy.entity.TourStart;
import com.journeyjoy.repository.TourStartRepository;
import com.journeyjoy.service.ImageService;
import com.journeyjoy.service.TourService;
import com.journeyjoy.service.UserService;
import com.journeyjoy.utilities.FileUploadUtil;
import jakarta.servlet.annotation.MultipartConfig;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.*;

@Slf4j
@RestController
@MultipartConfig // Thêm annotation này
@RequestMapping("/api/tour")
public class TourController {

    private final Logger logger = LoggerFactory.getLogger(TourController.class);


    @Autowired
    private TourService tourService;

    @Autowired
    private TourStartRepository tourStartRepository;

    @Autowired
    private ImageService imageService;

    @Autowired
    private UserService userService;

    @GetMapping("/getAllTour")
    public ResponseDTO getAllTour(@RequestParam(value="ten_tour",required = false) String ten_tour,
                                  @RequestParam(value="gia_tour_from",required = false) Long gia_tour_from,
                                  @RequestParam(value="gia_tour_to",required = false) Long gia_tour_to,
                                  @RequestParam(value="ngay_khoi_hanh",required = false) Date ngay_khoi_hanh,
                                  @RequestParam(value="loai_tour",required = false) Integer loai_tour,
                                  @RequestParam(value = "pageSize",defaultValue = "10") Integer pageSize,
                                  @RequestParam(value = "pageIndex") Integer pageIndex
    ) {
        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        Page<TourDTO> page = this.tourService.findAllTourAdmin(ten_tour,gia_tour_from,gia_tour_to,ngay_khoi_hanh,loai_tour, PageRequest.of(pageIndex,pageSize));

        return new ResponseDTO("Success",page.getContent());
    }

    @GetMapping("/{id}")
    public ResponseDTO getOneTour(@PathVariable("id") Long id) {

        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        TourDTO tour = this.tourService.findTourById(id);

        if(tour!=null) {
            return new ResponseDTO("Success",tour);
        }
        return new ResponseDTO("Fail" ,null);
    }


    @PostMapping("/add")
    public ResponseDTO createTour(@RequestBody TourDTO tourDTO) {

        if (!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access", null);
        }

        // Chuyển đổi Long thành Date
        if (tourDTO.getNgay_khoi_hanhMillis() != null) {
            tourDTO.setNgay_khoi_hanh(new Date(tourDTO.getNgay_khoi_hanhMillis()));
        }
        if (tourDTO.getNgay_ket_thucMillis() != null) {
            tourDTO.setNgay_ket_thuc(new Date(tourDTO.getNgay_ket_thucMillis()));
        }

        Tour tour = this.tourService.addTour(tourDTO);
        if (tour != null) {
            return new ResponseDTO("Success", tour);
        }
        return new ResponseDTO("Add to failure", null);
    }


    @PutMapping("/update/image/{id}")
    public @ResponseBody ResponseDTO updateTourImage(@PathVariable("id") Long id, @RequestParam("image") MultipartFile image) {

        if (!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access", null);
        }

        String uploadDir = "E:/2024/SU24/INTERN_FU_CT_2024_S2_G3/JourneyJoy(ProVip)/JourneyJoy/JourneyJoy/src/main/resources/static/public/img";

        // Kiểm tra xem tour có tồn tại không
        TourDTO tourDTO = this.tourService.findTourById(id);
        if (tourDTO == null) {
            return new ResponseDTO("Tour does not exist", null);
        }

        try {
            // Tạo tên tập tin duy nhất
            String fileName = UUID.randomUUID().toString() + "_" + image.getOriginalFilename();

            // Lưu ảnh vào thư mục "upload"
            FileUploadUtil.saveFile(uploadDir, fileName, image);

            // Cập nhật thông tin của tour
            tourDTO.setAnh_tour(fileName);
            Tour updateTour = this.tourService.updateTour(tourDTO, id);
            if (updateTour != null) {
                return new ResponseDTO("Success", updateTour);
            } else {
                return new ResponseDTO("Update failed", null);
            }

        } catch (IOException e) {
            log.error("Lỗi upload file: {}", e.getMessage());
            return new ResponseDTO("Error uploading image", null);
        }
    }


    @PutMapping("/update/{id}")
    public ResponseDTO updateTour(@PathVariable("id") Long id, @RequestBody TourDTO tourDTO) {

        logger.info("Received update request for tour ID: {}", id);
        logger.info("Tour data: {}", tourDTO);

        if (!this.userService.checkAdminLogin()) {
            logger.warn("Access denied for non-admin user");
            return new ResponseDTO("Not have access", null);
        }

        Tour updateTour = this.tourService.updateTour(tourDTO, id);
        if (updateTour != null) {
            logger.info("Tour update successful for ID: {}", id);
            return new ResponseDTO("Success", updateTour);
        }

        logger.error("Tour update failed for ID: {}", id);
        return new ResponseDTO("Update failed", null);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseDTO deleteTour(@PathVariable("id") Long id) {

        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        if(this.tourService.findTourById(id)!=null) {
            if(this.tourService.deleteTour(id)) {
                return new ResponseDTO("Delete successful",null);
            }

        }
        return new ResponseDTO("Delete failed",null);
    }

    @GetMapping("/getAllImageOfTour/{id}")
    public ResponseDTO getAllImageOfTour(@PathVariable("id") Long id) {

        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        return new ResponseDTO("Success",this.imageService.findByTourId(id));
    }

    @PostMapping("/add-image/{id}")
    public ResponseDTO addImage(@PathVariable("id") Long id,@RequestParam("image") MultipartFile image) {

        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        String uploadDir = "E:/2024/SU24/INTERN_FU_CT_2024_S2_G3/JourneyJoy(ProVip)/JourneyJoy/JourneyJoy/src/main/resources/static/public/img";

        try {
            // Lưu ảnh vào thư mục "upload"
            String fileName = UUID.randomUUID()+image.getOriginalFilename();
            FileUploadUtil.saveFile(uploadDir, fileName, image);

            if(this.tourService.findTourById(id)!=null) {

                return new ResponseDTO("Add successful",this.imageService.addToTour(id,fileName));
            }
        } catch (IOException  e) {
            // Xử lý exception
            log.info("Lỗi upload file: {}",e.getMessage());
        }

        return new ResponseDTO("Error while adding",null);

    }

    @GetMapping("/StartDate/{id}")
    public ResponseDTO getAllStartDate(@PathVariable("id") Long id) {

        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        return new ResponseDTO("Success",this.tourStartRepository.getDateStartByTourId(id));
    }


    @DeleteMapping("/StartDate/delete/{id}")
    public ResponseDTO deleteStartDate(@PathVariable("id") Long id) {

        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        this.tourStartRepository.deleteById(id);
        return new ResponseDTO("Delete successful",null);
    }

    @DeleteMapping("/TourImage/delete/{id}")
    public ResponseDTO deleteTourImage(@PathVariable("id") Long id) {

        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        this.imageService.deleteById(id);

        return new ResponseDTO("Photo deleted successfully",null);
    }

    @PostMapping("/add-date/{id}")
    public ResponseDTO addStartDate(@PathVariable("id") Long id, @RequestBody ToutStartAddDTO toutStartAddDTO) {

        if (!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access", null);
        }

        // Chuyển đổi giá trị Long thành Instant
        Instant instant = Instant.ofEpochMilli(toutStartAddDTO.getNgay_khoi_hanh());

        // Chuyển đổi Instant thành ZonedDateTime với múi giờ UTC
        ZonedDateTime utcDateTime = instant.atZone(ZoneId.of("UTC"));

        // Thêm một ngày vào ZonedDateTime
        ZonedDateTime updatedDateTime = utcDateTime.plusDays(0);

        // Chuyển đổi ZonedDateTime thành Date
        Date dateToSave = Date.from(updatedDateTime.toInstant());

        if (this.tourService.findTourById(id) != null) {
            TourStart tourStart = new TourStart();
            tourStart.setTour_id(id);
            tourStart.setNgay_khoi_hanh(dateToSave);

            return new ResponseDTO("Add successful", this.tourStartRepository.save(tourStart));
        }

        return new ResponseDTO("Tour does not exist when added", null);
    }

    @PostMapping("/filter")
    public List<TourDTO> findToursByFilters(@RequestBody TourFilterDTO filter) {
        return tourService.findToursByFilters(
                filter.getStartDate(),
                filter.getEndDate(),
                filter.getMinPrice(),
                filter.getMaxPrice(),
                filter.getDiemDen()
        );
    }
}
