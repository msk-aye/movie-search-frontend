import { Row, Col, Container } from "reactstrap";
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { AgGridReact } from "ag-grid-react";
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-balham.css"
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = `http://4.237.58.241:3000`;

const getAccessToken = async () => {
  const tokenExpiry = localStorage.getItem("tokenExpiry");
  const refreshTokenExpiry = localStorage.getItem("refreshTokenExpiry");

  if (Date.now() > tokenExpiry) {
    if (Date.now() > refreshTokenExpiry) {
      localStorage.clear();
      throw new Error("Session expired. Please log in again.");
    }

    const refreshToken = localStorage.getItem("refreshToken");

    const url = `${API_URL}/user/refresh`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      localStorage.clear();
      throw new Error("Failed to refresh token.");
    }

    const res = await response.json();

    localStorage.setItem("token", res.bearerToken.token);
    localStorage.setItem("refreshToken", res.refreshToken.token);
    localStorage.setItem("tokenExpiry", Date.now() + (res.bearerToken.expires_in - 10) * 1000);
    localStorage.setItem("refreshTokenExpiry", Date.now() + (res.refreshToken.expire_in - 10) * 1000);

    return res.bearerToken.token;
  }

  return localStorage.getItem("token");
};

const Person = async (id, token) => {
  const res = await fetch(`${API_URL}/people/${id}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw new Error("Unauthorized access. Please log in.");
  } else if (res.status === 404) {
    throw new Error("Person not found. Please check the ID.");
  }

  const data = await res.json();

  return {
    name: data.name,
    birthYear: data.birthYear,
    deathYear: data.deathYear,
    roles: data.roles,
  };
};


export default function People() {
  const [personInfo, setPersonInfo] = useState(null);
  const [chartInfo, setChartInfo] = useState([0,0,0,0,0,0,0,0,0]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rowData, setRowData] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const columns = [
    { headerName: "Movie", field: "name" },
    { headerName: "Rating", field: "rating" },
    { headerName: "Role", field: "category" },
    { headerName: "Characters Played", field: "characters" },
    { headerName: "ID", field: "id", hide: true }
  ];

  const chartLabels = ['1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'];

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
  );

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Movie rating distribution',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            if (Number.isInteger(value)) {
              return value;
            }
          }
        },
        beginAtZero: true
      }
    }
  };

  const data = {
    labels: chartLabels,
    datasets: [{
        data: chartInfo.map((number) => number),
        backgroundColor: 'rgba(103, 46, 139, 0.85)',
      },
    ],
  };

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const newToken = await getAccessToken();
        const personInfo = await Person(id, newToken);
        setPersonInfo(personInfo);

        const newChartInfo = Array(9).fill(0);
        personInfo.roles.forEach((role) => {
          const rating = Math.floor(role.imdbRating);
          if (rating >= 1 && rating <= 9) {
            newChartInfo[rating - 1]++;
          }
        });
        setChartInfo(newChartInfo);
        setRowData(personInfo.roles.map((role) => ({
          name: role.movieName,
          category: role.category,
          characters: role.characters.join(', '),
          id: role.movieId,
          rating: role.imdbRating
        })));
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id]);


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <Container style={{ padding: '20px'}}><p>{error.message}</p></Container>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Container>
        <Row>
          <Col>
            <h1>{personInfo.name}</h1>
          </Col>
        </Row>
        <Row>
        </Row>
        <Row>
          <Col xs="12">
            Born: {personInfo.birthYear} {personInfo.deathYear ? ` - Died: ${personInfo.deathYear}` : `(age ${new Date().getFullYear() - personInfo.birthYear} years)`}
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col xs="9" >
            <h2>Movies</h2>
            <div
              className="ag-theme-balham"
              style={{
                height: "300px",
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
                onRowClicked={(row) => navigate(`/movies/${row.data.id}`)} />
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col xs="9" >
            <Bar options={options} data={data} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}

