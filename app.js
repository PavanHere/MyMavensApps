// src/TableWithPagination.js
import React, { useMemo, useState, useEffect } from 'react';
import { useTable, usePagination, useFilters } from 'react-table';
import axios from 'axios';
import './TableStyles.css';

const ColumnFilter = ({ column: { filterValue, setFilter, Header } }) => (
  <input
    value={filterValue || ''}
    onChange={(e) => setFilter(e.target.value || undefined)}
    placeholder={`Search ${Header}`}
    className="form-control"
    style={{ marginBottom: '10px' }}
  />
);

const TableWithPagination = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the local JSON file
    axios.get('/data.json')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'First Name',
        accessor: 'firstName',
        Filter: ColumnFilter,
      },
      {
        Header: 'Last Name',
        accessor: 'lastName',
        Filter: ColumnFilter,
      },
      {
        Header: 'Country',
        accessor: 'country',
        Filter: ColumnFilter,
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useFilters,
    usePagination
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div>
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  {column.render('Header')}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination-info">
        <div>
          Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, data.length)} of {data.length} entries
        </div>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 40, 50].map(size => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <ul className="pagination">
        <li className={`page-item ${!canPreviousPage ? 'disabled' : ''}`}>
          <button onClick={() => previousPage()} disabled={!canPreviousPage} className="page-link">
            {'<<'}
          </button>
        </li>
        {Array.from({ length: pageCount }, (_, index) => (
          <li key={index} className={`page-item ${index === pageIndex ? 'active' : ''}`}>
            <button onClick={() => gotoPage(index)} className="page-link">
              {index + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${!canNextPage ? 'disabled' : ''}`}>
          <button onClick={() => nextPage()} disabled={!canNextPage} className="page-link">
            {'>>'}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default TableWithPagination;


// src/SideBySideForm.js
import React, { useState } from 'react';
import TableWithPagination from './TableWithPagination';

const SideBySideForm = () => {
  const [showTable, setShowTable] = useState(false);

  const handleSearch = (event) => {
    event.preventDefault();
    setShowTable(true);
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSearch}>
        <div className="row mb-3">
          <div className="col">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input type="text" className="form-control" id="firstName" placeholder="First Name" />
          </div>
          <div className="col">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input type="text" className="form-control" id="lastName" placeholder="Last Name" />
          </div>
          <div className="col">
            <label htmlFor="country" className="form-label">Country</label>
            <select id="country" className="form-select">
              <option value="">Select a country</option>
              <option value="usa">United States</option>
              <option value="canada">Canada</option>
              <option value="uk">United Kingdom</option>
              <option value="australia">Australia</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col text-center">
            <button type="submit" className="btn btn-primary">Search</button>
          </div>
        </div>
      </form>

      {showTable && <TableWithPagination />}
    </div>
  );
};

export default SideBySideForm;


[
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" },
  { "firstName": "John", "lastName": "Doe", "country": "USA" },
  { "firstName": "Jane", "lastName": "Smith", "country": "Canada" }
  
]



/* src/TableStyles.css */

.table {
    width: 100%;
    border-collapse: collapse;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .table th, .table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }
  
  .table th {
    background-color: #007bff;
    color: #fff;
    font-weight: 600;
  }
  
  .table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  .table tbody tr:hover {
    background-color: #f1f1f1;
  }
  
  .table tfoot {
    background-color: #f9f9f9;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    margin: 0;
    list-style: none;
  }
  
  .pagination .page-item {
    margin: 0 5px;
  }
  
  .pagination .page-link {
    border: 1px solid #007bff;
    background-color: #fff;
    color: #007bff;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 14px;
    transition: background-color 0.3s, color 0.3s;
  }
  
  .pagination .page-link:hover {
    background-color: #007bff;
    color: #fff;
  }
  
  .pagination .page-link.disabled {
    border: 1px solid #ddd;
    background-color: #f1f1f1;
    color: #aaa;
    cursor: not-allowed;
  }
  
  .pagination .page-item.active .page-link {
    background-color: #007bff;
    color: #fff;
    font-weight: 600;
  }
  
  .pagination-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
  }
  


