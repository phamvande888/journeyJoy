package com.journeyjoy.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RecommendedTourDTO {
    private Long id;
    private String tenTour;
    private Long giaTour;
    private String anhTour;
}