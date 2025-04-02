package com.example.auth.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "constituency_id", nullable = false)
    private Constituency constituency;

    @Column(nullable = false)
    private String questionText;

    @Column(nullable = false)
    private String questionTextBn;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String options;
}
