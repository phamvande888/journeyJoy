package com.journeyjoy.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity @Getter @Setter
@Table(name = "discount")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "min_people", nullable = false)
    private int minPeople;

    @Column(name = "discount_rate", nullable = false)
    private double discountRate;

}
