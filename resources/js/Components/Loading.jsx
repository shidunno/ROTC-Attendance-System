import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import Loading from '@/Components/Loading';

export default function Login() {
  const { data, setData, post, processing } = useForm({
    email: '',
    password: '',
  });

  const submit = (e) => {
    e.preventDefault();
    post('/Login');
  };

  return (
    <form onSubmit={submit}>
      {/* your email/password inputs */}

      <button type="submit" disabled={processing}>
        {processing ? <Loading size="sm" /> : 'Log In'}
      </button>
    </form>
  );
}