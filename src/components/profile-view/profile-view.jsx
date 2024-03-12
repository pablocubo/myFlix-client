import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import FavoriteMovies from '../profile-view/favorite-movies'; // Ensure this is used or remove if unnecessary
import { UpdateUser } from "./update-user";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../movie-card/movie-card'; // Adjust the import path as necessary

const ProfileView = ({ user, setUser, movies, addFav, removeFav }) => {
  const navigate = useNavigate();
  
  // Initialize state with user data
  const [username, setUsername] = useState(user?.UserName || "");
  const [email, setEmail] = useState(user?.Email || "");
  const [birthdate, setBirthdate] = useState(user?.Birthdate || "");

  useEffect(() => {
    setUsername(user?.UserName || "");
    setEmail(user?.Email || "");
    setBirthdate(user?.Birthdate || "");
  }, [user]);

  // Format the birthdate for display
  const formattedBirthday = moment(user?.Birthdate).format('MMMM Do, YYYY');

  // Filter user's favorite movies
  const filteredFavoriteMovies = movies.filter(movie => user?.FavoriteMovies?.includes(movie._id));

  // Determine if a movie is in the user's favorites
  const isMovieFavorite = (movieId) => user?.FavoriteMovies.includes(movieId);

  // Prepare formData with current state values for submission
  const formData = {
    UserName: username,
    Email: email,
    Birthdate: birthdate
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");

    fetch(`https://letflix-0d183cd4a94e.herokuapp.com/users/${user._id}`, {
      method: "PUT",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => response.ok ? response.json() : Promise.reject('Update failed'))
      .then(data => {
        alert("Update successful");
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
      })
      .catch(error => {
        alert(error);
        console.error(error);
      });
  };

  const handleUpdate = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    else if (name === "email") setEmail(value);
    else if (name === "birthdate") setBirthdate(value);
  };

  const handleDeleteAccount = () => {
    const token = localStorage.getItem("token");
    fetch(`https://letflix-0d183cd4a94e.herokuapp.com/users/${user._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }).then((response) => {
      if (response.ok) {
        alert("The account has been successfully deleted.");
        localStorage.clear();
        navigate('/signup');
      } else {
        alert("Something went wrong.");
      }
    });
  };

  return (
    <>
      <Row>
        <Card>
          <Card.Body>
            <Card.Title><h2> Hello {user.username}! </h2></Card.Title>
            <Card.Text>
              <strong>Username:</strong> {user.username}
            </Card.Text>
            <Card.Text>
              <strong>Email:</strong> {user.email}
            </Card.Text>
            <Card.Text>
              <strong>Birthday:</strong> {formattedBirthday}
            </Card.Text>
            <Button onClick={handleDeleteAccount} className="button-delete mt-3" type="submit" variant="danger">
              Delete account
            </Button>
          </Card.Body>
        </Card>
        <Col>
          <UpdateUser
            formData={formData}
            handleUpdate={handleUpdate}
            handleSubmit={handleSubmit}
          />
        </Col>
      </Row>
      <hr />
      <div>
        <h2>Your Favorite Movies</h2>
        <Row xs={1} md={2} className="g-4">
          {filteredFavoriteMovies.map((movie) => (
            <Col key={movie._id}>
              <MovieCard
                movie={movie}
                isFavorite={isMovieFavorite(movie._id)}
                addFav={addFav}
                removeFav={removeFav}
              />
            </Col>
          ))}
        </Row>
      </div>
    </>
  );
};

export default ProfileView;
