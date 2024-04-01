import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class CollectionDetailsDaoImplTest {

    @Mock
    private DatabaseOperationHandler databaseOperationHandler;

    @Mock
    private CollectionDetailsRequest request;

    @InjectMocks
    private CollectionDetailsDaoImpl collectionDetailsDao;

    @Test
    public void testGetCollectionDetails() {
        // Mocking databaseOperationHandler to return a dummy list
        List<PreCollectionDetails> dummyList = Collections.singletonList(new PreCollectionDetails());
        when(databaseOperationHandler.executeReadStoredProcedure(any(), any(), any())).thenReturn(dummyList);

        // Mocking request parameters
        when(request.getReceiverGp()).thenReturn("ReceiverGP");
        when(request.getStartDate()).thenReturn("2024-01-01");
        when(request.getEndDate()).thenReturn("2024-01-31");
        when(request.getUniqueid()).thenReturn("uniqueId");
        when(request.getProduct()).thenReturn("product");

        // Calling the method under test
        List<PreCollectionDetails> result = collectionDetailsDao.getCollectionDetails(request);

        // Assertions
        assertEquals(dummyList, result);
    }
    
    @Test
    public void testGetCollectionDetails_NullRequest() {
        // Calling the method under test with null request
        List<PreCollectionDetails> result = collectionDetailsDao.getCollectionDetails(null);

        // Assertions
        assertEquals(Collections.emptyList(), result);
    }
}
