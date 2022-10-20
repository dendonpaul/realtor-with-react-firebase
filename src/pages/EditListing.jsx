import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate, useParams } from "react-router";

const EditListing = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState(null);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    description: "",
    offer: true,
    regularPrice: 0,
    discountedPrice: 0,
    latitude: 0,
    longitude: 0,
    images: {},
  });
  const params = useParams();
  useEffect(() => {
    if (listings && listings.userRef !== auth.currentUser.uid) {
      toast.error("You cannot edit this listing");
      navigate("/");
    }
  }, [auth.currentUser.uid, listings, navigate]);

  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListings(docSnap.data());
        setFormData({ ...docSnap.data() });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exists");
      }
    };
    fetchListing();
  }, [navigate, params.listingId]);

  const onChange = (e) => {
    let boolean = null;
    if (e.target.value === "true") boolean = true;
    if (e.target.value === "false") boolean = false;
    if (e.target.files) setFormData({ ...formData, images: e.target.files });
    if (!e.target.files)
      setFormData({ ...formData, [e.target.id]: boolean ?? e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (formData.discountedPrice > formData.regularPrice) {
        setLoading(false);
        toast.error("Discounted Price should be lower regular price");
        return;
      }
      if (formData.images.length > 6) {
        setLoading(false);
        toast.error("You can only add 6 images at a time");
        return;
      }

      let geolocation = {};
      let location;
      if (geoLocationEnabled) {
        console.log(process.env.GEOCODE_API_KEY);
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${formData.address}&key=${process.env.REACT_APP_GEOCODE_API_KEY}`
        );

        const data = await response.json();
        console.log(data);
        geolocation.lat = data.results[0]?.geometry.location.lat ?? 0;
        geolocation.lng = data.results[0]?.geometry.location.lng ?? 0;

        location = data.status === "ZERO_RESULTS" && undefined;
        if (location === undefined) {
          setLoading(false);
          toast.error("Please enter valid address");
          return;
        }
      } else {
        geolocation.lat = formData.latitude;
        geolocation.lng = formData.longitude;
      }

      const storeImage = async (image) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
          const storageRef = ref(storage, filename);

          const uploadTask = uploadBytesResumable(storageRef, image);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              // Handle unsuccessful uploads
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      };

      const imgUrls = await Promise.all(
        [...formData.images].map((image) =>
          storeImage(image).catch((error) => {
            setLoading(false);
            toast.error("Images not uploaded");
            return;
          })
        )
      );
      const formDataCopy = {
        ...formData,
        imgUrls,
        geolocation,
        timestamp: serverTimestamp(),
        userRef: auth.currentUser.uid,
      };
      delete formDataCopy.images;
      delete formDataCopy.latitude;
      delete formDataCopy.longitude;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;
      const docRef = await updateDoc(
        doc(db, "listings", params.listingId),
        formDataCopy
      );
      setLoading(false);
      toast.success("Listing Edited");
      //   navigate(`/category/${formData.type}/${docRef.id}`);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading) return <Spinner />;
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Edit Listing</h1>
      <form onSubmit={onSubmit}>
        <p className="text-lg mt-6 font-semibold">Sell/Rent</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="type"
            name="type"
            value="sale"
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              formData.type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            onClick={onChange}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            name="type"
            value="rent"
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              formData.type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            onClick={onChange}
          >
            Rent
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Name</p>
        <input
          type="text"
          id="name"
          name="name"
          maxLength="32"
          minLength="10"
          placeholder="Name"
          required
          value={formData.name}
          onChange={onChange}
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-200 focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        <div className="flex gap-4 mb-6">
          <div className="">
            <p className="text-lg font-semibold">Beds</p>
            <input
              type="number"
              name="bedrooms"
              id="bedrooms"
              value={formData.bedrooms}
              min="1"
              max="50"
              required
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
          <div className="">
            <p className="text-lg font-semibold">Baths</p>
            <input
              type="number"
              name="bathrooms"
              id="bathrooms"
              value={formData.bathrooms}
              min="1"
              max="50"
              required
              onChange={onChange}
              className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-200 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600 text-center"
            />
          </div>
        </div>

        <p className="text-lg mt-6 font-semibold">Parking</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="parking"
            name="parking"
            value="true"
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              formData.parking
                ? "bg-slate-600 text-white"
                : "bg-white text-black"
            }`}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            type="button"
            id="parking"
            name="parking"
            value="false"
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              !formData.parking
                ? "bg-slate-600 text-white"
                : "bg-white text-black"
            }`}
            onClick={onChange}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="furnished"
            name="furnished"
            value="true"
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              formData.furnished
                ? "bg-slate-600 text-white"
                : "bg-white text-black"
            }`}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            name="furnished"
            value="false"
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              !formData.furnished
                ? "bg-slate-600 text-white"
                : "bg-white text-black"
            }`}
            onClick={onChange}
          >
            NO
          </button>
        </div>
        <p className="mt-6 text-lg font-semibold">Address</p>
        <textarea
          type="text"
          id="address"
          name="address"
          placeholder="Address"
          required
          value={formData.address}
          onChange={onChange}
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-200 focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />
        {geoLocationEnabled && (
          <div className="mb-6 flex gap-4 items-center">
            <div className="">
              <p className="text-lg font-semibold">Latitude</p>
              <input
                type="number"
                id="latitude"
                name="latitude"
                min="-90"
                max="90"
                value={formData.latitude}
                onChange={onChange}
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-200 focus:border-slate-300 focus:bg-white focus:text-gray-700"
              />
            </div>
            <div className="">
              <p className="text-lg font-semibold">Longitude</p>
              <input
                type="number"
                id="longitude"
                name="longitude"
                min="-180"
                max="180"
                value={formData.longitude}
                onChange={onChange}
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-200 focus:border-slate-300 focus:bg-white focus:text-gray-700"
              />
            </div>
          </div>
        )}
        <p className=" text-lg font-semibold">Description</p>
        <textarea
          type="text"
          id="description"
          name="description"
          placeholder="description"
          required
          value={formData.description}
          onChange={onChange}
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-200 focus:text-gray-700 focus:bg-white focus:border-slate-600 mb-6"
        />

        <p className="text-lg font-semibold">Offer</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="offer"
            name="offer"
            value="true"
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              formData.offer ? "bg-slate-600 text-white" : "bg-white text-black"
            }`}
            onClick={onChange}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            name="offer"
            value="false"
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              !formData.offer
                ? "bg-slate-600 text-white"
                : "bg-white text-black"
            }`}
            onClick={onChange}
          >
            NO
          </button>
        </div>
        <div className="mt-6 flex items-center mb-6">
          <div className="">
            <p className="text-lg font-semibold">Regular price</p>
            <div className="flex w-full items-center gap-6">
              <input
                type="number"
                name="regularPrice"
                id="regularPrice"
                value={formData.regularPrice}
                onChange={onChange}
                min="50"
                max="400000000"
                required
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-200 focus:border-slate-300 focus:bg-white focus:text-gray-700"
              />

              {formData.type === "rent" && (
                <div className="">
                  <p className="text-lg w-full whitespace-nowrap">$ / month</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {formData.offer && (
          <div className="mt-6 flex items-center mb-6">
            <div className="">
              <p className="text-lg font-semibold">Discounted price</p>
              <div className="flex w-full items-center gap-6">
                <input
                  type="number"
                  name="discountedPrice"
                  id="discountedPrice"
                  value={formData.discountedPrice}
                  onChange={onChange}
                  min="50"
                  max="400000000"
                  required
                  className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out duration-200 focus:border-slate-300 focus:bg-white focus:text-gray-700"
                />
                {formData.type === "rent" && (
                  <div className="">
                    <p className="text-lg w-full whitespace-nowrap">
                      $ / month
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        <div className="">
          <p className="text-lg font-semibold">Images</p>
          <p className="text-sm">The first image will be the cover (max 6)</p>
          <input
            type="file"
            name="images"
            id="images"
            onChange={onChange}
            accept=".jpg,.png,.jpeg"
            multiple
            required
            className="w-full px-2 py-1.5 text-gray-700 bg-white border border-gray-300 transition duration-200 ease-in-out focus:bg-white focus:border-slate-600 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-6 mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:shadow-lg hover:bg-blue-800 active:bg-blue-900 transition duration-200 ease-in-out"
        >
          Edit Listing
        </button>
      </form>
    </main>
  );
};

export default EditListing;
