import { useEffect, useState } from 'react';
import './App.css';
import MovieForm from './components/MovieForm';
import UserForm from './components/UserForm';

const apiUrl = 'http://localhost:4000';

function App() {
  const [movies, setMovies] = useState([]);


  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + localStorage.getItem('jwt')
      }
    }
    fetch(`${apiUrl}/movie`, options)
      .then(res => res.json())
      .then(res => {
        setMovies(res.data)
      });
  }, []);

  const handleRegister = async ({ username, password }) => {

    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      }),
    }
    fetch(`${apiUrl}/user/register`, options)
    .then(res => res.json())
    .then(json => console.log('Registered user:' + json.data.username))
    .catch(() => console.log('Failed to register user'))
  };

  const handleLogin = async ({ username, password }) => {
    
    const options = {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }
    fetch(`${apiUrl}/user/login`, options)
    .then(res => {
      res.json().then(json => {
        if(res.ok) {
          console.log('Captains Log, got token: ' + json.data)
          localStorage.setItem('jwt', json.data)

          const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            }
          }
          fetch(`${apiUrl}/movie`, options)
          .then(res => res.json())
          .then(res => setMovies(res.data));
        } else {
          console.log("Login Failed", res.status)
        }
      })
    })
  };
  
  const handleCreateMovie = async ({ title, description, runtimeMins }) => {

    const options = {
      method: 'POST',
      headers : { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      body : JSON.stringify({ 
        title: title, 
        description: description, 
        runtimeMins: runtimeMins
      })
    }
    fetch(`${apiUrl}/movie`, options)
    .then(res => {
      res.json().then(json => {
        if (res.ok) {
          console.log("movie created:", json)
          setMovies([...movies, json.data])
        } else {
          console.log("Invalid response code: ", res.status)
        }
      })
    })
    .catch(() => console.log('Connection Error: ', + res.status))
  }

  return (
    <div className="App">
      <h1>Register</h1>
      <UserForm handleSubmit={handleRegister} />

      <h1>Login</h1>
      <UserForm handleSubmit={handleLogin} />

      <h1>Create a movie</h1>
      <MovieForm handleSubmit={handleCreateMovie} />

      <h1>Movie list</h1>
      <ul>
        {movies.map(movie => {
          return (
            <li key={movie.id}>
              <h3>{movie.title}</h3>
              <p>Description: {movie.description}</p>
              <p>Runtime: {movie.runtimeMins}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;