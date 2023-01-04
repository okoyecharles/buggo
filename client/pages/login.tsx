import React, { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import store, { storeType } from '../redux/configureStore';
import { useSelector } from 'react-redux';
import { login } from '../redux/actions/userActions';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
// import { validateEmail, validatePassword } from '../components/validation';
// import InlineError from '../components/InlineError';
// import Loader from '../components/Loader';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // const [emailError, setEmailError] = useState('');
  // const [passwordError, setPasswordError] = useState('');
  // const [submit, setSubmit] = useState(false);
  // const [valid, setValid] = useState(false);
  const userLogin = useSelector((store: storeType) => store.login);
  const { loading, error, userInfo } = userLogin;
  const router = useRouter();

  useEffect(() => {
    // validateEmail({ email, setEmailError });
    // validatePassword({ password, setPasswordError });
    // if (emailError || passwordError || !email || !password) {
    //   setValid(false);
    // } else {
    //   setValid(true);
    // }
    if (userInfo) {
      router.push('/');
    }
  }, [userInfo]);
  // [emailError, passwordError, userInfo, navigate, email, password];

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // if(valid) {
    //  store.dispatch(login(email, password));
    // }
    store.dispatch(login(email, password));
    toast.success('Logged In successful');
    // else{
    toast.error(userLogin.error?.message);
    // }
  };

  return (
    <div>
      {loading && <Loader />}
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h2>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={`shadow appearance-none border rounded 
            w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
                ${submit && !email ? 'border-red-500 border-2' : ''}
            `}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {/* {emailError && <InlineError error={emailError} />} */}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className={`shadow appearance-none border rounded 
            w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline
            ${submited && !password ? 'border-red-500 border-2' : ''}
            `}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {passwordError && password && (
                    <InlineError error={passwordError} />
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  onClick={error && notify()}
                >
                  Sign in
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?{' '}
                  <Link
                    href="/register"
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
