import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class JdbcTemplateTimeoutAspect {

    @Value("${jdbcTemplate.globalTimeout:10}") // Default timeout is 10 seconds
    private int globalTimeout;

    @Pointcut("execution(* org.springframework.jdbc.core.JdbcTemplate.*(..))")
    public void jdbcOperationsPointcut() {}

    @Around("jdbcOperationsPointcut()")
    public Object applyGlobalTimeout(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            // Bind the JdbcTemplate object
            JdbcTemplate jdbcTemplate = (JdbcTemplate) joinPoint.getTarget();

            // Set the global timeout for each query execution
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
