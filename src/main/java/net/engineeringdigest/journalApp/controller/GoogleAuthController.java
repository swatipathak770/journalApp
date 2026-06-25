package net.engineeringdigest.journalApp.controller;

import lombok.extern.slf4j.Slf4j;
import net.engineeringdigest.journalApp.entity.User;
import net.engineeringdigest.journalApp.repository.UserRepository;
import net.engineeringdigest.journalApp.service.UserDetailsServiceImpl;
import net.engineeringdigest.journalApp.utilis.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import jakarta.annotation.PostConstruct;

import java.util.*;

@RestController
@Slf4j
public class GoogleAuthController {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${app.google.redirect-uri:http://localhost:8080/journal/login/oauth2/code/google}")
    private String redirectUri;

    @Value("${app.frontend.google-success-uri:http://localhost:5173/oauth/google/callback}")
    private String frontendSuccessUri;



    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;
    @PostConstruct
    public void test() {
        log.info("================================");
        log.info("GOOGLE URI : {}", redirectUri);
        log.info("FRONTEND URI : {}", frontendSuccessUri);
        log.info("================================");
    }
    @GetMapping("/public/test-env")
    public String testEnv() {
        return redirectUri;
    }

    @GetMapping("/auth/google/authorize")
    public ResponseEntity<Void> redirectToGoogle() {

        log.info("GOOGLE REDIRECT URI = {}", redirectUri);
        log.info("FRONTEND SUCCESS URI = {}", frontendSuccessUri);

        String googleAuthUrl = UriComponentsBuilder
                .fromUriString("https://accounts.google.com/o/oauth2/v2/auth")
                .queryParam("client_id", clientId)
                .queryParam("redirect_uri", redirectUri)
                .queryParam("response_type", "code")
                .queryParam("scope", "openid email profile")
                .queryParam("access_type", "offline")
                .queryParam("prompt", "consent")
                .build()
                .toUriString();

        return ResponseEntity.status(HttpStatus.FOUND)
                .header(HttpHeaders.LOCATION, googleAuthUrl)
                .build();
    }

    @GetMapping({"/auth/google/callback", "/login/oauth2/code/google"})
    public ResponseEntity<?> handleGoogleCallback(@RequestParam String code) {

        log.info("======================================");
        log.info("GOOGLE CALLBACK REACHED");
        log.info("Authorization code received");
        log.info("Redirect URI being used: {}", redirectUri);
        log.info("Frontend Success URI: {}", frontendSuccessUri);
        log.info("======================================");

        try {

            String tokenEndpoint = "https://oauth2.googleapis.com/token";

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("code", code);
            params.add("client_id", clientId);
            params.add("client_secret", clientSecret);
            params.add("redirect_uri", redirectUri);
            params.add("grant_type", "authorization_code");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            HttpEntity<MultiValueMap<String, String>> request =
                    new HttpEntity<>(params, headers);

            log.info("Requesting access token from Google...");

            ResponseEntity<Map> tokenResponse =
                    restTemplate.postForEntity(tokenEndpoint, request, Map.class);

            log.info("Google token exchange successful");

            String idToken = (String) tokenResponse.getBody().get("id_token");

            log.info("ID Token received");

            String userInfoUrl =
                    "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;

            ResponseEntity<Map> userInfoResponse =
                    restTemplate.getForEntity(userInfoUrl, Map.class);

            log.info("Google user info fetched");

            if (userInfoResponse.getStatusCode() == HttpStatus.OK) {

                Map<String, Object> userInfo = userInfoResponse.getBody();

                String email = (String) userInfo.get("email");

                log.info("Google Email: {}", email);

                try {

                    userDetailsService.loadUserByUsername(email);

                    log.info("Existing user found");

                } catch (Exception e) {

                    log.info("User not found. Creating new user...");

                    User user = new User();
                    user.setEmail(email);
                    user.setUsername(email);
                    user.setPassword(
                            passwordEncoder.encode(UUID.randomUUID().toString())
                    );
                    user.setRoles(Arrays.asList("USER"));

                    userRepository.save(user);

                    log.info("New user saved successfully");
                }

                String jwtToken = jwtUtil.generateToken(email);

                log.info("JWT generated successfully");

                String successUrl = UriComponentsBuilder
                        .fromUriString(frontendSuccessUri)
                        .queryParam("token", jwtToken)
                        .queryParam("username", email)
                        .build()
                        .toUriString();

                log.info("Redirecting to frontend:");
                log.info(successUrl);

                return ResponseEntity.status(HttpStatus.FOUND)
                        .header(HttpHeaders.LOCATION, successUrl)
                        .build();
            }

            log.error("Google user info request returned non-200 status");

            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        } catch (Exception e) {

            log.error("Exception occurred while handleGoogleCallback", e);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}

/*

https://accounts.google.com/o/oauth2/auth?
client_id=YOUR_CLIENT_ID
    &redirect_uri=YOUR_REDIRECT_URI
    &response_type=code
    &scope=email profile
    &access_type=offline
    &prompt=consent

*/

