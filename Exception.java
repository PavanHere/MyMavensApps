import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class MyController {

    @RequestMapping("/hello")
    public String hello() {
        // Simulate an exception
        if (true) {
            throw new CustomException("HELLO_ERROR", "Custom Exception 1 occurred!");
        }
        return "Hello World!";
    }

    @RequestMapping("/bye")
    public String bye() {
        // Simulate another exception
        if (true) {
            throw new CustomException("BYE_ERROR", "Custom Exception 2 occurred!");
        }
        return "Goodbye!";
    }

    // Exception handler for CustomException
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<String> handleCustomException(CustomException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

// Custom exception class
class CustomException extends RuntimeException {
    private String errorCode;

    public CustomException(String errorCode, String message) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}

// Global exception handler using @ControllerAdvice
@ControllerAdvice
class GlobalExceptionHandler {

    // Exception handler for all exceptions
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        return new ResponseEntity<>("An error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
