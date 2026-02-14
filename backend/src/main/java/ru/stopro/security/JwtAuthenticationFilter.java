package ru.stopro.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * JWT-фильтр авторизации.
 *
 * Для каждого запроса:
 *  1. Извлекает Bearer-токен из заголовка Authorization.
 *  2. Парсит username из токена.
 *  3. Загружает пользователя из БД.
 *  4. Проверяет валидность токена.
 *  5. Устанавливает Authentication в SecurityContext (с ролями).
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    private static final String BEARER_PREFIX = "Bearer ";

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // Нет заголовка или не Bearer — пропускаем
        if (authHeader == null || !authHeader.startsWith(BEARER_PREFIX)) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(BEARER_PREFIX.length());

            // Демо-токены: принять без проверки JWT и загрузить соответствующего пользователя из БД
            if (SecurityContextHolder.getContext().getAuthentication() == null) {
                String demoUsername = null;
                if ("demo-token-teacher".equals(jwt)) {
                    demoUsername = ru.stopro.config.DemoDataLoader.DEMO_TEACHER_USERNAME;
                } else if ("demo-token-student".equals(jwt)) {
                    demoUsername = ru.stopro.config.DemoDataLoader.DEMO_STUDENT_USERNAME;
                }
                if (demoUsername != null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(demoUsername);
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities());
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("Authenticated demo user: {}", demoUsername);
                    filterChain.doFilter(request, response);
                    return;
                }
            }

            final String username = jwtService.extractUsername(jwt);

            // Если username извлечён и ещё нет аутентификации в контексте
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities() // ROLE_TEACHER, ROLE_STUDENT и т.д.
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.debug("Authenticated user: {} with roles: {}",
                            username, userDetails.getAuthorities());
                }
            }
        } catch (Exception e) {
            log.warn("JWT authentication failed: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }
}
