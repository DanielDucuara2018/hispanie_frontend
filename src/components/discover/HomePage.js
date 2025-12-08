import { Col, Row, Container } from 'react-bootstrap';
import DiscoverCard from './DiscoverCard';
import { Fade } from "react-awesome-reveal";

const HomePage = ({ businesses = [] }) => {
  return (
    <>
      <Container className="my-4">
        <Fade>
          <Row className="text-center">
            {businesses.map((business) => (
              <Col xs={6} sm={4} md={3} lg={2} key={business.id} className="mb-4">
                <DiscoverCard 
                  id={business.id}
                  title={business.name}
                  files={business.files}
                />
              </Col>
            ))}
          </Row>
        </Fade>
      </Container>
    </>
  );
};

export default HomePage;
