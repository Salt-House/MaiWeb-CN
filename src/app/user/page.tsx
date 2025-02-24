"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import ChinaMap from '../components/ChinaMap';
import { redirect } from 'next/dist/server/api-utils';


export default function UserPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState<string | null>();
  const [isHovered, setIsHovered] = useState(true);
  const [thirdalignment, setthirdalignment] = useState<string | null>(null);
  const [loginHint, setLoginHint] = useState<string | null>("请选择登陆方式");
  const [agree, setAgree] = useState<boolean>(false);
  const [register, setRegister] = useState<boolean>(false);

  const Register = () => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "username": username,
      "email": email,
      "password": password
    });
    console.log(raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch("https://dev.maimai.moe/api/auth/register", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(alert(result)))
      .catch((error) => console.error(error));

  }
  const Login = () => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "");
    urlencoded.append("username", username);
    urlencoded.append("password", password);
    urlencoded.append("scope", "");
    urlencoded.append("client_id", "");
    urlencoded.append("client_secret", "");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    fetch("https://dev.maimai.moe/api/auth/jwt/login", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const data = JSON.parse(result);
        console.log(data);
        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          console.log("开始跳转");
          window.location.href = '/user/profile';
        } else {
          alert("Login Failed")
        }
      })
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!storedToken) {
      const newToken = '';
      localStorage.setItem('token', newToken);
      setToken(newToken);
    } else {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token && token.startsWith('ey')) {
      window.location.href = '/user/profile';
    } else {
      console.log(token);
      console.log('Token invalid');
    }
  }, [token]);

  return (
    <>
      <div className="w-[900px] mt-20  mx-auto relative flex justify-center">
        <div className='w-[450px] h-[600px] bg-[rgb(239,246,255)] rounded-2xl flex flex-row border-4 border-white'>
          {/* 舞萌萌登录与注册 */}
          <div className={`h-full bg-blue-500 p-5 rounded-2xl transition-all duration-300 ease-in-out w-[450px] border-l-4 border-white shadow-lg`}>
            {isHovered ?
              <>
                {register ?
                  <>
                    <div className='h-full flex flex-col p-2 justify-center items-center space-y-2'>
                      <img src="/img/logo.png" className='w-48' alt="" />
                      <h1 className='text-2xl font-bold'>舞萌萌账号注册</h1>
                      <input type="username" id="username" placeholder='username' className=' w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-sm focus:scale-105' value={username} onChange={(e) => setUsername(e.target.value)} />
                      <input type="password" id="password" placeholder='password' className=' w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-sm focus:scale-105' value={password} onChange={(e) => setPassword(e.target.value)} />
                      <input type="email" id="email" placeholder='email' className=' w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-sm focus:scale-105' value={email} onChange={(e) => setEmail(e.target.value)} />
                      <button className='w-32 h-12 border-4 border-white rounded-2xl text-xl font-bold' onClick={Register}>注册</button>
                    </div>
                  </>
                  : <>
                    <div className='h-full flex flex-col p-2 justify-center items-center space-y-2'>
                      <img src="/img/logo.png" className='w-48' alt="" />
                      <h1 className='text-2xl font-bold'>舞萌萌账号登陆</h1>
                      <input type="username" id="username" placeholder='username' className=' w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-sm focus:scale-105' value={username} onChange={(e) => setUsername(e.target.value)} />
                      <input type="password" id="password" placeholder='password' className=' w-[300px] p-1 pl-4 border-2 border-black rounded-2xl text-black focus:shadow-sm focus:scale-105' value={password} onChange={(e) => setPassword(e.target.value)} />
                      <div className='flex flex-row space-x-5'>
                        <button className='w-32 h-12 border-4 border-white rounded-2xl text-xl font-bold hover:scale-105' onClick={Login}>登陆</button>
                        <button className='w-32 h-12 border-4 border-white rounded-2xl text-xl font-bold hover:scale-105' onClick={() => { setRegister(true) }}>注册</button>
                      </div>
                    </div>
                  </>}
              </>
              :
              <>
                <div className='h-full flex flex-col justify-center items-center text-center space-y-5'>
                  <h1 className='w-[80px] font-bold text-2xl'>使用<br></br>舞萌萌</h1>
                  <img src="/img/arrowright.png" onClick={() => setIsHovered(true)} className='animate-leftToRight' alt="" />
                </div>
              </>}

          </div>
        </div>
      </div>
    </>
  );
}