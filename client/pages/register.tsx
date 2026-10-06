import React, { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useSpring, a } from "@react-spring/web";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from "@/core/utils/validation/register";
import { useSelector } from "react-redux";
import store, { storeType } from "@/redux/configureStore";
import { useRouter } from "next/router";
import { register, AUTH_TOAST_ID } from "@/redux/actions/userActions";
import { toast } from "react-toastify";
import Head from "next/head";
import Compressor from "compressorjs";
import { toBase64 } from "@/core/utils/image/convert";
import Button from "@/core/components/button";
import Image from "next/image";
import avatars from "@/core/assets/avatar";

const Register = () => {
  const router = useRouter();
  const currentUser = useSelector((store: storeType) => store.currentUser);
  const registerStore = useSelector((store: storeType) => store.register);
  const [signingUp, setSigningUp] = useState(false);

  const [name, setName] = useState<string>("");
  const [nameError, setNameError] = useState<null | string>(null);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<null | string>(null);
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<null | string>(null);
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState<
    null | string
  >(null);
  const [image, setImage] = useState<File | Blob | null>(null);
  const [convertingImage, setConvertingImage] = useState(false);
  const [base64Image, setBase64Image] = useState<string>("");

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
    if (currentUser.user) {
      if (signingUp) {
        toast.success("Signed up successfully", { toastId: AUTH_TOAST_ID });
      } else {
        toast.success("You're already signed in", { toastId: AUTH_TOAST_ID });
      }
      router.replace("/dashboard");
    }
  }, [currentUser]);

  const showError = (error: string | null, type: string) => {
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

    // Validate name
    let nameValidationError = validateName(name);
    if (nameValidationError) return showError(nameValidationError, "name");

    // Validate email
    let emailValidationError = validateEmail(email);
    if (emailValidationError) return showError(emailValidationError, "email");

    // Validate password
    let passwordValidationError = validatePassword(password);
    if (passwordValidationError)
      return showError(passwordValidationError, "password");

    // Validate password confirmation
    let passwordConfirmationValidationError = validateConfirmPassword(
      password,
      passwordConfirmation,
    );
    if (passwordConfirmationValidationError)
      return showError(
        passwordConfirmationValidationError,
        "passwordConfirmation",
      );

    const formData = {
      name,
      email,
      password,
      image: base64Image || avatars[Math.floor(Math.random() * avatars.length)],
    };
    setSigningUp(true);
    await store.dispatch(register(formData));
    setSigningUp(false);
  };

  useEffect(() => {
    async function convertImage() {
      try {
        setConvertingImage(true);
        if (image) {
          const imageFile = await toBase64(image as File | Blob);
          setBase64Image(imageFile as string);
        } else {
          setBase64Image("");
        }
      } finally {
        setConvertingImage(false);
      }
    }
    convertImage();
  }, [image]);

  return (
    <>
      <Head>
        <title>Buggo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-gray-900 form__container w-screen h-screen flex justify-center items-center sm:p-4">
        <a.form
          onSubmit={handleSubmit}
          className="bg-gray-850 sm:bg-gray-800 w-screen h-screen text-gray-300 font-noto flex flex-col p-6 sm:h-auto sm:rounded sm:max-w-[450px] sm:shadow-lg"
          style={springs}
        >
          <div className="self-center mb-4 mt-4 sm:hidden">
            <Image
              src={"/text-logo.png"}
              height={22}
              width={110}
              alt="buggo"
              className="w-auto h-auto"
            />
          </div>
          <h2 className="text-gray-100 text-xl font-semibold self-center mb-1">
            Create an account
          </h2>

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
              className="p-3 text-ss bg-gray-950 sm:bg-gray-900 rounded outline-none text-gray-200 sm:p-2"
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
              className="p-3 text-ss bg-gray-950 sm:bg-gray-900 rounded outline-none text-gray-200 sm:p-2"
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
              className="p-3 text-ss bg-gray-950 sm:bg-gray-900 rounded outline-none text-gray-200 sm:p-2"
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
              className="p-3 text-ss bg-gray-950 sm:bg-gray-900 rounded outline-none text-gray-200 sm:p-2"
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
              className="block bg-gray-950 sm:bg-gray-900"
              onChange={(event) => {
                if (event.target.files?.length) {
                  // Compress image
                  new Compressor(event.target.files[0], {
                    checkOrientation: true,
                    strict: true,
                    convertSize: 5000000,
                    maxWidth: 100,
                    quality: 0.8,
                    success(result) {
                      setImage(result);
                    },
                  });
                } else {
                  setImage(null);
                }
              }}
            />
          </div>

          <Button
            overrideStyle="mt-6"
            processing={registerStore.pending || convertingImage}
          >
            Continue
          </Button>

          <div className="text-ss text-gray-400 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Login
            </Link>
          </div>
        </a.form>
      </div>
    </>
  );
};

export default Register;
