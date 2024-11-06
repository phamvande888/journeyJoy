package com.journeyjoy.dto;

import java.util.Date;
import org.springframework.format.annotation.DateTimeFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TourStartDTO {
    private Long id;
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    private Date ngay_khoi_hanh;
}
