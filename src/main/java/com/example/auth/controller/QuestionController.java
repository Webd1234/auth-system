package com.example.auth.controller;

import com.example.auth.entity.Question;
import com.example.auth.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin("*")
public class QuestionController {
    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/{constituencyId}")
    public ResponseEntity<List<Question>> getQuestions(@PathVariable Long constituencyId) {
        List<Question> questions = questionService.getQuestionsByConstituency(constituencyId);
        if (questions.isEmpty()) {
            return ResponseEntity.noContent().build(); // Return 204 if no questions
        }

        // Log the fetched questions
        System.out.println("Questions fetched for constituency ID " + constituencyId + ": " + questions);

        return ResponseEntity.ok(questions); // Return 200 OK with the questions
    }
}
