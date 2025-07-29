import React from "react";

const RegisterPage: React.FC = () => (
  <div className="h-screen flex items-center justify-center">
    <form className="bg-white p-8 rounded shadow w-96">
      <h2 className="mb-6 text-xl font-semibold">Login</h2>
      <input className="border w-full p-2 mb-4" placeholder="Email" type="email" />
      <input className="border w-full p-2 mb-4" placeholder="Password" type="password" />
      <button className="btn w-full">Login</button>
    </form>
  </div>
);

export default RegisterPage;