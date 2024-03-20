import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class JdbcTemplateTimeoutAspect {

    @Value("${jdbcTemplate.globalTimeout:10}") // Default timeout is 10 seconds
    private int globalTimeout;

    @Around("execution(* org.springframework.jdbc.core.JdbcTemplate.*(..))")
    public Object applyGlobalTimeout(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            // Set the global timeout for each query execution
            JdbcTemplate jdbcTemplate = (JdbcTemplate) joinPoint.getTarget();
            jdbcTemplate.setQueryTimeout(globalTimeout);

            // Proceed with the original method call
            return joinPoint.proceed();
        } finally {
            // Reset the timeout after the query execution (optional)
            JdbcTemplate jdbcTemplate = (JdbcTemplate) joinPoint.getTarget();
            jdbcTemplate.setQueryTimeout(0);
        }
    }
}
