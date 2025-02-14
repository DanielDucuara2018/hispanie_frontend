import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Badge, Row, Col, Container, Tabs, Tab, Image } from 'react-bootstrap';
import { LuShare } from "react-icons/lu";

const DiscoverDetailWithParams = (props) => <DiscoverDetail {...props} params={useParams()} />;

// TODO merged DiscoverDetail and EventDetail, they have almost the same structure
class DiscoverDetail extends Component {

  render() {
    const { businesses , params } = this.props;
    const data = businesses.find(x => x.id === String(params.id));

    if (!data) return <p>Business not found</p>;

    return (
      <>
        {/* Image */}
        <Card.Img
          variant="top"
          src={data.files.find((x) => x.category === "cover_image").path}
          style={{ height: '400px', objectFit: 'cover', borderRadius: '0.5rem 0.5rem 0 0' }}
        />
    
        <Container className="my-5">
          {/* Header */}
          <Card className="p-4 border-0">
            <Row className="align-items-center">
              {/* Profile Image */}
              <Col xs={2} className="text-center">
                <Image 
                  src={data.files.find((x) => x.category === "profile_image").path} 
                  roundedCircle
                  className="mb-3 shadow-sm"
                  width={100} 
                  height={100} 
                />
              </Col>
              {/* Name & Association */}
              <Col xs={6}>
                <h2 className="fw-bold">{data.name}</h2>
                <h5 className="text-muted">Association</h5>
                <Badge bg="light" text="dark" className="me-2">France 🇫🇷</Badge>
                <Badge bg="light" text="dark">Cuba 🇨🇺</Badge>
              </Col>
              {/* Save & Share Buttons */}
              <Col xs={4} className="text-end">
                <Button variant="dark" className="me-2">Save</Button>
                <Button variant="outline-dark"><LuShare /></Button>
              </Col>
            </Row>
          </Card>

          <Row className="mt-4">
            {/* Left Section - Tabs */}
            <Col md={16}>
              <Tabs defaultActiveKey="info" className="mb-3">
                <Tab eventKey="info" title="Information">
                  <Row className="g-3">
                    {/* Description, Contact, and Follow at the same level */}
                    <Col md={8}>
                      <Card className="p-4 shadow">
                        <h4 className="fw-bold">Description:</h4>
                        <p>{data.description}</p>
                      </Card>
                    </Col>
                    <Col md={4} className="d-flex flex-column gap-3">
                      {/* Contact */}
                      <Card className="p-4 shadow flex-grow-1">
                        <h5 className="fw-bold">Contact:</h5>
                        <p>📧 {data.email}</p>
                        <p>📞 {data.phone}</p>
                        <p>🌐 {data.website}</p>
                      </Card>
                      {/* Follow */}
                      <Card className="p-4 shadow flex-grow-1">
                        <h5 className="fw-bold">Follow:</h5>
                        <Button variant="outline-dark" className="w-100 mb-2">Follow on Facebook</Button>
                        <Button variant="outline-dark" className="w-100">Follow on Instagram</Button>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="events" title="Events">
                  <Card className="p-4 shadow mt-3">
                    <h4 className="fw-bold">Upcoming Events:</h4>
                    <p>No events available</p>
                  </Card>
                </Tab>
                <Tab eventKey="course" title="Course">
                  <Card className="p-4 shadow mt-3">
                    <h4 className="fw-bold">Courses Offered:</h4>
                    <p>No courses available</p>
                  </Card>
                </Tab>
              </Tabs>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default DiscoverDetailWithParams;
