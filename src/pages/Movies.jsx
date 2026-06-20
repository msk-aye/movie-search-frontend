import React, { useState, useEffect } from "react";
import { Button, Input, Form, Row, Col } from "reactstrap";
import { AgGridReact } from "ag-grid-react";
import { useNavigate, useSearchParams} from "react-router-dom";
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-quartz.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_URL } from "../config/api";

const SearchBar = () => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('all');
  const [page] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (title) params.append('title', title);
    if (year) params.append('year', year);
    if (page) params.append('page', page);

    if (params.toString()) {
      navigate(`/movies?${params.toString()}`);
    }
  };

  return (
    <div>
      <Form inline="true" onSubmit={handleSubmit} onChange={(e) => {
        if (e.target.id === 'titleSelect') {
          setTitle(e.target.value);
        } else if (e.target.id === 'yearSelect') {
          setYear(e.target.value);
        }
        }}>
        <Row>
          <Col md={9}>
            <Input id="titleSelect" name="title" placeholder='Movie title' />
          </Col>
          <Col md={2}>
            <Input id="yearSelect" name="year" type="select" defaultValue="All years">
              <option value="all">All years</option>
              {Array.from({ length: 2023 - 1990 + 1 }, (_, i) => {
                const year = 2023 - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </Input>
          </Col>
          <Col>
            <Button type="search">Search</Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default function Movies() {
  const [rowData, setRowData] = useState([]);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const title = searchParams.get('title');
  const year = searchParams.get('year');
  const page = searchParams.get('page');


  const columns = [
    { headerName: "Title", field: "title" },
    { headerName: "Year", field: "year" },
    { headerName: "IMBd", field: "imbd" },
    { headerName: "Rotten Tomatoes", field: "rt", valueFormatter: (value) => value.value ? value.value : '--' },
    { headerName: "Metacritic", field: "mc", valueFormatter: (value) => value.value ? value.value : '--' },
    { headerName: "Rating", field: "rating", valueFormatter: (value) => value.value ? value.value : '--' },
    { headerName: "ID", field: "id", hide: true }
  ];

    useEffect(() => {
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (year & year !== 'all') params.append('year', year);
      if (page) params.append('page', page);

      fetch(`${API_URL}/movies/search?${params.toString()}`)
        .then(res => res.json())
        .then(json => {
          if (json.error) {
            throw new Error(json.message);
          }
          return json;
        })
        .then(json => json.data)
        .then(data =>
          data.map(movie => {
            return {
              title: movie.title,
              year: movie.year,
              imbd: movie.imdbRating,
              rt: movie.rottenTomatoesRating,
              mc: movie.metacriticRating,
              rating: movie.classification,
              id: movie.imdbID
            };
          })
        )
        .then(movies => setRowData(movies))
        .catch(error => {
          console.error("Error fetching movies:", error);
        });
      }, [title, year, page]);

  return (
    <div className='container' style={{ marginTop: "20px", marginBottom: "20px" }}>
      <h1>Movie Search</h1>
      <SearchBar/>
      <p>
        Showing {rowData.length} results
      </p>
      <div
        className="ag-theme-quartz"
        style={{
          height: "500px",
        }}
      >
        <AgGridReact
          columnDefs={columns}
          rowData={rowData}
          defaultColDef={{
            flex: 1,
            minWidth: 100,
            resizable: true,
            filter: true,
          }}
          pagination={true}
          paginationPageSize={20}  // maybe change but get warning
          onRowClicked={(row) => navigate(`/movies/${row.data.id}`)}
          />
      </div>
    </div>
  );
}