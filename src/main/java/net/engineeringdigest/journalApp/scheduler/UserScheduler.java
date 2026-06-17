package net.engineeringdigest.journalApp.scheduler;
import net.engineeringdigest.journalApp.entity.JournalEntry;
import net.engineeringdigest.journalApp.entity.User;
import net.engineeringdigest.journalApp.enums.Sentiment;
import net.engineeringdigest.journalApp.repository.UserRepositoryImpl;
import net.engineeringdigest.journalApp.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class UserScheduler {
    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepositoryImpl userRepository;

    public void fetchUsersAndSendSaMail() {
        List<User> users = userRepository.getUserForSA();
        for (User user : users) {
            List<JournalEntry> journalEntries = user.getJournalEntries() == null ? List.of() : user.getJournalEntries();
            List<Sentiment> sentiments = journalEntries.stream().filter(x -> x.getDate().isAfter(LocalDateTime.now().minus(7, ChronoUnit.DAYS))).map(x -> x.getSentiment()).collect(Collectors.toList());
            Map<Sentiment, Integer> sentimentCounts = new HashMap<>();
            for (Sentiment sentiment : sentiments) {
                if (sentiment != null)
                    sentimentCounts.put(sentiment, sentimentCounts.getOrDefault(sentiment, 0) + 1);
            }
            Sentiment mostFrequentSentiment = null;
            int maxCount = 0;
            for (Map.Entry<Sentiment, Integer> entry : sentimentCounts.entrySet()) {
                if (entry.getValue() > maxCount) {
                    maxCount = entry.getValue();
                    mostFrequentSentiment = entry.getKey();
                }
            }
            if (mostFrequentSentiment != null) {
                emailService.sendEmail(
                        user.getEmail(),
                        "Your weekly journal mood summary",
                        buildWeeklySummaryEmail(user, mostFrequentSentiment, sentiments.size())
                );
            }
        }
    }

    private String buildWeeklySummaryEmail(User user, Sentiment sentiment, int entryCount) {
        String name = user.getUsername() != null ? user.getUsername() : "there";
        String mood = sentiment.toString();

        return "Hi " + name + ",\n\n"
                + "Here is your journal sentiment summary for the last 7 days.\n\n"
                + "Most frequent mood: " + mood + "\n"
                + "Entries analyzed: " + entryCount + "\n\n"
                + getEncouragementMessage(sentiment) + "\n\n"
                + "Keep writing regularly to understand your thoughts and emotional patterns over time.\n\n"
                + "- JournalApp";
    }

    private String getEncouragementMessage(Sentiment sentiment) {
        return switch (sentiment) {
            case HAPPY -> "You seem to have had a positive week. Hold on to the moments that made it meaningful.";
            case SAD -> "This week may have felt heavy. Be kind to yourself and keep using your journal as a safe space.";
            case ANGRY -> "There may have been frustration this week. Writing it down is a strong first step toward clarity.";
            case ANXIOUS -> "You may have felt anxious this week. Small reflections can help you notice patterns and feel more grounded.";
        };
    }
}


