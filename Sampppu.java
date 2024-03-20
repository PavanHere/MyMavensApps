import java.sql.*;
import javax.sql.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.datasource.SimpleDriverDataSource;

@Configuration
public class DataSourceConfig {

    @Value("${jdbcTemplate.globalTimeoutMillis:500}") // Default timeout is 500 milliseconds
    private int globalTimeoutMillis;

    @Value("${spring.datasource.url}")
    private String url;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        SimpleDriverDataSource dataSource = new SimpleDriverDataSource();
        dataSource.setDriverClass(com.mysql.cj.jdbc.Driver.class); // Set your driver class
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return new TimeoutDataSource(dataSource);
    }

    private class TimeoutDataSource implements DataSource {

        private DataSource delegate;

        public TimeoutDataSource(DataSource delegate) {
            this.delegate = delegate;
        }

        @Override
        public Connection getConnection() throws SQLException {
            Connection connection = delegate.getConnection();
            return new TimeoutConnection(connection);
        }

        @Override
        public Connection getConnection(String username, String password) throws SQLException {
            Connection connection = delegate.getConnection(username, password);
            return new TimeoutConnection(connection);
        }

        // Implement other methods of the DataSource interface
    }

    private class TimeoutConnection implements Connection {

        private Connection delegate;

        public TimeoutConnection(Connection delegate) {
            this.delegate = delegate
