import React, { useEffect, useState } from 'react';
import {
  useGetUsersDataMutation,
  useAdminLogoutMutation,
  useDeleteUserMutation,
  useRegisterUsersDataMutation,
  useUpdateUserAdminMutation
} from '../slices/adminApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { Modal, Button, Form, InputGroup, FormControl, Container, Row, Col} from 'react-bootstrap';

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddUserModal,setShowAddUserModal]=useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [formData,setFormData]=useState({
    name:'',
    email:'',
    password:'',
    profilePhoto:null,
  })
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editUserData, setEditUserData] = useState({
  name: '',
  email: '',
  password: '',
  profilePhoto: null,
});

  const [getUsersData] = useGetUsersDataMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [addUser]=useRegisterUsersDataMutation()
  const [logoutAdminApiCall] = useAdminLogoutMutation();
  const [updateUserDetails] =useUpdateUserAdminMutation();
  const { adminInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function fetchUser() {
    try {
      const res = await getUsersData().unwrap('');
      setUsers(res.users);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data. Please try again.');
    }
  }

  useEffect(() => {
    fetchUser();
  }, [getUsersData, navigate]);

  useEffect(()=>{
    setFilteredUsers(users)
  },[users])

  const handleDeleteUser = async (userId) => {
    setUserIdToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser(userIdToDelete).unwrap();
      setUsers(users.filter((user) => user._id !== userIdToDelete));
      setShowDeleteModal(false);
      toast.success('User deleted successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setShowAddUserModal(false);
    setShowEditUserModal(false);
    setFormData({
      name: '',
      email: '',
      password:'',
      profilePhoto: null,
    });
  };

  const handleLogout = async () => {
    try {
      await logoutAdminApiCall().unwrap();
      dispatch(adminLogout());
      navigate("/admin");
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleFormChange=(e)=>{
    if(e.target.name==='profilePhoto'){
      setFormData({
        ...formData,
        [e.target.name]:e.target.files[0]
      });
    }else{
      setFormData({
        ...formData,
        [e.target.name]:e.target.value,
      });
    }
  }

  const handleAddUserSubmit=async(e)=>{
    e.preventDefault();
    try {
      const formDataObj = new FormData();
      formDataObj.append('name',formData.name);
      formDataObj.append('email',formData.email);
      formDataObj.append('password',formData.password)
      formDataObj.append('profilePhoto',formData.profilePhoto)
      console.log(formData)
      await addUser(formDataObj).unwrap();
      setShowAddUserModal(false);
      fetchUser();
      toast.success("User added successfully");
      
    } catch (error) {
      console.log('Error adding user:',error)
      toast.error('Failed to add user.Please try again');
    }
  }
  const handleEditUser = (userId) => {
    const userToEdit = users.find((user) => user._id === userId);
    if (userToEdit) {
      setEditUserId(userId);
      setEditUserData({
        name: userToEdit.name,
        email: userToEdit.email,
        password: '',
        profilePhoto: null, // You may set the profile photo here if needed
      });
      setShowEditUserModal(true);
    }
  };
  
  const handleEditFormChange = (e) => {
    setEditUserData({
      ...editUserData,
      [e.target.name]: e.target.value,
    });
  };
  const handleEditUserSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserDetails({
        userId: editUserId,
        updatedData: editUserData,
      }).unwrap();
      setShowEditUserModal(false);
      fetchUser();
      toast.success('User details updated successfully.');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user details. Please try again.');
    }
  };
  
 const handleSearchInputChange = (e) => {
  const query = e.target.value.toLowerCase();
  setSearchQuery(query);

  setFilteredUsers(
    users.filter((user) =>
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  );
}


  return (
    <div>
      <h1 className="text-center mt-4 mb-4">Dashboard</h1>
      <div className='d-flex justify-content-center'>
      <InputGroup className="" style={{width:'500px'}}>
          <FormControl
            placeholder="Search by name or email"
            aria-label="Search by name"
            aria-describedby="basic-addon2"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <Button variant="secondary" id="button-addon2">
            Search
          </Button>
        </InputGroup>

      </div>
      <div className="d-flex justify-content-end mb-3">
        <button
          type="button"
          className="btn btn-dark"
          onClick={handleAddUser}
        >
          Add New User
        </button>
      </div>
      <div className="row">
        {filteredUsers.map((user) => (
          <div className="col-md-6 mb-4" key={user.id}>
            <div className="card">
              <div className="card-body d-flex align-items-center">
                <img
                  src={`http://localhost:5000/images/${user.profilePhoto}`}
                  alt=""
                  className="rounded-circle me-3"
                  style={{ width: '50px', height: '50px' }}
                />
                <div>
                  <h5 className="card-title">{user.name}</h5>
                  <p className="card-text">{user.email}</p>
                </div>
                <div className="ms-auto">
                  <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete User
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleEditUser(user._id)}
                  >
                    Edit User
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Modal for confirming user deletion */}
      <Modal show={showDeleteModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for add a new User */}
      <Modal show={showAddUserModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddUserSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formProfilePhoto">
              <Form.Label>Profile Photo</Form.Label>
              <Form.Control
                type="file"
                name="profilePhoto"
                onChange={handleFormChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add User
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEditUserModal} onHide={handleCloseModal}>
  <Modal.Header closeButton>
    <Modal.Title>Edit User</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form onSubmit={handleEditUserSubmit}>
      <Form.Group className="mb-3" controlId="editFormName">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          name="name"
          value={editUserData.name}
          onChange={handleEditFormChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="editFormEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          value={editUserData.email}
          onChange={handleEditFormChange}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="editFormPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter new password"
          name="password"
          value={editUserData.password}
          onChange={handleEditFormChange}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Save Changes
      </Button>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseModal}>
      Cancel
    </Button>
  </Modal.Footer>
</Modal>

    </div>
  );
}

export default Dashboard;
