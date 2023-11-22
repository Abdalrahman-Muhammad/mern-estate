import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
export const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (err) => {
        console.log(err);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handelInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      setUpdateSuccess(false);
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      setUpdateSuccess(false);
    }
  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }
      dispatch(deleteUserSuccess());
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch(`/api/auth/signOut`, {
        method: "GET",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
      }
      dispatch(signOutUserSuccess());
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);

      const res = await fetch(`api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);

        return;
      }
      setListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success === false) return console.log(data.message);

      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          name="file"
          ref={fileRef}
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => fileRef.current.click()}
        />
        <p className="self-center text-sm">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-green-700">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>

        <input
          onChange={handelInputChange}
          defaultValue={currentUser.username}
          type="text"
          placeholder="username"
          name="username"
          className=" rounded-lg p-3  border"
        />
        <input
          onChange={handelInputChange}
          defaultValue={currentUser.email}
          type="text"
          placeholder="email"
          name="email"
          className=" rounded-lg p-3  border"
        />
        <input
          onChange={handelInputChange}
          type="password"
          placeholder="password"
          name="password"
          className=" rounded-lg p-3  border"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-xl hover:opacity-95 disabled:opacity-60 uppercase"
        >
          {loading ? "Loading ..." : " Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="bg-green-600 text-white p-3 rounded-xl hover:opacity-95  uppercase text-center"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="cursor-pointer text-red-600"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="cursor-pointer text-blue-600">
          Sign out
        </span>
      </div>
      <p className="text-red-700 text-center">{error ? error : ""}</p>
      <p className="text-green-700 text-center">
        {updateSuccess ? "User updated Successfully" : ""}
      </p>
      <button
        onClick={handleShowListings}
        className="border border-green-800 rounded-xl mt-5 font-semibold text-green-800 w-full p-3"
      >
        Show Listing
      </button>
      <p className="text-red-700 text-center font-semibold">
        {showListingsError && "Error showing Listing"}
      </p>

      {listings && listings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-slate-600 mt-7 text-center text-2xl">
            Your Listings
          </h1>
          {listings.map((list) => (
            <div
              key={list._id}
              className="flex justify-between border gap-4 shadow-md p-3 items-center rounded-lg"
            >
              <Link to={`/listings/${list._id}`}>
                <img
                  src={list.imageUrls[0]}
                  alt="list img"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                to={`/listing/${list._id}`}
                className="flex-1 text-slate-700 font-semibold hover:underline  truncate"
              >
                <p className="">{list.name}</p>
              </Link>
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => handleListingDelete(list._id)}
                  className="bg-red-600 text-white p-2 rounded-lg hover:opacity-80 w-16"
                >
                  Delete
                </button>
                <Link to={`/update-listing/${list._id}`}>
                  <button className="bg-blue-600 text-white p-2 rounded-lg hover:opacity-80 w-16">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
