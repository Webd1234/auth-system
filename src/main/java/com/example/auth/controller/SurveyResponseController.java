package com.example.auth.controller;

import com.example.auth.model.SurveyResponse;
import com.example.auth.service.SurveyResponseService;

import java.io.PrintWriter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/survey")
public class SurveyResponseController {

    @Autowired
    private SurveyResponseService surveyResponseService;

    @PostMapping("/submit")
    public ResponseEntity<String> submitSurveyResponse(@RequestBody SurveyResponse surveyResponse) {
        surveyResponseService.saveSurveyResponse(surveyResponse);
        return ResponseEntity.ok("Survey response saved successfully!");
    }
        
        
    // 🎯 2️⃣ API to Download Survey Responses as CSV
        @GetMapping("/download")
        public void downloadSurveyResponses(HttpServletResponse response) throws Exception {
            response.setContentType("text/csv");
            response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=survey_responses.csv");

            PrintWriter writer = response.getWriter();
            writer.println("ID,Constituency ID,Email,Responses");

            List<SurveyResponse> responses = surveyResponseService.getAllResponses();
            for (SurveyResponse r : responses) {
                writer.println(r.getId() + "," + r.getConstituencyId() + "," + (r.getEmail() != null ? r.getEmail() : "N/A") + "," + r.getResponses());
            }

            writer.flush();
            writer.close();
        
        
        
    }
}
