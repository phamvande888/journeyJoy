package com.journeyjoy.controller.api.admin;

import com.journeyjoy.service.UserService;
import com.journeyjoy.utilities.SessionUtilities;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.journeyjoy.dto.LoginDTO;
import com.journeyjoy.dto.ResponseDTO;
import com.journeyjoy.dto.UserDTO;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> loginAction(@RequestBody LoginDTO login) {
        if (!this.userService.adminLogin(login)) {
            return ResponseEntity.badRequest().body("Sai thông tin đăng nhập");
        }

        // Lấy thông tin user và token từ SessionUtilities
        UserDTO userDTO = SessionUtilities.getAdmin();
        String token = SessionUtilities.getToken();

        // Tạo phản hồi chứa thông tin user và token
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", userDTO);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/logout")
    public ResponseDTO logout() {
        this.userService.adminLogout();
        return new ResponseDTO("Đăng xuất thành công", null);
    }

}
