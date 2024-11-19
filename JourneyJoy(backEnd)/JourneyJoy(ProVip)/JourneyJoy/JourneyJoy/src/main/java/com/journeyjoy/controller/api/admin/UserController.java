package com.journeyjoy.controller.api.admin;

import com.journeyjoy.dto.ResponseDTO;
import com.journeyjoy.dto.UpdateUserDTO;
import com.journeyjoy.dto.UserDTO;
import com.journeyjoy.entity.User;
import com.journeyjoy.service.UserService;
import com.journeyjoy.utilities.ConvertUserToDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/getAll")
    public ResponseDTO getAllUser(
            @RequestParam(value = "sdt",required = false) String sdt,
            @RequestParam(value = "email",required = false) String email,
            @RequestParam(value = "ho_ten",required = false) String ho_ten,
            @RequestParam(value = "pageSize",defaultValue = "10") Integer pageSize,
            @RequestParam("pageIndex") Integer pageIndex
    ) {
        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        Page<UserDTO> page = this.userService.findAllUser(sdt,email,ho_ten, PageRequest.of(pageIndex,pageSize));

        return new ResponseDTO("Success",page.getContent());
    }

    @GetMapping("/{id}")
    public ResponseDTO getOneUser(@PathVariable("id") Long id) {

        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        if(this.userService.findUserById(id)!=null) {
            return new ResponseDTO("Success", ConvertUserToDto.convertUsertoDto(this.userService.findUserById(id)));
        }
        return new ResponseDTO("Fail",null);
    }

    @PutMapping("/update/{id}")
    public ResponseDTO updateUser(@PathVariable("id") Long id, @RequestBody UpdateUserDTO updateUserDTO) {

        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        User user = this.userService.findUserById(id);

        if(user!=null) {
            if(this.userService.updateUserByAdmin(updateUserDTO,id)) {
                return new ResponseDTO("Update succesful",this.userService.findUserById(id));
            }
        }
        return new ResponseDTO("Update failed",null);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseDTO deleteUser(@PathVariable("id") Long id){


        if(!this.userService.checkAdminLogin()) {
            return new ResponseDTO("Not have access",null);
        }

        User user = this.userService.findUserById(id);
        if(user!=null) {

            if(this.userService.deleteUserById(id)) {
                return new ResponseDTO("Delete succesful",null);
            }
        }

        return new ResponseDTO("This user cannot be deleted",null);
    }

    @PutMapping("/update/resetPass/{id}")
    public ResponseDTO resetPass(@PathVariable("id") Long id) {

        if (!this.userService.checkAdminLogin()) {
            ResponseDTO response = new ResponseDTO("Not have access", null);
            logger.info("API Response: {}", response);
            return response;
        }

        if (this.userService.resetPass(id)) {
            ResponseDTO response = new ResponseDTO("Default password restored successfully", null);
            logger.info("API Response: {}", response);
            return response;
        }

        ResponseDTO response = new ResponseDTO("Default password recovery failed", null);
        logger.info("API Response: {}", response);
        return response;
    }

}
