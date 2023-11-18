import { useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

export const CreateListing = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({ imageUrls: [] });
  const [imageUploadError, setImageUploadError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImagesSubmit = (e) => {
    e.preventDefault();

    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      setLoading(true);
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
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
          setImageUploadError("image upload faild (2mb max per image)");
        });
    } else {
      setImageUploadError("you can only upload up to six images");
      setLoading(false);
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
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center font-semibold my-7 text-3xl">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col flex-1 gap-4">
          <input
            type="text"
            name="name"
            placeholder="name"
            className="border rounded-lg p-3"
            minLength="10"
            maxLength="65"
            required
          />
          <textarea
            type="text"
            name="description"
            className="border rounded-lg p-3"
            placeholder="description"
            required
          />
          <input
            name="address"
            type="text"
            placeholder="address"
            required
            className="border rounded-lg p-3"
          />
          <div className="flex gap-6  flex-wrap">
            <div className="flex gap-2 ">
              <input type="checkbox" id="sell" name="sell" className="w-5" />
              <span>sell</span>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="rent" name="rent" className="w-5" />
              <span>rent</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="parking"
                name="parking"
                className="w-5"
              />
              <span>parking spot</span>
            </div>
            <div className="flex gap-2 ">
              <input
                type="checkbox"
                id="furnished"
                name="furnished"
                className="w-5"
              />
              <span>furnished</span>
            </div>
            <div className="flex gap-2 ">
              <input type="checkbox" id="offer" name="offer" className="w-5" />
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
              />
              <p>Baths</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border p-3 border-gray-300 rounded-lg"
                name="regularPrice"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                <span className="text-sm">($ / month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                className="border p-3 border-gray-300 rounded-lg"
                name="discountPrice"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col items-center">
                <p>Discount price</p>
                <span className="text-sm">($ / month)</span>
              </div>
            </div>
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
              disabled={loading}
              className="text-green-600 border border-green-600 p-3 rounded-xl  hover:shadow-lg disabled:opacity-80  uppercase text-center "
            >
              {loading ? "uploading..." : "upload"}
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
          <button className="p-3 bg-gray-500 uppercase rounded-xl text-white hover:opacity-90 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};
