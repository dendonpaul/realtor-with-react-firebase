import React, { useState } from "react";

const CreateListing = () => {
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
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <main className="max-w-md px-2 mx-auto">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
      <form>
        <p className="text-lg mt-6 font-semibold">Sell/Rent</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="type"
            value="sale"
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              formData.type === "rent"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            onChange={onChange}
          >
            Sell
          </button>
          <button
            type="button"
            id="type"
            value="rent"
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              formData.type === "sale"
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            onChange={onChange}
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
            value={true}
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              !formData.parking
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            onChange={onChange}
          >
            Yes
          </button>
          <button
            type="button"
            id="type"
            value={false}
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              formData.parking
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            onChange={onChange}
          >
            No
          </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Furnished</p>
        <div className="flex gap-5">
          <button
            type="button"
            id="furnished"
            value={false}
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              !formData.furnished
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            onChange={onChange}
          >
            Yes
          </button>
          <button
            type="button"
            id="furnished"
            value={true}
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              formData.furnished
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            onChange={onChange}
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
            value={formData.offer}
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              !formData.offer
                ? "bg-white text-black"
                : "bg-slate-600 text-white"
            }`}
            onChange={onChange}
          >
            Yes
          </button>
          <button
            type="button"
            id="offer"
            value={formData.offer}
            className={`px-7 py-3 font-medium text-small
            uppercase shadow-md rounded hover:shadow-lg active:shadow-lg focus:shadow-lg transition ease-in-out duration-200 w-full ${
              formData.offer ? "bg-white text-black" : "bg-slate-600 text-white"
            }`}
            onChange={onChange}
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
          Create Listing
        </button>
      </form>
    </main>
  );
};

export default CreateListing;
