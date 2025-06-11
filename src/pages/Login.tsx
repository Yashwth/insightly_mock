import  { useState } from 'react';
import {useLoginMutation} from '../api/userService';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login,{data, error, isLoading}] = useLoginMutation();
    const [useremail,setUserEmail] = useState('');
    const [password,setPassword] = useState('');

  const handleLogin = async () => {
    
    try {
      const res = await login({
        initialEmail: useremail,
        password: password,
        captchaResponse: ''
      }).unwrap();
      console.log(res);

      dispatch(setUser(res));
      localStorage.setItem('user', JSON.stringify(res));

      if (res) navigate('/dashboard');
    } catch (err: any) {
      console.log(err);
      alert("login failed");
    }
  };


  return (
    <div className ="border border-gray-300 p-4 rounded">
        {isLoading ?(<div>Loading...</div>):(
      <div>
      <h2 className='text-2xl font-bold mb-6'>Login Test</h2>
      <div className='flex flex-col gap-4 '>
      <input className='border border-gray-300 p-2 rounded' type="text" placeholder="Email" value={useremail} onChange={(e) => setUserEmail(e.target.value)} />
      <input className='border border-gray-300 p-2 rounded' type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button style={{backgroundColor: isLoading ? 'blue' : 'gray', color: 'white', cursor: 'pointer'}} onClick={handleLogin}>Login</button>
      </div>
    </div>
      )}
      {data && (
        <pre>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
      {error && (
        <pre>
          {JSON.stringify(error, null, 2)}
        </pre>
      )}
    </div>
    
  );
};

export default Login;
