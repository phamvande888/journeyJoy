package com.journeyjoy.controller.api.admin;

import com.journeyjoy.dto.BookingDTO;
import com.journeyjoy.dto.ResponseDTO;
import com.journeyjoy.service.BookingService;
import com.journeyjoy.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @GetMapping("/getAllBooking")
    public ResponseDTO getAllBooking(@RequestParam(value="trang_thai",required = false) Integer trang_thai,
                                     @RequestParam(value = "trang_thai",required = false) String ten_tour,
                                     @RequestParam(value="pageSize",defaultValue = "10") Integer pageSize,
                                     @RequestParam("pageIndex") Integer pageIndex){


        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        Page<BookingDTO> page = this.bookingService.findAllBooking(trang_thai,ten_tour, PageRequest.of(pageIndex,pageSize));

        return new ResponseDTO("Success",page.getContent());

    }

    @GetMapping("/{id}")
    public ResponseDTO getOneBooking(@PathVariable("id") Long id) {
        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }
        return new ResponseDTO("Success",this.bookingService.getBookingById(id));
    }
    @GetMapping("/detail/{id}")
    public ResponseDTO getOneDetailBooking(@PathVariable("id") Long id) {
        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }
        return new ResponseDTO("Success",this.bookingService.getBookingDetailById(id));
    }

    @PutMapping("/approve/{id}")
    public ResponseDTO changeStatus(@PathVariable("id") Long id,@RequestParam("trang_thai") Integer trang_thai) {

        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        if(this.bookingService.approveBooking(id,trang_thai)) {
            return new ResponseDTO("Update successful",null);
        }
        return new ResponseDTO("Update failed",null);
    }


    @DeleteMapping("/delete/{id}")
    public ResponseDTO deleteBooking(@PathVariable("id") Long id) {

        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        if(this.bookingService.deleteBooking(id)) {
            return new ResponseDTO("Delete successful",null);
        }

        return new ResponseDTO("Only completed and canceled tours can be deleted.",null);
    }


    @PutMapping("/checkin/{id}")
    public ResponseDTO changeCheckinStatus(@PathVariable("id") Long id, @RequestParam("checkin") Integer checkin) {
        if (!this.userService.checkTourGuideLogin()) {
            return new ResponseDTO("Not have access", null);
        }

        if (this.bookingService.checkinBooking(id, checkin)) {
            return new ResponseDTO("Update successful", null);
        }
        return new ResponseDTO("Update failed", null);
    }
}
