import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const CreateListing = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    regularPrice: 50,
    discountPrice: 0,
    bedrooms: 1,
    bathrooms: 1,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleImagesSubmit = (e) => {
    e.preventDefault();

    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      setUploading(true);
      setImageUploadError("");
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError("");
          setUploading(false);
        })
        .catch(() => {
          setUploading(false);
          setImageUploadError("image upload faild (2mb max per image)");
        });
    } else {
      setImageUploadError("you can only upload up to six images");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const removeImage = (i) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, index) => index !== i),
    });
  };

  const handleFormInput = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: !formData[e.target.id] });
    } else if (e.target.type === "number") {
      setFormData({ ...formData, [e.target.name]: Number(e.target.value) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at last one image");
      if (formData.discountPrice > formData.regularPrice)
        return setError("Discount price must be less than regular price");
      setLoading(true);
      setError(false);

      const res = await fetch(`/api/listing/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError(data.message);
        return;
      }
      setFiles([]);
      setFormData({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        regularPrice: 50,
        discountPrice: 0,
        bedrooms: 1,
        bathrooms: 1,
        offer: false,
        parking: false,
        furnished: false,
      });
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center font-semibold my-7 text-3xl">
        Create Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            name="name"
            id="name"
            placeholder="name"
            className="border rounded-lg p-3"
            minLength="10"
            maxLength="65"
            required
            onChange={handleFormInput}
            value={formData.name}
          />
          <textarea
            type="text"
            name="description"
            id="description"
            className="border rounded-lg p-3"
            placeholder="description"
            required
            onChange={handleFormInput}
            value={formData.description}
          />
          <input
            name="address"
            id="address"
            type="text"
            placeholder="address"
            required
            className="border rounded-lg p-3"
            onChange={handleFormInput}
            value={formData.address}
          />
          <div className="flex gap-6  flex-wrap">
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="sale"
                name="type"
                className="w-5"
                onChange={handleFormInput}
                checked={formData.type === "sale"}
                value={"sale"}
              />
              <span>sell</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="rent"
                name="type"
                className="w-5"
                onChange={handleFormInput}
                checked={formData.type === "rent"}
                value={"rent"}
              />
              <span>rent</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                name="parking"
                className="w-5"
                onChange={handleFormInput}
                checked={formData.parking}
              />
              <span>parking spot</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                name="furnished"
                className="w-5"
                onChange={handleFormInput}
                checked={formData.furnished}
              />
              <span>furnished</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="offer"
                name="offer"
                className="w-5"
                onChange={handleFormInput}
                checked={formData.offer}
              />
              <span>offer</span>
            </div>
          </div>
          <div className="flex gap-6  flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border p-3 border-gray-300 rounded-lg"
                name="bedrooms"
                min="1"
                max="10"
                required
                onChange={handleFormInput}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border p-3 border-gray-300 rounded-lg"
                name="bathrooms"
                min="1"
                max="10"
                required
                onChange={handleFormInput}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border p-3 border-gray-300 rounded-lg"
                name="regularPrice"
                min="50"
                max="1000000"
                required
                onChange={handleFormInput}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>

                {formData.type === "rent" && (
                  <span className="text-sm"> ($ / month)</span>
                )}
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  className="border p-3 border-gray-300 rounded-lg"
                  name="discountPrice"
                  min="0"
                  max={formData.regularPrice}
                  required
                  onChange={handleFormInput}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discount price</p>
                  {formData.type === "rent" && (
                    <span className="text-sm"> ($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className=" flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex items-center gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="border border-gray-400 p-3 w-full  rounded"
              type="file"
              name="images"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              onClick={handleImagesSubmit}
              disabled={uploading}
              className="text-green-600 border border-green-600 p-3 rounded-xl  hover:shadow-lg disabled:opacity-80  uppercase text-center "
            >
              {uploading ? "uploading..." : "upload"}
            </button>
          </div>
          <p className="text-red-500 text-center font-semibold">
            {imageUploadError && imageUploadError}
          </p>
          {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, i) => (
              <div key={url} className="flex justify-between items-center">
                <img
                  src={url}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    removeImage(i);
                  }}
                  className="text-red-700 p-2 rounded-lg uppercase border border-red-700 hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))}
          <button
            disabled={loading || uploading}
            className="p-3 bg-gray-500 uppercase rounded-xl text-white hover:opacity-90 disabled:opacity-80"
          >
            {loading ? "Creating..." : " Create Listing"}
          </button>
          <p className="text-center text-red-700 font-semibold">
            {error && error}
          </p>
        </div>
      </form>
    </main>
  );
};
