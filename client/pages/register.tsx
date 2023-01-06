import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSpring, a } from "@react-spring/web";
import Loader from "../components/Loader";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "../utils/formValidation";
import { useSelector } from "react-redux";
import store, { storeType } from "../redux/configureStore";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { register } from "../redux/actions/userActions";
import Head from "next/head";
import Compressor from "compressorjs";
import { toBase64 } from "../utils/imageHelper";

const Register = () => {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [image, setImage] = useState<File | Blob | null>(null);
  const [base64Image, setBase64Image] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");

  const [nameError, setNameError] = useState<null | string>(null);
  const [emailError, setEmailError] = useState<null | string>(null);
  const [passwordError, setPasswordError] = useState<null | string>(null);
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<
    null | string
  >(null);

  const [processing, setProcessing] = useState<boolean>(false);
  const registerStore = useSelector((store: storeType) => store.register);
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
    setProcessing(registerStore.loading);
    if (registerStore.error) {
      toast.error(registerStore.error.message);
    }
    if (currentUser?.user) {
      router.replace("/");
      toast.success("Signed Up successfully");
    }
  }, [registerStore, currentUser]);

  const throwError = (error: string | null, type: string) => {
    if (error) setProcessing(false);

    // Throw error
    if (type === "name") {
      setNameError(error);
    } else if (type === "email") {
      setEmailError(error);
    } else if (type === "password") {
      setPasswordError(error);
    } else if (type === "passwordConfirmation") {
      setPasswordConfirmationError(error);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setNameError(null);
    setEmailError(null);
    setPasswordError(null);
    setPasswordConfirmationError(null);
    setProcessing(true);

    // Validate name
    let nameValidationError = validateName(name);
    throwError(nameValidationError, "name");

    // Validate email
    let emailValidationError = validateEmail(email);
    throwError(emailValidationError, "email");

    // Validate password
    let passwordValidationError = validatePassword(password);
    throwError(passwordValidationError, "password");

    // Validate password confirmation
    let passwordConfirmationValidationError = validateConfirmPassword(
      password,
      passwordConfirmation
    );
    throwError(passwordConfirmationValidationError, "passwordConfirmation");

    // If errors exist, return
    if (
      emailValidationError ||
      passwordValidationError ||
      passwordConfirmationValidationError ||
      nameError ||
      !image
    )
      return;

    const formData = { name, email, password, image: base64Image };
    store.dispatch(register(formData));
  };

  useEffect(() => {
    async function convertImage() {
      // Convert image to base64
      if (image) {
        console.log("converting image to base64");
        const imageFile = await toBase64(image as File | Blob);
        setBase64Image(imageFile as string);
      } else {
        setBase64Image("");
      }
    }
    convertImage();
  }, [image]);

  return (
    <>
      <Head>
        <title>Register</title>
      </Head>
      <div className="bg-gray-900 form__container w-screen h-screen flex justify-center items-center sm:p-4">
        <a.form
          onSubmit={handleSubmit}
          className="bg-gray-800 w-screen h-screen text-gray-300 font-noto flex flex-col p-6 sm:h-auto sm:rounded sm:max-w-[450px] sm:shadow-lg"
          style={springs}
        >
          <h2 className="text-gray-100 text-xl font-semibold self-center mb-2">
            Create an account
          </h2>
          <span className="self-center text-ss">
            One step closer to tracking bugs 😎
          </span>

          {/* Name  Field */}
          <div className="flex flex-col mt-4">
            <label
              htmlFor="name"
              className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
                nameError && "text-red-300"
              }`}
            >
              Full Name {nameError && <span className="text-red-300"> - </span>}
              <span className="capitalize font-normal italic text-red-300">
                {nameError ? `${nameError}` : ""}
              </span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your full name"
              className="p-3 text-ss bg-gray-900 rounded outline-none text-gray-200 sm:p-2"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          {/* Email field */}
          <div className="flex flex-col mt-4">
            <label
              htmlFor="email"
              className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
                emailError && "text-red-300"
              }`}
            >
              Email {emailError && <span className="text-red-300"> - </span>}
              <span className="capitalize font-normal italic text-red-300">
                {emailError ? `${emailError}` : ""}
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

          {/* Password field */}
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
                {passwordError ? `${passwordError}` : ""}
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

          {/* Password Confirmation field */}
          <div className="flex flex-col mt-4">
            <label
              htmlFor="passwordConfirmation"
              className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
                passwordConfirmationError && "text-red-300"
              }`}
            >
              Confirm Password{" "}
              {passwordConfirmationError && (
                <span className="text-red-300">-</span>
              )}
              <span className="capitalize font-normal italic text-red-300">
                {passwordConfirmationError
                  ? `${passwordConfirmationError}`
                  : ""}
              </span>
            </label>
            <input
              type="password"
              id="passwordConfirmation"
              name="passwordConfirmation"
              placeholder="Confirm your password"
              className="p-3 text-ss bg-gray-900 rounded outline-none text-gray-200 sm:p-2"
              value={passwordConfirmation}
              onChange={(event) => setPasswordConfirmation(event.target.value)}
            />
          </div>

          {/* Image select fiield */}
          <div className="flex flex-col mt-4">
            <label
              htmlFor="avatar"
              className="mb-1 uppercase font-bold text-xsm flex items-center gap-1"
            >
              Profile Image
            </label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              accept="image/*"
              onChange={(event) => {
                if (event.target.files?.length) {
                  // Compress image
                  new Compressor(event.target.files[0], {
                    checkOrientation: true,
                    strict: true,
                    convertSize: 5000000,
                    maxWidth: 200,
                    quality: 0.8,
                    success(result) {
                      console.log("compressed image", result.size);
                      setImage(result);
                    },
                  });
                } else {
                  setImage(null);
                }
              }}
            />
          </div>

          <button
            className="font-open font-semibold p-3 text-ss mt-6 bg-blue-600 text-white rounded hover:bg-blue-700 hover:text-blue-100 disabled:opacity-80 disabled:cursor-not-allowed  transition flex justify-center"
            disabled={processing}
          >
            {processing ? <Loader /> : "Continue"}
          </button>

          <p className="text-ss text-gray-400 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </a.form>
      </div>
    </>
  );
};

export default Register;
