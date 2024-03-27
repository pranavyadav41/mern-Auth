import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import {useDispatch,useSelector} from 'react-redux'
import Loader from '../components/Loader';
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import {setCredentials} from '../slices/authSlice';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa'; // Import icons
import { useRegisterMutation } from '../slices/usersApiSlice';

function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePhoto,setProfilePhoto]=useState(null)


  const navigate =useNavigate()
  const dispatch=useDispatch()

  const [register,{ isLoading }]=useRegisterMutation();

  const {userInfo} = useSelector((state)=>state.auth);

  useEffect(()=>{
    if(userInfo){
      navigate('/')
    }
  },[navigate,userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    }else{
      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('profilePhoto', profilePhoto);

        console.log(formData)

        const res=await register(formData).unwrap();
        dispatch(setCredentials({...res}))
        navigate('/') 

        
      } catch (err) {
        console.log(err)
      }

    }
  };
 
  return (
    <FormContainer>
      <h1 className="text-center">SIGN UP</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='name'>
          <Form.Label>Name</Form.Label>
          <div className="input-group">
            <span className="input-group-text"><FaUser /></span>
            <Form.Control
              type='text'
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </Form.Group>

        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <div className="input-group">
            <span className="input-group-text"><FaEnvelope /></span>
            <Form.Control
              type='email'
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </Form.Group>

        <Form.Group controlId="profilePhoto">
          <Form.Label>Profile Photo</Form.Label>
          <Form.Control
            type="file"
            accept=".jpg,.png,.jpeg" // Specify accepted file types
            onChange={(e)=>setProfilePhoto(e.target.files[0])} // Handle file change
          />
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <div className="input-group">
            <span className="input-group-text"><FaLock /></span>
            <Form.Control
              type='password'
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Form.Group>

        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <div className="input-group">
            <span className="input-group-text"><FaLock /></span>
            <Form.Control
              type='password'
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </Form.Group>

        {/* {isLoading && <Loader/>} */}

        <Button type='submit' variant="primary" className="mt-3">Sign Up</Button>

        <Row className="py-3">
          <Col className="text-center">
            Already have an account? <Link to='/signin'>Sign In</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  );
}

export default SignupScreen;
