import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, Input, Form, Row, Col } from "reactstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = `http://4.237.58.241:3000/movies/data/`;

const featured = ['tt0120915', 'tt0121765', 'tt0121766',
                  'tt4633694', 'tt0361748', 'tt2788710',
                  'tt2582802', 'tt3783958', 'tt0780504',
                  'tt0172495', 'tt1853728', 'tt0209144']

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
          <Col md={10}>
            <Input id="titleSelect" name="title" placeholder='Movie title' />
          </Col>
          <Col>
            <Button type="search">Search</Button>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

// Hero section
const Hero = () => (
  <section className="hero">
    <div className="hero_content">
      <h1 className="hero_title">Movie Finder</h1>
      <p className="hero_subtitle">Find almost any movie</p>
      <SearchBar />
    </div>
  </section>
);


function getRandomUniqueItems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function Featured() {
  const [featuredData, setFeaturedData] = useState([]);

  useEffect(() => {
    const featuredIDs = getRandomUniqueItems(featured, 3);

    Promise.all(
      featuredIDs.map(id =>
        fetch(`${API_URL}${id}`)
          .then(res => res.json())
          .then(data => ({
            heading: data.title || 'Untitled',
            text: data.plot || 'No description available.',
            img: { src: data.poster || 'img/default.jpg', alt: `${data.title} Poster` },
            link: `/movies/${id}`
          }))
      )
    )
      .then(setFeaturedData)
      .catch(error => console.error("Error fetching featured movies:", error));
  }, []);

  return (
    <article className="featured">
      <div className="featured_header">
        <h2>Featured Movies</h2>
      </div>

      <div className="featured_box-wrapper">
        {
          featuredData.map((feature) => (
            <FeatureBox key={feature.heading} feature={feature} />
          ))
        }
      </div>
    </article>
  );
}

// Display a Feature box when passed in the information for the feature
const FeatureBox = ({ feature }) => (
  <div className="featured_box" href={feature.link}>
    <a href={feature.link}>
      <img src={feature.img.src} alt={feature.img.alt} />
      <h5>{feature.heading}</h5>
      <p>{feature.text}</p>
    </a>
  </div>
);

export default function Home() {
  return (
    <main>
      <Hero />
      <Featured />
    </main>
  );
}

