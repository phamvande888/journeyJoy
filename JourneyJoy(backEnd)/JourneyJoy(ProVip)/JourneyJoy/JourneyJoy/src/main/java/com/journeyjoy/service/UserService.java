package com.journeyjoy.service;

import java.util.List;
import com.journeyjoy.dto.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.journeyjoy.entity.User;

public interface UserService {

    public Page<UserDTO> findAllUser(String sdt, String email, String ho_ten, Pageable pageable);
    public User findUserById(Long id);
    public User findUserByUsername(String username);

    User findUserBySdt(String sdt);

    public boolean saveUser(User user);
    public boolean login(LoginDTO user);
    public boolean register(com.journeyjoy.dto.RegisterDTO user);
    public boolean updateUser(UpdateUserDTO updateUserDTO);
    public boolean deleteUserById(Long id);
    public boolean checkLogin();
    public boolean changePassword(ChangePasswordDTO changePasswordDTO);
    public boolean updateUserByAdmin(UpdateUserDTO updateUserDTO,Long id);
    public boolean adminLogin(LoginDTO user);


    boolean emailExists(String email);

    public boolean checkAdminLogin();
    public void adminLogout();
    public boolean resetPass(Long id);

    Page<UserDTO> findUsersByRole(int role, Pageable pageable);

    boolean tourGuideLogin(LoginDTO user);

    boolean checkTourGuideLogin();

    void tourGuideLogout();

    Long getCurrentUserId();

    boolean updateBanStatus(Long userId, boolean bannedStatus);

    boolean forgotPassword(String email);

    List<UserDTO> findAllAdmins();

    UserDTO getUserByBookingId(Long bookingId);
}
