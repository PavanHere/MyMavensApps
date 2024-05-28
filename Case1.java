
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import java.util.List;
import java.util.ArrayList;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;

public class YourClassNameTest {

    @Test
    public void testRetrieveAffidavitData() {
        // Mock NamedParameterJdbcTemplate
        NamedParameterJdbcTemplate jdbcTemplate = mock(NamedParameterJdbcTemplate.class);

        // Mock query result
        List<AffidavitSelectionDto> mockResult = new ArrayList<>();
        mockResult.add(new AffidavitSelectionDto("value1", null, null));
        mockResult.add(new AffidavitSelectionDto(null, "value2", null));
        mockResult.add(new AffidavitSelectionDto(null, null, "value3"));

        // Mock jdbcTemplate.query()
        when(jdbcTemplate.query("SELECT 'table1' AS source, 'value1' AS col FROM do.REFUDEFAFFIDAVIT_AFFIANT " +
                                "UNION ALL " +
                                "SELECT 'table2' AS source, 'value2' AS col FROM do.REFUDEFAFFIDAVIT_AFFIANT " +
                                "UNION ALL " +
                                "SELECT 'table3' AS source, 'value3' AS col FROM do.REFUDEFAFFIDAVIT_AFFIANT",
                                rs -> {
                                    List<AffidavitSelectionDto> rows = new ArrayList<>();
                                    mockResult.forEach(row -> rows.add(row));
                                    return rows;
                                })).thenReturn(mockResult);

        // Create instance of class under test
        YourClassName yourClassInstance = new YourClassName(jdbcTemplate);

        // Call method
        List<AffidavitSelectionDto> actualResult = yourClassInstance.retrieveAffidavitData();

        // Assertions
        assertEquals(mockResult.size(), actualResult.size());
        for (int i = 0; i < mockResult.size(); i++) {
            assertEquals(mockResult.get(i), actualResult.get(i));
        }
    }
}
