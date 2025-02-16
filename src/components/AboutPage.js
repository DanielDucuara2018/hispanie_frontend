import React from 'react';
import { Container, Row, Col, Card, Carousel, Button, Image } from 'react-bootstrap';
import { Link } from "react-router-dom"; // Import Link from React Router

const founders = [
  {
    name: "Geovanny Cipriani",
    role: "Co-founder of Hispanie and Chief Strategy Officer",
    img: "https://d3skpo6i31hl4s.cloudfront.net/JOSE_GEOVANNY_CIPRIANI_MELO.webp",
  },
  {
    name: "Daniel Ducuara",
    role: "Co-founder of Hispanie and Chief Technical Officer",
    img: "https://d3skpo6i31hl4s.cloudfront.net/daniel_ducuara.webp",
  },
  {
    name: "Jhonatan Mcniven Cagua Herrera",
    role: "Co-founder of Hispanie and Chief Information Officer",
    img: "https://d3skpo6i31hl4s.cloudfront.net/Jhonatan_Mcniven_Cagua_Herrera.webp",
  },
  {
    name: "Marlee Lorena Orozco Ponciano",
    role: "Co-founder of Hispanie and Chief Operating Officer",
    img: "https://d3skpo6i31hl4s.cloudfront.net/Marlee_Lorena_OROZCO_PONCIANO.jpg",
  },
];

const news = [
  {
    title: "Hispanie 2025: Un Nuevo Enfoque Centrado en las Necesidades de Nuestros Clientes",
    date: "January 7, 2025 by Geovanny Cipriani",
    description:
      "El 2025 comienza con un cambio trascendental para Hispanie. Después de un mes de conversaciones con nuestros usuarios actuales y futuros, hemos llegado a un descubrimiento clave: la verdadera necesidad...",
    img: "https://d3skpo6i31hl4s.cloudfront.net/Frame_268.webp",
    articleUrl: "/news/hispanie-2025-new-focus",
  },
  {
    title: "Hispanie: Un Paso Adelante con Emprelatam",
    date: "November 1, 2024 by Geovanny Cipriani",
    description:
      "At Hispanie, we are excited to share news that marks a before and after in our journey as promoters of Hispanic culture and talent. Our project, known for its...",
    img: "https://d3skpo6i31hl4s.cloudfront.net/1729829257187.webp",
    articleUrl: "/news/hispanie-emprelatam",
  },
];

const AboutPage = () => {
  return (
    <Container className="my-5">
      {/* Header Section */}
      <Row className="text-center mb-4">
        <Col lg={8} className="mx-auto">
          <h1 className="fw-bold display-4">We promote Hispanic talent in the world. 🎺💃🌮</h1>
          <p className="text-muted bg-light p-2 d-inline-block">
            A space to connect, highlight, and celebrate our culture in non-Spanish speaking countries.
          </p>
        </Col>
      </Row>

      {/* Carousel Section */}
      <Container className="px-0" style={{ maxWidth: "2000px" }}>
        <Carousel interval={3000} controls indicators>
          {[
            "https://d3skpo6i31hl4s.cloudfront.net/438034831_439161225288054_294823861381885919_n.webp",
            "https://d3skpo6i31hl4s.cloudfront.net/A4_-_1.webp",
          ].map((src, index) => (
            <Carousel.Item key={index}>
              <img className="d-block w-100" src={src} alt={`Slide ${index + 1}`} />
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>

      {/* Quote Section */}
      <Row className="py-5 text-center">
        <Col lg={8} className="mx-auto">
          <h2 className="fw-bold mb-3">“The goal is to feel at home, even when you are far away from it”</h2>
          <p className="text-muted">- Marlee Lorena Orozco, Co-founder of Hispanie</p>
          <p className="text-muted">
            <strong>Hispanie</strong> was born from the personal experience of its founders in France, who, living far from home, felt the deep need to connect with their culture and language.
          </p>
          <Button variant="dark" className="px-4 py-2 rounded-3 shadow-sm" href="https://www.fragil.org/nhe-un-media-qui-anime-la-communaute-latino-americaine-a-nantes/" target="_blank" rel="noopener noreferrer">
            Read Article
          </Button>
        </Col>
      </Row>

      {/* Problem & Solution Section */}
      <Row className="bg-danger-subtle text-center py-4">
        <Col lg={8} className="mx-auto">
          <p className="text-uppercase text-muted small mb-2">THE PROBLEM</p>
          <p className="fw-bold fs-4">The Spanish-speaking community lacked a visible and accessible space where they could connect and be more visible.</p>
        </Col>
      </Row>

      <Container fluid className="px-0" style={{ maxWidth: "2000px" }}>
        <Row className="g-0">
          <Col md={6}>
            <Image src="https://d3skpo6i31hl4s.cloudfront.net/339102017_691932599367059_694060988015042085_n.webp" alt="Empanadas" className="w-100 h-100 object-fit-cover" />
          </Col>
          <Col md={6}>
            <Image src="https://d3skpo6i31hl4s.cloudfront.net/385695194_713524004149958_9119451599706317295_n.webp" alt="Mexican Flag Performance" className="w-100 h-100 object-fit-cover" />
          </Col>
        </Row>


        <Row className="bg-danger text-center py-4">
          <Col lg={8} className="mx-auto">
            <p className="text-uppercase text-muted small mb-2">OUR SOLUTION</p>
            <p className="fw-bold fs-4">Connecting the Hispanic community with events, products, and talent in non-Hispanic countries.</p>
            <p className="text-muted small">Providing a space to experience and support Hispanic traditions and cultural expressions worldwide.</p>
          </Col>
        </Row>

        <Row className="text-center g-0">
          <Col>
            <video controls className="w-100 rounded-3 shadow">
              <source src="https://d3skpo6i31hl4s.cloudfront.net/c6707df9daa445fa8151ba10525ef52c.HD-720p-3.0Mbps-38867015.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Col>
        </Row>
      </Container>

      <Row  fluid className="py-5 d-flex justify-content-center align-items-center text-center">
        <Col lg={8} className="mx-auto">
          <p className="text-uppercase text-muted small mb-2">Our Vision</p>
          <p className="fw-bold fs-4">
            Becoming the leading platform that connects Hispanic culture with the world
          </p>
          <p className="text-muted small mb-2">
            Being the reference point to discover, live, and support the cultural wealth of Spanish-speaking countries.          
          </p>     
        </Col>
      </Row>

      {/* Founders Section */}
      <Row className="py-5">
        <Col><h3 className="fw-bold">Founders</h3></Col>
      </Row>

      <Row>
        {founders.map((person, index) => (
          <Col md={3} key={index}>
            <Card className="h-100 text-center">
              <Card.Img variant="top" src={person.img} style={{ height: "350px", objectFit: "cover" }} />
              <Card.Body>
                <Card.Title className="fw-bold fs-5">{person.name}</Card.Title>
                <Card.Text>{person.role}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Company News */}
      <Row className="py-5">
        <Col><h3 className="fw-bold">Company News:</h3></Col>
      </Row>

      <Row>
        {news.map((post, index) => (
          <Col md={6} key={index}>
            <Link to={post.articleUrl} className="text-decoration-none">
              <Card className="h-100">
                <Card.Img variant="top" src={post.img} />
                <Card.Body>
                  <Card.Title className="fw-bold fs-5">{post.title}</Card.Title>
                  <Card.Text className="text-muted">{post.date}</Card.Text>
                  <Card.Text>{post.description}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default AboutPage;
