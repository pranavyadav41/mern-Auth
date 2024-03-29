 import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector,useDispatch} from 'react-redux';
const HomeScreen = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const containerStyles = {
    backgroundColor: "#E0E0E0", 
    width: "1000px",
    height: "300px",
    border: "0.5px solid #A0A0A0",
  };


  return (
    <Container className="mt-5" style={containerStyles}>
      <Row className="justify-content-center">
        <Col md={8} lg={6} className="text-center mt-5">
          <h1>MERN Authentication</h1>
          <p className="mt-3">Welcome to MERN authentication web application 💻</p>
          <div className="mt-4">
            {userInfo ? null : (
              <>
                <LinkContainer to="/signin">
                  <Button variant="secondary">Sign In</Button>
                </LinkContainer>
                <LinkContainer to="/signup">
                  <Button variant="dark" className="ms-2">Sign Up</Button>
                </LinkContainer>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default HomeScreen;
