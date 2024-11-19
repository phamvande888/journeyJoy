package com.journeyjoy.utilities;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import com.journeyjoy.dto.UserDTO;
import jakarta.servlet.http.HttpSession;

public class SessionUtilities {

    public static HttpSession getSession() {
        ServletRequestAttributes attr = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        return attr.getRequest().getSession();
    }

    public static String getSdt() {
        return (String) getSession().getAttribute("sdt");
    }

    public static void setSdt(String sdt) {
        getSession().setAttribute("sdt", sdt);
    }

    public static void setUser(UserDTO user) {
        getSession().setAttribute("user", user);
    }

    public static UserDTO getUser() {
        return (UserDTO) getSession().getAttribute("user");
    }

    public static void setAdmin(UserDTO user) {
        getSession().setAttribute("admin", user);
    }

    public static UserDTO getAdmin() {
        return (UserDTO) getSession().getAttribute("admin");
    }

    public static void setTourGuide(UserDTO user) {
        getSession().setAttribute("tourGuide", user);
    }

    public static UserDTO getTourGuide() {
        return (UserDTO) getSession().getAttribute("tourGuide");
    }

    public static void tourGuideLogout() {
        getSession().setAttribute("tourGuide", null);
    }

    public static String getToken() {
        return (String) getSession().getAttribute("token");
    }

    public static void setToken(String token) {
        getSession().setAttribute("token", token);
    }
}
