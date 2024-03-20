
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Component;

import java.sql.CallableStatement;

@Aspect
@Component
public class JdbcTemplateTimeoutAspect {

    @Value("${jdbcTemplate.globalTimeoutMillis:500}") // Default timeout is 500 milliseconds
    private int globalTimeoutMillis;

    @Pointcut("execution(* org.springframework.jdbc.core.JdbcTemplate.*(..)) || execution(* java.sql.CallableStatement.*(..))")
    public void jdbcOperationsPointcut() {}

    @Around("jdbcOperationsPointcut()")
    public Object applyGlobalTimeout(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            // Bind the JdbcTemplate or CallableStatement object
            Object target = joinPoint.getTarget();
            if (target instanceof JdbcTemplate) {
                JdbcTemplate jdbcTemplate = (JdbcTemplate) target;
                jdbcTemplate.setQueryTimeout(globalTimeoutMillis / 1000); // Convert milliseconds to seconds
            } else if (target instanceof CallableStatement) {
                CallableStatement callableStatement = (CallableStatement) target;
                callableStatement.setQueryTimeout(globalTimeoutMillis / 1000); // Convert milliseconds to seconds
            }

            // Proceed with the original method call
            return joinPoint.proceed();
        } finally {
            // Reset the timeout after the query execution (optional)
            if (joinPoint.getTarget() instanceof JdbcTemplate) {
                JdbcTemplate jdbcTemplate = (JdbcTemplate) joinPoint.getTarget();
                jdbcTemplate.setQueryTimeout(0);
            } else if (joinPoint.getTarget() instanceof CallableStatement) {
                CallableStatement callableStatement = (CallableStatement) joinPoint.getTarget();
                callableStatement.setQueryTimeout(0);
            }
        }
    }
}
