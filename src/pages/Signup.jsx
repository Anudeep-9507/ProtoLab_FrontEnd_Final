import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #141515ff 0%, #0e0e0e 100%);
  color: white;
  font-family: 'Inter', sans-serif;
`;

const FormWrapper = styled.div`
  background: #0f0d12;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 20px;
  width: 400px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #ffffff;
  font-weight: 700;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 1.2rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(to right, #103656ff 0%, #28477dff 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ErrorMsg = styled.p`
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 1rem;
  background: rgba(255, 0, 0, 0.1);
  padding: 0.5rem;
  border-radius: 5px;
  width: 100%;
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  
  a {
    color: #fff;
    text-decoration: none;
    font-weight: 600;
    margin-left: 5px;
    border-bottom: 1px solid transparent;
    transition: border-color 0.3s;

    &:hover {
      border-color: white;
    }
  }
`;

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const useNavigateHook = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await signup(name, email, password);
    if (result.success) {
      useNavigateHook('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <Container>
      <FormWrapper>
        <Title>Sign Up for ProtoLab</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit">Sign Up</Button>
        </form>
        <LinkText>
          Already have an account? <Link to="/login">Login</Link>
        </LinkText>
      </FormWrapper>
    </Container>
  );
};

export default Signup;
