import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DataExportService {

    @Autowired
    private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

    public List<RowData> getCombinedRows() {
        String sql = "SELECT 'table1' AS source, column1 AS column FROM table1 " +
                     "UNION ALL " +
                     "SELECT 'table2' AS source, column2 AS column FROM table2 " +
                     "UNION ALL " +
                     "SELECT 'table3' AS source, column3 AS column FROM table3 " +
                     "UNION ALL " +
                     "SELECT 'table4' AS source, column4 AS column FROM table4";

        List<RowData> rows = new ArrayList<>();
        RowData currentRow = new RowData(null, null, null, null);

        namedParameterJdbcTemplate.query(sql, rs -> {
            String source = rs.getString("source");
            String value = rs.getString("column");

            switch (source) {
                case "table1":
                    currentRow.setColumn1(value);
                    break;
                case "table2":
                    currentRow.setColumn2(value);
                    break;
                case "table3":
                    currentRow.setColumn3(value);
                    break;
                case "table4":
                    currentRow.setColumn4(value);
                    rows.add(currentRow);
                    currentRow = new RowData(null, null, null, null); // Prepare for the next row
                    break;
            }
        });

        return rows;
    }
}
