import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button} from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import {useDispatch,useSelector} from 'react-redux'
import Loader from '../components/Loader';
import {toast} from 'react-toastify'
import { Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {setCredentials} from '../slices/authSlice';
import { useUpdateUserMutation } from '../slices/usersApiSlice';
import { FaUser, FaEnvelope, FaLock,FaCamera} from 'react-icons/fa'; // Import icons

function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePhoto,setProfilePhoto]=useState('');
  const [selectedFile,setSelectedFile]=useState(null)




  const navigate =useNavigate()
  const dispatch=useDispatch()

  const {userInfo} = useSelector((state)=>state.auth);

  const [updateProfile,{isLoading}]=useUpdateUserMutation()

  useEffect(()=>{
    setName(userInfo.name);
    setEmail(userInfo.email);
    if (userInfo.profilePhoto) {
      setProfilePhoto(userInfo.profilePhoto);
    } else {
      setProfilePhoto(null);
    }
  },[userInfo.setName,userInfo.setEmail,userInfo.profilePhoto]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setProfilePhoto(URL.createObjectURL(file));

    const newProfilePhotoURL = URL.createObjectURL(file);
    setProfilePhoto(newProfilePhotoURL);
  };



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
        if (selectedFile) {
          formData.append('profilePhoto', selectedFile);
        }
        const res = await updateProfile(formData).unwrap();
        dispatch(setCredentials({...res}));
        toast.success('Profile-updated');
      } catch (err) {

        toast.error(err?.data?.message || err.error)
        
      }

    }
  };

  const profilePhotoURL=`http://localhost:5000/images/${profilePhoto}`
 
  return (
    <FormContainer>
      <h1 className="text-center">Update Profile</h1>
      <Form onSubmit={submitHandler}>

        {/* Display profile photo if available */}
        {profilePhoto && (
          <Form.Group className='my-2'>
            <Form.Label></Form.Label>
            <Image src={profilePhotoURL} alt="Profile" style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
          </Form.Group>
        )}
         {/* Button to trigger file input */}
         <div className="d-flex justify-content-center align-items-center">
          <Button variant="primary" className="me-3" onClick={() => document.getElementById('fileInput').click()}>
            <FaCamera /> Change Photo
          </Button>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
  
          />
        </div>

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

        <Button type='submit' variant="primary" className="mt-3">Update</Button>

      </Form>
    </FormContainer>
  );
}

export default ProfileScreen;
