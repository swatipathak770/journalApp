package net.engineeringdigest.journalApp.controller;

import net.engineeringdigest.journalApp.dto.UserProfileResponse;
import net.engineeringdigest.journalApp.entity.JournalEntry;
import net.engineeringdigest.journalApp.entity.User;
import net.engineeringdigest.journalApp.repository.UserRepository;
import net.engineeringdigest.journalApp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.temporal.WeekFields;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PutMapping
    public ResponseEntity<?> updateUser(@RequestBody User user) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User userInDb = userService.findByUserName(username);
        userInDb.setUsername(user.getUsername());
        userInDb.setPassword(user.getPassword());
        userService.saveNewUser(userInDb);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @DeleteMapping
    public ResponseEntity<?> deleteUserById(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        userRepository.deleteByUsername(authentication.getName());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @GetMapping
    public ResponseEntity<?> greeting() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return new ResponseEntity<>("Hi " + authentication.getName(), HttpStatus.OK);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByUserName(authentication.getName());
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        List<JournalEntry> journals = user.getJournalEntries() == null ? List.of() : user.getJournalEntries();
        WeekFields weekFields = WeekFields.of(Locale.getDefault());
        int currentWeek = LocalDateTime.now().get(weekFields.weekOfWeekBasedYear());
        int currentYear = LocalDateTime.now().getYear();

        int favoriteCount = (int) journals.stream()
                .filter(entry -> Boolean.TRUE.equals(entry.getFavorite()))
                .count();
        int entriesThisWeek = (int) journals.stream()
                .filter(entry -> entry.getDate() != null)
                .filter(entry -> entry.getDate().getYear() == currentYear)
                .filter(entry -> entry.getDate().get(weekFields.weekOfWeekBasedYear()) == currentWeek)
                .count();

        return new ResponseEntity<>(
                new UserProfileResponse(
                        user.getUsername(),
                        user.getEmail(),
                        user.getRoles(),
                        journals.size(),
                        favoriteCount,
                        entriesThisWeek,
                        user.isSentimentAnalysis()
                ),
                HttpStatus.OK
        );
    }

    @PatchMapping("/sentiment-analysis")
    public ResponseEntity<?> updateSentimentAnalysis(@RequestBody Map<String, Boolean> body) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByUserName(authentication.getName());
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        user.setSentimentAnalysis(Boolean.TRUE.equals(body.get("enabled")));
        userService.saveUser(user);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}

