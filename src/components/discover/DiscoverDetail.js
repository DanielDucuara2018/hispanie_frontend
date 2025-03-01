import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Badge, Row, Col, Container, Tabs, Tab, Image } from 'react-bootstrap';
import { FaInstagram, FaFacebook  } from 'react-icons/fa';
import { BsTelephone } from "react-icons/bs";
import { MdOutlineMail } from "react-icons/md";
import { TbWorld } from "react-icons/tb";
import ShareButton from '../../hooks/ShareButton';
import SaveButton from '../../hooks/SaveButton';

const DiscoverDetailWithParams = (props) => <DiscoverDetail {...props} params={useParams()} />;

// TODO merged DiscoverDetail and EventDetail, they have almost the same structure
class DiscoverDetail extends Component {

  render() {
    const { businesses , params } = this.props;
    const data = businesses.find(x => x.id === String(params.id));

    if (!data) return <p>Business not found</p>;

    console.log(data.social_networks)

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
                  width={150} 
                  height={150} 
                />
              </Col>
              {/* Name & Association */}
              <Col xs={6}>
                <h2 className="fw-bold">{data.name}</h2>
                <h5 className="text-muted">{data.category.charAt(0).toUpperCase() + data.category.slice(1)}</h5>
                {data.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    bg="light"
                    text="dark"
                    className="me-2"
                    style={{ fontSize: "0.9rem" }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </Col>
              {/* Save & Share Buttons */}
              <Col xs="auto" className="d-flex gap-2">
                <SaveButton />
                <ShareButton /> 
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
                        <h6 className="my-3">
                          <a href={`mailto:${data.email}`} className="text-decoration-none text-dark">
                            <MdOutlineMail size={24} className="me-3" />
                            {data.email}
                          </a>
                        </h6>
                        <h6 className="my-3">
                          <a href={`tel:${data.phone}`} className="text-decoration-none text-dark">
                            <BsTelephone size={24} className="me-3" />
                            {data.phone}
                          </a>
                        </h6>
                        <h6 className="my-3">
                          <a
                            href={data.social_networks.find((x) => x.category === 'web').url}
                            className="text-decoration-none text-dark"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <TbWorld size={24} className="me-3" />
                            Visit our web site
                          </a>
                        </h6>
                      </Card>
                      {/* Follow */}
                      <Card className="p-4 shadow flex-grow-1">
                        <h5 className="fw-bold">Follow:</h5>
                        <Button
                          variant="outline-dark"
                          className="w-100 mb-2"
                          href={data.social_networks.find((x) => x.category === "facebook").url}
                          target="_blank"
                        >
                          <FaFacebook size={24} className="me-3" /> Follow on Facebook
                        </Button>
                        <Button
                          variant="outline-dark"
                          className="w-100"
                          href={data.social_networks.find((x) => x.category === "instagram").url}
                          target="_blank"
                        >
                          <FaInstagram size={24} className="me-3" /> Follow on Instagram
                        </Button>
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
