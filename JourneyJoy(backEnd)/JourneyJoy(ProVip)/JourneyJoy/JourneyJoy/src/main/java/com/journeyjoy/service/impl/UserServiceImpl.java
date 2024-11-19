package com.journeyjoy.service.impl;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.journeyjoy.dto.*;
import com.journeyjoy.entity.Booking;
import com.journeyjoy.repository.BookingRepository;
import com.journeyjoy.service.EmailService;
import com.journeyjoy.utilities.JwtUtil;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.journeyjoy.entity.User;
import com.journeyjoy.repository.UserRepository;
import com.journeyjoy.service.UserService;
import com.journeyjoy.utilities.ConvertUserToDto;
import com.journeyjoy.utilities.SessionUtilities;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public Long getCurrentUserId() {
        return SessionUtilities.getUser().getId();
    }

    @Override
    public Page<UserDTO> findAllUser(String sdt,String email,String ho_ten,Pageable pageable) {

        Page<User> page = userRepository.findAll(sdt,email,ho_ten,pageable);

        Page<UserDTO> pageUserDTO = new PageImpl<>(
                page.getContent().stream().map(user ->  {

                    UserDTO userDTO = ConvertUserToDto.convertUsertoDto(user);
                    return userDTO;
                }).collect(Collectors.toList()),
                page.getPageable(),
                page.getTotalElements()
        );

        return pageUserDTO;
    }

    @Override
    public User findUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if(user.isPresent()) {
            return user.get();
        }
        return null;
    }

    @Override
    public User findUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if(user!=null) {
            return user;
        }
        return null;
    }
    @Override
    public User findUserBySdt(String sdt) {
        User user = userRepository.findBySdt(sdt);
        if(user!=null) {
            return user;
        }
        return null;
    }

    @Override
    public boolean saveUser(User user) {
        if(this.userRepository.save(user)!=null) {
            return true;
        }
        return false;
    }

    @Override
    public boolean updateUser(UpdateUserDTO updateUserDTO) {
        if(SessionUtilities.getUser()!=null) {
            Long user_id = SessionUtilities.getUser().getId();

            User user = this.userRepository.findById(user_id).get();

            user.setSdt(updateUserDTO.getSdt());
            user.setUsername(updateUserDTO.getUsername());
            user.setEmail(updateUserDTO.getEmail());
            user.setDia_chi(updateUserDTO.getDia_chi());
            user.setHo_ten(updateUserDTO.getHo_ten());
            user.setGioi_tinh(updateUserDTO.getGioi_tinh());

            this.userRepository.save(user);

            SessionUtilities.setUser(ConvertUserToDto.convertUsertoDto(user));

            return true;

        }

        return false;
    }

    @Override
    public boolean deleteUserById(Long id) {
        Optional<User> user = this.userRepository.findById(id);
        if(user.isPresent()) {
            if(this.bookingRepository.findBookingByUserId(id)==null || this.bookingRepository.findBookingByUserId(id).size()==0) {
                this.userRepository.deleteById(id);
                return true;
            }
        }
        return false;
    }


    public class ErrorMessageStorage {
        private static final ThreadLocal<String> errorMessage = new ThreadLocal<>();

        public static String getErrorMessage() {
            return errorMessage.get();
        }

        public static void setErrorMessage(String message) {
            errorMessage.set(message);
        }

        public static void clear() {
            errorMessage.remove();
        }
    }

    @Override
    public boolean register(RegisterDTO newUser) {
        ErrorMessageStorage.clear(); // Clear previous error messages

        // Validate phone number
        if (newUser.getSdt() == null || newUser.getSdt().trim().isEmpty()) {
            ErrorMessageStorage.setErrorMessage("Phone number can not be null");
            return false;
        }

        String phonePattern = "^(\\+84|0)[3|5|7|8|9][0-9]{8}$";
        if (!newUser.getSdt().matches(phonePattern)) {
            ErrorMessageStorage.setErrorMessage("Invalid phone number");
            return false;
        }

        if (this.findUserBySdt(newUser.getSdt()) != null) {
            ErrorMessageStorage.setErrorMessage("Phone number already in use");
            return false;
        }

        // Validate email
        if (this.emailExists(newUser.getEmail())) {
            ErrorMessageStorage.setErrorMessage("Email already in use");
            return false;
        }

        // Validate password length
        if (newUser.getPassword().length() < 8) {
            ErrorMessageStorage.setErrorMessage("Password must be at least 8 characters");
            return false;
        }

        // Validate fields for special characters and trim spaces
        String specialCharPattern = "^[a-zA-Z0-9\\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂƯưăạảấầẩẫậắằẳẵặẹẻẽềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*$";
        String emailPattern = "^[a-zA-Z0-9@.]*$";
        String addressPattern = "^[a-zA-Z0-9,\\sÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểẾỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*$";

        if (!newUser.getUsername().matches(specialCharPattern) ||
                !newUser.getHo_ten().matches(specialCharPattern) ||
                !newUser.getEmail().matches(emailPattern) ||
                !newUser.getDia_chi().matches(addressPattern) ||
                !newUser.getGioi_tinh().matches(specialCharPattern)) {
            ErrorMessageStorage.setErrorMessage("Fields cannot contain special characters");
            return false;
        }

        // Create and save user
        User user = new User();
        user.setUsername(newUser.getUsername().trim());
        user.setHo_ten(newUser.getHo_ten().trim());
        user.setPassword(BCrypt.hashpw(newUser.getPassword().trim(), BCrypt.gensalt(10)));
        user.setEmail(newUser.getEmail().trim());
        user.setGioi_tinh(newUser.getGioi_tinh().trim());
        user.setRole(1);
        user.setDia_chi(newUser.getDia_chi().trim());
        user.setSdt(newUser.getSdt().trim());
        return this.saveUser(user);
    }

    @Override
    public boolean checkLogin() {
        return SessionUtilities.getSdt() != null;
    }

    @Override
    public boolean changePassword(ChangePasswordDTO changePasswordDTO) {
        if(SessionUtilities.getUser()!=null) {
            Long user_id = SessionUtilities.getUser().getId();

            User user = this.userRepository.findById(user_id).get();

            if(BCrypt.checkpw(changePasswordDTO.getOldPassword(),user.getPassword()) && changePasswordDTO.getNewPassword()!=null) {
                user.setPassword(BCrypt.hashpw(changePasswordDTO.getNewPassword(), BCrypt.gensalt(10)));
                this.userRepository.save(user);
                return true;
            }
            return false;

        }
        return false;
    }

    @Override
    public boolean updateUserByAdmin(UpdateUserDTO updateUserDTO,Long id) {

        User user = this.userRepository.findById(id).get();
        if(user!=null) {
            user.setSdt(updateUserDTO.getSdt());
            user.setUsername(updateUserDTO.getUsername());
            user.setEmail(updateUserDTO.getEmail());
            user.setDia_chi(updateUserDTO.getDia_chi());
            user.setHo_ten(updateUserDTO.getHo_ten());
            user.setGioi_tinh(updateUserDTO.getGioi_tinh());

            this.userRepository.save(user);

            return true;
        }

        return false;
    }

    @Override
    public boolean emailExists(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Override
    public boolean checkAdminLogin() {
        UserDTO user = SessionUtilities.getUser();
        return user != null && user.getRole() == 0; // Giả sử vai trò admin là 0
    }


    @Override
    public void adminLogout() {
        SessionUtilities.setAdmin(null);
    }

    @Override
    public boolean resetPass(Long id) {
        User user = this.userRepository.findById(id).get();

        user.setPassword(BCrypt.hashpw("123@123a", BCrypt.gensalt(10)));

        if(this.userRepository.save(user)!=null) {
            return true;
        }

        return false;
    }

    @Override
    public Page<UserDTO> findUsersByRole(int role, Pageable pageable) {
        Page<User> users = userRepository.findByRole(role, pageable);
        return users.map(ConvertUserToDto::convertUsertoDto);
    }

    @Override
    public boolean login(LoginDTO user) {
        User userCheck = this.findUserBySdt(user.getSdt());

        // Kiểm tra xem người dùng có tồn tại không
        if (userCheck == null) {
            return false;
        }

        log.info("userCheck: {}", userCheck.getSdt());

        // Kiểm tra trạng thái cấm
        // Nếu bị cấm, trả về false
        if (userCheck.getBanned() != null && userCheck.getBanned()) {
            log.info("User is banned: {}", userCheck.getSdt());
            return false;
        }

        // Kiểm tra mật khẩu
        if (BCrypt.checkpw(user.getPassword(), userCheck.getPassword())) {
            UserDTO userDTO = ConvertUserToDto.convertUsertoDto(userCheck);
            String jwt = JwtUtil.generateToken(userDTO);
            SessionUtilities.setSdt(userCheck.getSdt());
            SessionUtilities.setUser(userDTO);
            SessionUtilities.setToken(jwt);
            log.info("Logged in user: {}", SessionUtilities.getSdt());
            return true;
        }

        return false;
    }
    @Override
    public boolean adminLogin(LoginDTO user) {
        User userCheck = this.findUserBySdt(user.getSdt());

        if (userCheck == null) {
            return false;
        }

        log.info("userCheck: {}", userCheck.getUsername());

        if (BCrypt.checkpw(user.getPassword(), userCheck.getPassword()) && userCheck.getRole() == 0) {
            UserDTO adminDTO = ConvertUserToDto.convertUsertoDto(userCheck);
            String jwt = JwtUtil.generateToken(adminDTO);
            SessionUtilities.setAdmin(adminDTO);
            SessionUtilities.setToken(jwt);

            log.info("Logged in as admin: {}", SessionUtilities.getSdt());

            return true;
        }

        return false;
    }


    @Override
    public boolean tourGuideLogin(LoginDTO user) {
        User userCheck = this.findUserBySdt(user.getSdt());

        if (userCheck == null) {
            return false;
        }

        log.info("userCheck: {}", userCheck.getUsername());

        if (BCrypt.checkpw(user.getPassword(), userCheck.getPassword()) && userCheck.getRole() == 2) {
            UserDTO tourGuideDTO = ConvertUserToDto.convertUsertoDto(userCheck);
            String jwt = JwtUtil.generateToken(tourGuideDTO);
            SessionUtilities.setTourGuide(tourGuideDTO);
            SessionUtilities.setToken(jwt);

            log.info("Logged in as tour guide: {}", SessionUtilities.getSdt());

            return true;
        }

        return false;
    }

    @Override
    public boolean checkTourGuideLogin() {
        UserDTO user = SessionUtilities.getUser();
        return user != null && user.getRole() == 2;
    }

    @Override
    public void tourGuideLogout() {
        SessionUtilities.setTourGuide(null);
    }

    @Override
    public boolean updateBanStatus(Long userId, boolean bannedStatus) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setBanned(bannedStatus); // Cập nhật trạng thái cấm
            userRepository.save(user);
            return true;
        }
        return false;
    }

    @Autowired
    private EmailService emailService;

    private static final int PASSWORD_LENGTH = 8;

    @Override
    public boolean forgotPassword(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String newPassword = generateRandomPassword();
            user.setPassword(new BCryptPasswordEncoder().encode(newPassword));
            userRepository.save(user);

            String subject = "Your New Password From JOURNEYJOYWEB";
            String message = "Your new password is: " + newPassword;
            emailService.sendEmail(email, subject, message);

            return true;
        } else {
            return false;
        }
    }

    private String generateRandomPassword() {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            int randomChar = (int)(Math.random() * 26) + 97;
            sb.append((char)randomChar);
        }
        return sb.toString();
    }
@Override
    public List<UserDTO> findAllAdmins() {
        return userRepository.findAdminByRole(0).stream()
                .map(ConvertUserToDto::convertUsertoDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDTO getUserByBookingId(Long bookingId) {
        // Lấy booking theo bookingId
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Lấy thông tin user từ booking
        User user = userRepository.findById(booking.getUser_id())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Chuyển đổi user thành UserDTO
        return ConvertUserToDto.convertUsertoDto(user);
    }
}
