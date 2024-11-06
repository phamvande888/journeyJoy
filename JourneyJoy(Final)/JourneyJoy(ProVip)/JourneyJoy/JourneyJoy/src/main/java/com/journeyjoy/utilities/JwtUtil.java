package com.journeyjoy.utilities;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.journeyjoy.dto.UserDTO;
import java.security.Key;
import java.util.Date;
import com.journeyjoy.dto.UpdateUserDTO;

public class JwtUtil {

    private static final Logger logger = LoggerFactory.getLogger(JwtUtil.class);
    private static final String SECRET_KEY = "iloveyouiloveyouiloveyouiloveyou"; // Đây là SECRET_KEY cần kiểm tra

    // Sử dụng một secretKey cố định để không bị thay đổi sau khi khởi động lại ứng dụng
    private static final Key secretKey = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    public static String generateToken(UserDTO userDTO) {
        long expirationTimeInMilliseconds = 30 * 24 * 60 * 60 * 1000L; // 30 days in milliseconds
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTimeInMilliseconds);

        // Log thông tin khi tạo token
        logger.debug("Generating token for user: {}", userDTO.getUsername());

        return Jwts.builder()
                .setSubject(userDTO.getUsername())
                .claim("id", userDTO.getId())
                .claim("username", userDTO.getUsername())
                .claim("ho_ten", userDTO.getHo_ten())
                .claim("sdt", userDTO.getSdt())
                .claim("gioi_tinh", userDTO.getGioi_tinh())
                .claim("email", userDTO.getEmail())
                .claim("dia_chi", userDTO.getDia_chi())
                .claim("role", userDTO.getRole())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public static String generateToken(UpdateUserDTO userDTO) {
        long expirationTimeInMilliseconds = 30 * 24 * 60 * 60 * 1000L; // 30 days in milliseconds
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTimeInMilliseconds);

        // Log thông tin khi tạo token
        logger.debug("Generating token for user: {}", userDTO.getUsername());

        return Jwts.builder()
                .setSubject(userDTO.getUsername())
                .claim("username", userDTO.getUsername())
                .claim("ho_ten", userDTO.getHo_ten())
                .claim("sdt", userDTO.getSdt())
                .claim("gioi_tinh", userDTO.getGioi_tinh())
                .claim("email", userDTO.getEmail())
                .claim("dia_chi", userDTO.getDia_chi())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public static UserDTO getUserFromToken(String token) {
        try {
            // Log thông tin khi parse token
            logger.debug("Parsing token: {}", token);

            Jws<Claims> jws = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);

            Claims claims = jws.getBody();
            UserDTO userDTO = new UserDTO();
            userDTO.setId(claims.get("id", Long.class));
            userDTO.setUsername(claims.get("username", String.class));
            userDTO.setHo_ten(claims.get("ho_ten", String.class));
            userDTO.setSdt(claims.get("sdt", String.class));
            userDTO.setGioi_tinh(claims.get("gioi_tinh", String.class));
            userDTO.setEmail(claims.get("email", String.class));
            userDTO.setDia_chi(claims.get("dia_chi", String.class));
            userDTO.setRole(claims.get("role", Integer.class));

            return userDTO;
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("Failed to parse JWT token", e);

        }
        return null;
    }

    public static boolean validateToken(String token) {
        try {
            // Log thông tin khi validate token
            logger.debug("Validating token: {}", token);

            Jws<Claims> claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);

            Date expiration = claims.getBody().getExpiration();
            if (expiration == null) {
                logger.warn("Invalid token: no expiration date");
                return false;
            }

            logger.debug("Expiration: {}, Current Time: {}", expiration, new Date());

            boolean isExpired = expiration.before(new Date());
            if (isExpired) {
                logger.warn("Token has expired");
            }
            return !isExpired;
        } catch (ExpiredJwtException e) {
            logger.warn("Token has expired", e);
            return false;
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("Invalid Token", e);
            return false;
        }
    }

    public static boolean isMalformedToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token);
            return false;
        } catch (MalformedJwtException e) {
            logger.error("Token is in wrong format", e);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

}

