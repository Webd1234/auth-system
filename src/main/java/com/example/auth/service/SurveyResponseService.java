package com.example.auth.service;

import com.example.auth.model.SurveyResponse;
import com.example.auth.repository.SurveyResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SurveyResponseService {

    @Autowired
    private SurveyResponseRepository surveyResponseRepository;

    public SurveyResponse saveSurveyResponse(SurveyResponse response) {
        return surveyResponseRepository.save(response);
    }
    
    
    
    public List<SurveyResponse> getAllResponses() {
        return surveyResponseRepository.findAll();
    }
}

