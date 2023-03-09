import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../features/modal";
import Image from "next/image";
import Compressor from "compressorjs";
import { toBase64 } from "../../utils/strings/image";
import store from "../../../redux/configureStore";
import { updateUser } from "../../../redux/actions/userActions";
import { ThreeDotsLoader } from "../../features/loader";
import { User } from "../../types/models";
import avatars from "../../assets/avatar";

interface EditProfileModalProps {
  open: boolean;
  setOpen: any;
  user: User | null;
  loading: boolean;
  method: any;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  open,
  setOpen,
  user,
  loading,
  method,
}) => {
  const [name, setName] = useState(user?.name || "");
  const [nameError, setNameError] = useState<string | null>(null);
  const [image, setImage] = useState<File | Blob | null>(null);
  const [base64Image, setBase64Image] = useState<string>(user?.image || "");
  const nameInputRef = React.useRef<HTMLInputElement>(null);
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const [processing, setProcessing] = useState(false);

  const handleEdit = (event: React.FormEvent) => {
    event.preventDefault();
    setNameError(null);

    if (!name) {
      setNameError("Name is required");
      return;
    }
    if (name.length < 5) {
      setNameError("Name must be at least 5 characters");
      return;
    }
    if (name.length > 25) {
      setNameError("Name cannot exceed 25 characters");
      return;
    }

    const userData = { name, image: base64Image };
    store.dispatch(updateUser(userData));
  };

  const isEdited = useMemo(() => {
    return name !== user?.name || base64Image !== user?.image;
  }, [name, user, base64Image]);

  const openImageSelector = (event: any) => {
    event.preventDefault();
    imageInputRef.current?.click();
  };

  useEffect(() => {
    setProcessing(loading);
    if (open && !loading && !method.update) {
      setOpen(false);
    }
  }, [loading, method]);

  useEffect(() => {
    if (open) {
      setName(user?.name || "");
      setBase64Image(user?.image || "");
      setNameError(null);
    }
  }, [open]);

  useEffect(() => {
    async function convertImage() {
      // Convert image to base64
      if (image) {
        const imageFile = await toBase64(image as File | Blob);
        setBase64Image(imageFile as string);
      } else {
        setBase64Image(avatars[Math.floor(Math.random() * avatars.length)]);
      }
    }
    convertImage();
  }, [image]);

  return (
    <Modal open={open} setOpen={setOpen} style={{ padding: 0 }}>
      <div className="p-4">
        <header>
          <h2 className="text-lg font-semibold text-white">Edit Profile</h2>
        </header>

        <div className="content mt-2">
          <form
            action=""
            className="flex flex-col"
            ref={formRef}
            onSubmit={handleEdit}
          >
            <div className="flex flex-col mt-4">
              <label
                htmlFor="name"
                className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1 ${
                  nameError && "text-red-300"
                }`}
              >
                Name {nameError && <span className="text-red-300"> - </span>}
                <span className="capitalize font-normal italic text-red-300">
                  {nameError ? `${nameError}` : ""}
                </span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                ref={nameInputRef}
                placeholder="First and last name"
                className="p-3 text-ss bg-gray-950 rounded outline-none text-gray-200 mb-1 sm:p-2"
                value={name}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                  }
                }}
              />
            </div>

            <div className="mt-4">
              <div
                className={`mb-1 uppercase font-bold text-xsm flex items-center gap-1`}
              >
                Avatar
              </div>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="avatarEdit"
                  className="relative flex w-fit rounded-full"
                >
                  <Image
                    src={base64Image || avatars[0]}
                    alt="Profile image"
                    width={75}
                    height={75}
                    className="rounded-full h-16 w-16 object-center object-cover bg-gray-700"
                  />
                  <input
                    ref={imageInputRef}
                    type="file"
                    id="avatarEdit"
                    name="avatarEdit"
                    className="fixed -top-10 -left-10 opacity-0"
                    accept="image/*"
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
                      }
                    }}
                  />
                </label>
                <div>
                  <button
                    className="flex gap-1 items-center px-3 p-2 bg-blue-600 text-green-50 rounded-sm font-semibold text-sm hover:bg-blue-700 active:bg-blue-800 transition-colors"
                    onClick={openImageSelector}
                  >
                    Change Avatar
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="flex gap-2 bg-gray-850 p-4 py-3 justify-end">
        <button
          className="px-6 p-2 hover:underline text-white font-semibold"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
        <button
          className="px-6 p-2 bg-blue-600 text-green-50 rounded-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-75 disabled:cursor-not-allowed"
          disabled={(processing && method.delete) || !isEdited}
          onClick={() => formRef.current?.requestSubmit()}
        >
          {processing && method.update ? <ThreeDotsLoader /> : "Save"}
        </button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
