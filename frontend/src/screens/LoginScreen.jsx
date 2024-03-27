import React, { useState,useEffect} from 'react';
import { Link,useNavigate} from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import {useDispatch,useSelector} from 'react-redux'
import { FaEnvelope, FaLock } from 'react-icons/fa'; // Import icons
import { useLoginMutation } from '../slices/usersApiSlice';
import {setCredentials} from '../slices/authSlice';
import Loader from '../components/Loader';
import {toast} from 'react-toastify'

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate =useNavigate()
  const dispatch=useDispatch()

  const [login,{ isLoading }]=useLoginMutation();

  const {userInfo} = useSelector((state)=>state.auth);

  useEffect(()=>{
    if(userInfo){
      navigate('/')
    }
  },[navigate,userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res=await login({email,password}).unwrap();
      console.log(res);
      dispatch(setCredentials({...res}))
      navigate('/')
    } catch (err) {
      toast.error(err?.data?.message || err.error)
      
    }
  };

  return (
    <FormContainer>
      <h1 className="text-center">SIGN IN</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <div className="input-group">
            <span className="input-group-text"><FaEnvelope /></span> {/* Add envelope icon */}
            <Form.Control
              type='email'
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <div className="input-group">
            <span className="input-group-text"><FaLock /></span> {/* Add lock icon */}
            <Form.Control
              type='password'
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Form.Group>
        {/* {isLoading && <Loader />} */}
        <Button type='submit' variant="primary" className="mt-3">Sign In</Button>

        <Row className="py-3">
          <Col className="text-center">
            New Customer? <Link to='/signup'>Signup</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
}

export default LoginScreen;
