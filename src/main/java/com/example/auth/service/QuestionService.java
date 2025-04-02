package com.example.auth.service;

import com.example.auth.entity.Question;
import com.example.auth.repository.QuestionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {
    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public List<Question> getQuestionsByConstituency(Long constituencyId) {
        return questionRepository.findByConstituencyId(constituencyId);
    }
}



