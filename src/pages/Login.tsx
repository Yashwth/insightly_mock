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

      if (res) window.location.href = '/dashboard/org-goals';
    } catch (err: any) {
      console.log(err);
      alert("login failed");
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 to-indigo-500 p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-4">
          <img
            src="src\assets\logo-primary-collapsed.svg"
            className="h-8 w-8 text-indigo-600"
            
          />
        </div>
  
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6 ">Log in</h2>
        <p className="text-sm text-center text-gray-500 mb-6 p-2">
          Get started with insightly.
        </p>
  
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={useremail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
  
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
      
          </div>
  
         
  
          <button
            className={`w-full py-2 rounded-md text-white font-medium transition ${
              isLoading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 hover:rounded-full'
            }`}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </div>
  
      
        {data && (
          <pre className="mt-4 p-2 bg-green-100 text-green-800 rounded text-sm overflow-x-auto">
            Successfull 
          </pre>
        )}
  
        {error && (
          <pre className="mt-4 p-2 bg-red-100 text-red-700 rounded text-sm overflow-x-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};  

export default Login;
