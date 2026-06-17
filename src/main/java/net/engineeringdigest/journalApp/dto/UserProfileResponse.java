package net.engineeringdigest.journalApp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private String username;
    private String email;
    private List<String> roles;
    private int totalJournals;
    private int favoriteCount;
    private int entriesThisWeek;
    private boolean sentimentAnalysis;
}
