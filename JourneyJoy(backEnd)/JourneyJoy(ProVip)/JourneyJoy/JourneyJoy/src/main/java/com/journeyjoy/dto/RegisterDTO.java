package com.journeyjoy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {

    private String username;

    private String ho_ten;

    private String password;

    private String gioi_tinh;

    private String sdt;

    private String email;

    private String dia_chi;

    private Integer role;


}
