package com.lankatransit.system.auth;

import com.lankatransit.system.common.Role;
import com.lankatransit.system.exception.BadRequestException;
import com.lankatransit.system.exception.ConflictException;
import com.lankatransit.system.exception.ResourceNotFoundException;
import com.lankatransit.system.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       CustomerRepository customerRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new BadRequestException("Invalid username or password"));

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );

        String token = tokenProvider.generateToken(authentication);

        Long customerId = null;
        if (user.getRole() == Role.CUSTOMER) {
            Customer customer = customerRepository.findByUserId(user.getId()).orElse(null);
            if (customer != null) {
                customerId = customer.getId();
            }
        }

        return new AuthResponse(token, user.getId(), customerId, user.getUsername(), user.getEmail(), user.getFullName(), user.getRole());
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email is already registered");
        }

        User user = new User(
                request.getUsername(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getFullName(),
                request.getPhone(),
                Role.CUSTOMER
        );
        User savedUser = userRepository.save(user);

        Customer customer = new Customer(
                savedUser,
                request.getNic() != null ? request.getNic() : "PENDING-NIC",
                request.getAddress(),
                "BRONZE"
        );
        Customer savedCustomer = customerRepository.save(customer);

        String token = tokenProvider.generateTokenForUsername(savedUser.getUsername());

        return new AuthResponse(token, savedUser.getId(), savedCustomer.getId(), savedUser.getUsername(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole());
    }

    public User getUserProfile(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
