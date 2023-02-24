import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSpring, a } from "@react-spring/web";
import { ThreeDotsLoader } from "../src/features/loader";
import { validateEmail, validatePassword } from "../src/utils/forms/register";
import { useSelector } from "react-redux";
import store, { storeType } from "../redux/configureStore";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { login } from "../redux/actions/userActions";
import Head from "next/head";
import Button from "../src/components/Button";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);

  const [emailError, setEmailError] = useState<null | string>(null);
  const [passwordError, setPasswordError] = useState<null | string>(null);

  const loginStore = useSelector((store: storeType) => store.login);
  const currentUser = useSelector((store: storeType) => store.currentUser);

  const [springs, api] = useSpring(() => ({
    opacity: 0.5,
    y: -60,
    rotateX: 45,
  }));

  useEffect(() => {
    api.start({
      opacity: 1,
      y: 0,
      rotateX: 0,
      config: {
        tension: 200,
        friction: 15,
      },
    });
  }, []);

  useEffect(() => {
    setProcessing(loginStore.loading);
    if (loginStore.error) {
      toast.error(loginStore.error.message);
    }
  }, [loginStore, currentUser]);

  useEffect(() => {
    if (currentUser.user && !currentUser.loading) {
      router.replace("/");
    }
  }, [currentUser.user]);

  const throwError = (error: string | null, type: string) => {
    if (error) setProcessing(false);

    // Throw error
    if (type === "email") {
      setEmailError(error);
    } else if (type === "password") {
      setPasswordError(error);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setEmailError(null);
    setPasswordError(null);
    setProcessing(true);

    // Validate email
    let emailValidationError = validateEmail(email);
    throwError(emailValidationError, "email");

    // Validate password
    let passwordValidationError = validatePassword(password);
    throwError(passwordValidationError, "password");

    // If errors exist, return
    if (emailValidationError || passwordValidationError) return;

    // If no errors, send request to server
    store.dispatch(login(email, password));
  };

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gray-900 form__container w-screen h-screen flex justify-center items-center sm:p-4">
        <a.form
          onSubmit={handleSubmit}
          className="bg-gray-800 w-screen h-screen text-gray-300 font-noto flex flex-col p-6 sm:h-auto sm:rounded sm:max-w-[450px] sm:shadow-lg"
          style={springs}
        >
          <h2 className="text-gray-100 text-xl font-semibold self-center mb-2">
            Welcome back!
          </h2>
          <span className="self-center text-ss">
            {router.query.redirected
              ? "Please login to continue"
              : "We're so excited to see you again!"}
          </span>

          <div className="flex flex-col mt-4">
            <label
              htmlFor="email"
              className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
                emailError && "text-red-300"
              }`}
            >
              Email {emailError && <span className="text-red-300"> - </span>}
              <span className="capitalize font-normal italic text-red-300">
                {emailError ? (
                  `${emailError}`
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email address"
              className="p-3 text-ss bg-gray-900 rounded outline-none text-gray-200 sm:p-2"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex flex-col mt-4">
            <label
              htmlFor="password"
              className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
                passwordError && "text-red-300"
              }`}
            >
              Password{" "}
              {passwordError && <span className="text-red-300">-</span>}
              <span className="capitalize font-normal italic text-red-300">
                {passwordError ? (
                  `${passwordError}`
                ) : (
                  <span className="text-red-500">*</span>
                )}
              </span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="p-3 text-ss bg-gray-900 rounded outline-none text-gray-200 sm:p-2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <Button overrideStyle="mt-6" processing={processing}>
            Log In
          </Button>

          <div className="text-ss text-gray-400 mt-4">
            Need an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </div>
        </a.form>
      </div>
    </>
  );
};

export default Login;
