import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

 const navigate =  useNavigate();
  const { currentUser } = useSelector((store) => store.user);
  const [loadingForServer, setLoadingForServer] = useState(false);


  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: 50,
    discountPrice: 50,
    bathRooms: 0,
    bedRooms: 0,
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
    imageUrls: [],
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length < 1 || selectedFiles.length > 6) {
      setError("Please select between 1 and 6 image files.");
      return;
    }

    const isAllImages = selectedFiles.every((file) =>
      file.type.startsWith("image/")
    );
    if (!isAllImages) {
      setError("Only image files are allowed.");
      return;
    }

    setError("");
    setFiles(selectedFiles);
  };

  const storeImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("profile")
      .upload(`listings/${fileName}`, file);

    if (error) {
      console.error("Upload error:", error.message);
      setError("Upload failed.");
      return null;
    }

    const { data: publicData } = supabase.storage
      .from("profile")
      .getPublicUrl(`listings/${fileName}`);

    return publicData.publicUrl;
  };

  const handleImageSubmit = async () => {
    if (files.length < 1 || files.length > 6) {
      setError("Please upload between 1 to 6 images.");
      return;
    }

    try {
      // Upload all images in parallel using Promise.all
      const uploadPromises = files.map((file) => storeImage(file));
      const urls = await Promise.all(uploadPromises);

      const validUrls = urls.filter(Boolean); // Filter out failed uploads

     if (validUrls.length > 0) {
  setImageUrls((prev) => [...prev, ...validUrls]);
  // ✅ Add this line to update formData
  setFormData((prev) => ({
    ...prev,
    imageUrls: [...prev.imageUrls, ...validUrls],
  }));
  setSuccessMessage("Images uploaded successfully!");
  setTimeout(() => setSuccessMessage(""), 3000);
}


      setFiles([]);
      setError("");
    } catch (err) {
      console.error("Parallel upload error:", err);
      setError("Something went wrong during upload.");
    }
  };

  const handleDelete = (url) => {
    setImageUrls((prev) => prev.filter((img) => img !== url));
  };
  const handleChange = (e) => {
    if (e.target.id == "sale" || e.target.id == "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id == "parking" ||
      e.target.id == "offer" ||
      e.target.id == "furnished"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "text" ||
      e.target.type === "textarea" ||
      e.target.type === "number"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.imageUrls.length < 1)
      return setError("You have to upload at least 1 image");
    if (formData.regularPrice < formData.discountPrice)
      return setError("discount price must be less than regular price");

    try {
      setLoadingForServer(true);

      const response = await fetch('/api/listing/create', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
         
        },
        credentials: "include",
       body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const jsonData = await response.json();

      if (jsonData.success == false) {
        setLoadingForServer(false);
        setError(jsonData.message);
        return;
      }
      setLoadingForServer(false);
      setError(null);
      navigate(`/listing/${jsonData._id}`);
      console.log("created successfully");
      
    } catch (e) {
      setLoadingForServer(false);
      setError(e.message);
    }
  };
  return (
    <main className="p-3  max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spoot</span>
            </div>

            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5"  onChange={handleChange}
                checked={formData.offer} />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedRooms"
                min="0"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                 onChange={handleChange}
                 value={formData.bedRooms}
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathRooms"
                min="0"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                 onChange={handleChange}
                 value={formData.bathRooms}
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="100000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                 onChange={handleChange}
                 value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="discountPrice"
                min="50"
                max="100000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                 onChange={handleChange}
                 value={formData.discountPrice}
              />
              <div className="flex flex-col items-center">
                <p>Discounted Price</p>
                <span className="text-xs">$ / month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <p>
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={handleFileChange}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && (
            <p className="text-green-600 text-sm">{successMessage}</p>
          )}

          <div className="flex gap-3 flex-wrap">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative w-24 h-24">
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="object-cover w-full h-full rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(url)}
                  className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 rounded-full text-xs"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <button className="p-3 bg-slate-700 text-white rounded-lg disabled:opacity-80 uppercase hover:opacity-95">
          {loadingForServer ? 'Creating...' : 'Create Listing'}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
