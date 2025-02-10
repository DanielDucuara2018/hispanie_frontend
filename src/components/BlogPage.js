import React, { Component } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link from React Router

class BlogPage extends Component {
  render() {
    const featuredArticle = {
      title: "NHE, a medium that promotes the Latin American community in Nantes",
      date: "September 2023",
      description:
        "In September 2023, a small platform called 'Nantes Habla Español' was created, dedicated to Hispanic culture. On their Instagram page, you can find the latest Latin American cultural news in Nantes.",
      imageUrl:
        "https://hispanie.com/cdn/shop/articles/Frame_268.jpg?v=1736214955&width=1500",
      articleUrl: "/news/nhe-latin-american-community-nantes",
    };

    const recentNews = [
      {
        title: "Hispanie 2025: A New Focus Centered on Our Clients' Needs",
        date: "January 7, 2025",
        author: "Geovanny Cipriani",
        description:
          "2025 begins with a significant change for Hispanie. After a month of conversations with our current and future users, we have reached a key discovery: the true need...",
        imageUrl:
          "https://hispanie.com/cdn/shop/articles/Frame_268.jpg?v=1736214955&width=1500",
        articleUrl: "/news/hispanie-2025-new-focus",
      },
      {
        title: "Hispanie: A Step Forward with Emprelatam",
        date: "November 1, 2024",
        author: "Geovanny Cipriani",
        description:
          "At Hispanie, we are excited to share news that marks a before and after in our journey as promoters of Hispanic culture and talent. Our project, known for its...",
        imageUrl:
          "https://hispanie.com/cdn/shop/articles/1729829257187.jpg?v=1732288466&width=1500",
        articleUrl: "/news/hispanie-emprelatam",
      },
    ];

    return (
      <Container className="my-5">
        <Row className="mb-4">
          <Col>
            <h1 className="fw-bold">Latest News</h1>
          </Col>
        </Row>

        <Row className="mb-5">
          <Col>
            <Card className="h-100">
              <Link to={featuredArticle.articleUrl} className="text-decoration-none">
                <Card.Img
                  variant="top"
                  src={featuredArticle.imageUrl}
                  alt={featuredArticle.title}
                  style={{ height: "400px", objectFit: "cover" }}
                />
                <Card.Body>
                  <Card.Title className="fw-bold text-dark">{featuredArticle.title}</Card.Title>
                  <Card.Text className="text-muted">{featuredArticle.date}</Card.Text>
                  <Card.Text className="text-dark">{featuredArticle.description}</Card.Text>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        </Row>

        <Row>
          {recentNews.map((news, index) => (
            <Col md={6} key={index} className="mb-4">
              <Link to={news.articleUrl} className="text-decoration-none">
               <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={news.imageUrl}
                    alt={news.title}
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  <Card.Body>
                    <Card.Title className="text-dark fw-bold fs-5">{news.title}</Card.Title>
                    <Card.Text className="text-muted">
                      {news.date} by {news.author}
                    </Card.Text>
                    <Card.Text className="text-dark">{news.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    );
  }
}

export default BlogPage;
