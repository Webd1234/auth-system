package com.example.auth.entity;



import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "constituencies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Constituency {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;
}
