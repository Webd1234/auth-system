package com.example.auth.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "survey_responses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SurveyResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long constituencyId; // Stores the constituency ID

    private String email; // Email if the user opted to submit with email

    @Column(columnDefinition = "TEXT") // Stores responses as JSON or comma-separated values
    private String responses;
}
