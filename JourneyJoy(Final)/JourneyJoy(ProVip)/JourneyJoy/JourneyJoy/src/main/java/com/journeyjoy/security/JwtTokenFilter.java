package com.journeyjoy.security;

import com.journeyjoy.dto.UserDTO;
import com.journeyjoy.utilities.JwtUtil;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenFilter.class);

    @Override
    protected void doFilterInternal(jakarta.servlet.http.HttpServletRequest request, jakarta.servlet.http.HttpServletResponse response, jakarta.servlet.FilterChain filterChain) throws jakarta.servlet.ServletException, IOException {
        try {
            String header = request.getHeader("Authorization");
            logger.info("Tiêu đề Authorization: {}", header);

            if (header == null || !header.startsWith("Bearer ")) {
                logger.info("Không tìm thấy token hoặc định dạng tiêu đề không đúng");
                filterChain.doFilter(request, response);
                return;
            }

            String token = header.substring(7);
            logger.info("Nhận được token: {}", token);

            if (!JwtUtil.validateToken(token)) {
                logger.info("Token không hợp lệ");
                filterChain.doFilter(request, response);
                return;
            }

            UserDTO userDTO = JwtUtil.getUserFromToken(token);
            logger.info("Thông tin người dùng lấy từ token: {}", userDTO);

            if (userDTO != null) {
                // Tạo danh sách quyền hạn từ vai trò của người dùng
                List<GrantedAuthority> authorities = new ArrayList<>();
                if (userDTO.getRole() != null) {
                    switch (userDTO.getRole()) {
                        case 0:
                            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                            break;
                        case 2:
                            authorities.add(new SimpleGrantedAuthority("ROLE_TOURGUIDE"));
                            break;
                        default:
                            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
                            break;
                    }
                }

                // Tạo đối tượng xác thực với quyền hạn đã thiết lập
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDTO.getSdt(), null, authorities);
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                // Lưu thông tin người dùng vào session
                request.getSession().setAttribute("user", userDTO);
                request.getSession().setAttribute("sdt", userDTO.getSdt());

                logger.info("Thiết lập xác thực trong SecurityContext");
            }
            else {
                logger.info("Không thể lấy thông tin người dùng từ token");
            }

            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            logger.error("Lỗi khi xử lý token xác thực", ex);
            throw ex;
        }
    }
}
