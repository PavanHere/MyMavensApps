import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.CallableStatement;

@Aspect
@Component
public class JdbcTemplateTimeoutAspect {

    @Value("${jdbcTemplate.globalTimeoutMillis:500}") // Default timeout is 500 milliseconds
    private int globalTimeoutMillis;

    @Pointcut("execution(* java.sql.CallableStatement.*(..))")
    public void callableStatementMethods() {}

    @Around("callableStatementMethods()")
    public Object applyGlobalTimeout(ProceedingJoinPoint joinPoint) throws Throwable {
        try {
            // Bind the CallableStatement object
            CallableStatement callableStatement = (CallableStatement) joinPoint.getTarget();
            callableStatement.setQueryTimeout(globalTimeoutMillis / 1000); // Convert milliseconds to seconds

            // Proceed with the original method call
            return joinPoint.proceed();
        } finally {
            // Reset the timeout after the query execution (optional)
            CallableStatement callableStatement = (CallableStatement) joinPoint.getTarget();
            callableStatement.setQueryTimeout(0);
        }
    }
}
