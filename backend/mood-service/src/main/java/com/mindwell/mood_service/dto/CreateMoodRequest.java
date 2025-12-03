package com.mindwell.mood_service.dto;

public class CreateMoodRequest {
    private int score;
    private String note;

    public CreateMoodRequest() {}

    public CreateMoodRequest(int score, String note) {
        this.score = score;
        this.note = note;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
