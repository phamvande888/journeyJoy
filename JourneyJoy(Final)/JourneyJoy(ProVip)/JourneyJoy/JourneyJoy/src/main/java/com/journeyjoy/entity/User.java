package com.journeyjoy.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor @AllArgsConstructor @Getter @Setter
@Entity
@Table(name = "\"user\"")
public class User {
    public static final Integer ROLE_ADMIN = 0;
    public static final Integer ROLE_USER = 1;
    public static final Integer ROLE_TOURGUIDE = 2;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String ho_ten;

    @JsonIgnore
    private String password;

    private String gioi_tinh;

    private String sdt;

    private String email;

    private String dia_chi;

    private Integer role;


    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean banned = false;
}
