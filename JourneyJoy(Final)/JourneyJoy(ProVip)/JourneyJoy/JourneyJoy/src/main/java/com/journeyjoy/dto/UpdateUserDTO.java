package com.journeyjoy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserDTO {

    private String username;

    private String ho_ten;

    private String sdt;

    private String gioi_tinh;

    private String email;

    private String dia_chi;

}
