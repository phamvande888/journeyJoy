package com.journeyjoy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {

    private Long id;

    private String username;

    private String ho_ten;

    private String sdt;

    private String gioi_tinh;

    private String email;

    private String dia_chi;

    private Integer role;

    private Boolean banned;

}
