import { Badge, Row, Col, Container } from "reactstrap";
import { AgGridReact } from "ag-grid-react";
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-balham.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { API_URL } from "../config/api";

const Moviee = (id) => {
  return (
    fetch(`${API_URL}/movies/data/${id}`)
      .then(res => res.json())
      .then(data => ({
          title: data.title,
          year: data.year,
          runtime: data.runtime,
          genres: data.genres,
          country: data.country,
          principals: data.principals,
          ratings: data.ratings,
          boxoffice: data.boxoffice,
          poster: data.poster,
          plot: data.plot,
      }))
  )
}

export default function Movie() {
  const [movieInfo, setMovieInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const columns = [
    { headerName: "Name", field: "name" },
    { headerName: "Role", field: "category" },
    { headerName: "Characters", field: "characters" },
    { headerName: "ID", field: "id", hide: true }
  ];

  useEffect( () => {
      Moviee(id).then((movieInfo) => {
        setMovieInfo(movieInfo);
        setRowData(movieInfo.principals.map((principal) => ({
          name: principal.name,
          category: principal.category,
          characters: principal.characters.join(', '),
          id: principal.id
        })));
      }).catch((error) => {
        setError(error);
      }).finally(() => {
        setLoading(false);
      });
    }, [id],
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong: {error.message}</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Container>
        <Row>
          <Col>
            <h1>{movieInfo.title}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            {Array.from({ length: movieInfo.genres.length }, (_, i) => {
              return (
                <Badge color="secondary" key={i} style={{ margin: '1px' }}>
                  {movieInfo.genres[i]}
                </Badge>
              );
            })}
          </Col>
        </Row>
        <Row>
          <Col xs="2">
            Released: {movieInfo.year}
          </Col>
          <Col xs="3">
            Runtime: {movieInfo.runtime} minutes
          </Col>
        </Row>
        <Row>
          <Col xs="4" >
            Countries: {movieInfo.country}
          </Col>
        </Row>
        <Row>
          <Col xs="2">
            IMDb: {movieInfo.ratings[0].value}
          </Col>
          <Col xs="1">
            RT: {movieInfo.ratings[1].value || "--"}
          </Col>
          <Col xs="1" >
            MC: {movieInfo.ratings[2].value || "--"}
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col xs="9" >
            <h4>Plot</h4>
            <p>{movieInfo.plot}</p>

            <h4>Principals</h4>

            <div
              className="ag-theme-balham"
              style={{
                height: "300px",
                spacing: "100px",

              }}
            >
              <AgGridReact
                columnDefs={columns}
                rowData={rowData}
                defaultColDef={{
                  flex: 1,
                  minWidth: 100,
                  resizable: true
                }}
                pagination={false}
                paginationPageSize={20}
                onRowClicked={(row) => navigate(`/people/${row.data.id}`)} />
            </div>
          </Col>
          <Col xs="3" style={{ display: "flex", justifyContent: "center" , alignItems: "start"}}>
            <img src={movieInfo.poster} alt="Movie Poster" style={{ maxWidth: '200px', marginTop: '50px' }} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

