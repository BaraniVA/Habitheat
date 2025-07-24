import React, { useState } from 'react';

const RegisterView = ({ onRegisterSuccess }: { onRegisterSuccess: () => void }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful!');
        onRegisterSuccess();
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-800">
      <form onSubmit={handleRegister} className="p-8 bg-white rounded shadow-md dark:bg-gray-900 w-96">
        <h2 className="mb-4 text-2xl font-semibold text-center text-gray-800 dark:text-white">Register</h2>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded"
          placeholder="Username"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded"
          placeholder="Email"
          required
        />
        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-2 mb-4 border rounded"
          placeholder="Password"
          type="password"
          required
        />
        <button type="submit" className="w-full py-2 text-white bg-green-600 rounded hover:bg-green-700">Register</button>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-500 underline">Login</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterView;
