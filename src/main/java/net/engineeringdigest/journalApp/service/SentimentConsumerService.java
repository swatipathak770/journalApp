package net.engineeringdigest.journalApp.service;

import net.engineeringdigest.journalApp.model.SentimentData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SentimentConsumerService {

    @Autowired
    private EmailService emailService;

    //@KafkaListener(topics = "weekly-sentiments", groupId = "weekly-sentiment-group")
    public void consume(SentimentData sentimentData) {
        sendEmail(sentimentData);
    }

    private void sendEmail(SentimentData sentimentData) {
        String body = "Hi there,\n\n"
                + "Here is your journal sentiment summary for the last 7 days.\n\n"
                + "Most frequent mood: " + sentimentData.getSentiment() + "\n\n"
                + "Keep writing regularly to understand your thoughts and emotional patterns over time.\n\n"
                + "- JournalApp";

        emailService.sendEmail(sentimentData.getEmail(), "Your weekly journal mood summary", body);
    }
}
