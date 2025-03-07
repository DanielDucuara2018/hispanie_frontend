import React, { Component } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Button, Badge, Row, Col, Container, Tabs, Tab, Image, ListGroup } from 'react-bootstrap';
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
              <Col xs={12} sm={3} md={2} className="text-center mb-3 mb-sm-0">
                <Image
                  src={data.files.find((x) => x.category === "profile_image")?.path}
                  roundedCircle
                  fluid
                  className="shadow-sm"
                  style={{ width: '150px', height: '150px' }}
                />
              </Col>
              {/* Name & Association */}
              <Col xs={12} sm={6} className="text-center text-sm-start">
                <h2 className="fw-bold">{data.name}</h2>
                <h5 className="text-muted">
                  {data.category.charAt(0).toUpperCase() + data.category.slice(1)}
                </h5>
                <div>
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
                </div>
              </Col>
              {/* Save & Share Buttons */}
              <Col xs={12} sm={3} className="d-flex justify-content-center justify-content-sm-end mt-3 mt-sm-0 gap-2">
                <SaveButton />
                <ShareButton />
              </Col>
            </Row>
          </Card>

          <Row className="mt-4">
            {/* Left Section - Tabs */}
            <Col xs={12}>
              <Tabs defaultActiveKey="info" className="mb-3">
                <Tab eventKey="info" title="Information">
                  <Row className="g-3">
                    {/* Description Section */}
                    <Col xs={12} md={8}>
                      <Card className="p-4 shadow">
                        <Card.Header as="h5" className="fw-bold bg-white border-0">
                          Description
                        </Card.Header>
                        <Card.Body style={{ whiteSpace: 'pre-line' }}>{data.description}</Card.Body>
                      </Card>
                    </Col>
                    {/* Contact and Follow Sections */}
                    <Col xs={12} md={4}>
                      <Row className="g-3">
                        {/* Contact Section */}
                        <Col xs={12}>
                          <Card className="p-4 shadow h-100">
                            <Card.Header as="h5" className="fw-bold bg-white border-0">
                              Contact
                            </Card.Header>
                            <Card.Body>
                              <ListGroup variant="flush">
                                {data.email && (
                                  <ListGroup.Item className="bg-transparent border-0 px-0">
                                    <h6 className="my-1">
                                      <a href={`mailto:${data.email}`} className="text-decoration-none text-dark">
                                        <MdOutlineMail size={24} className="me-3" />
                                        {data.email}
                                      </a>
                                    </h6>
                                  </ListGroup.Item>
                                )}
                                {data.phone && (
                                  <ListGroup.Item className="bg-transparent border-0 px-0">
                                    <h6 className="my-1">
                                      <a href={`tel:${data.phone}`} className="text-decoration-none text-dark">
                                        <BsTelephone size={24} className="me-3" />
                                        {data.phone}
                                      </a>
                                    </h6>
                                  </ListGroup.Item>
                                )}
                                {data.social_networks?.find((x) => x.category === 'web')?.url && (
                                  <ListGroup.Item className="bg-transparent border-0 px-0">
                                    <h6 className="my-1">
                                      <a
                                        href={data.social_networks.find((x) => x.category === 'web').url}
                                        className="text-decoration-none text-dark"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <TbWorld size={24} className="me-3" />
                                        Visit our website
                                      </a>
                                    </h6>
                                  </ListGroup.Item>
                                )}
                              </ListGroup>
                            </Card.Body>
                          </Card>
                        </Col>
                        {/* Follow Section */}
                        <Col xs={12}>
                          <Card className="p-4 shadow h-100">
                            <Card.Header as="h5" className="fw-bold bg-white border-0">
                              Follow
                            </Card.Header>
                            <Card.Body>
                              {data.social_networks?.find((x) => x.category === 'facebook')?.url && (
                                <Button
                                  variant="outline-dark"
                                  className="w-100 mb-2"
                                  href={data.social_networks.find((x) => x.category === 'facebook').url}
                                  target="_blank"
                                >
                                  <FaFacebook size={24} className="me-3" /> Follow on Facebook
                                </Button>
                              )}
                              {data.social_networks?.find((x) => x.category === 'instagram')?.url && (
                                <Button
                                  variant="outline-dark"
                                  className="w-100"
                                  href={data.social_networks.find((x) => x.category === 'instagram').url}
                                  target="_blank"
                                >
                                  <FaInstagram size={24} className="me-3" /> Follow on Instagram
                                </Button>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="events" title="Events">
                  <Card className="p-4 shadow mt-3">
                    <Card.Header as="h5" className="fw-bold bg-white border-0">
                      Upcoming Events
                    </Card.Header>
                    <Card.Body>No events available</Card.Body>
                  </Card>
                </Tab>
                <Tab eventKey="course" title="Course">
                  <Card className="p-4 shadow mt-3">
                    <Card.Header as="h5" className="fw-bold bg-white border-0">
                      Courses Offered
                    </Card.Header>
                    <Card.Body>No courses available</Card.Body>
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
