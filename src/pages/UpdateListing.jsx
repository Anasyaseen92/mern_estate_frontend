import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState(null);
  const [loadingForServer, setLoadingForServer] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((store) => store.user);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setFormData({
        ...data,
        name: data.name || "",
        description: data.description || "",
        address: data.address || "",
        regularPrice: data.regularPrice || 50,
        discountPrice: data.discountPrice || 50,
        bathRooms: data.bathRooms || 1,
        bedRooms: data.bedRooms || 1,
        furnished: data.furnished || false,
        parking: data.parking || false,
        type: data.type || "rent",
        offer: data.offer || false,
        imageUrls: data.imageUrls || [],
      });

      setImageUrls(data.imageUrls || []);
    };
    fetchListing();
  }, [params.listingId]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length < 1 || selectedFiles.length > 6) {
      return setError("Please select between 1 and 6 image files.");
    }
    const isAllImages = selectedFiles.every((file) =>
      file.type.startsWith("image/")
    );
    if (!isAllImages) return setError("Only image files are allowed.");
    setFiles(selectedFiles);
    setError("");
  };

  const storeImage = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("profile")
      .upload(`listings/${fileName}`, file);
    if (error) {
      console.error(error.message);
      setError("Image upload failed.");
      return null;
    }

    const { data: publicData } = supabase.storage
      .from("profile")
      .getPublicUrl(`listings/${fileName}`);
    return publicData.publicUrl;
  };

  const handleImageSubmit = async () => {
    if (files.length < 1 || files.length > 6)
      return setError("Please upload between 1 and 6 images.");

    const urls = await Promise.all(files.map(storeImage));
    const validUrls = urls.filter(Boolean);
    if (validUrls.length) {
      const updated = [...imageUrls, ...validUrls];
      setImageUrls(updated);
      setFormData((prev) => ({
        ...prev,
        imageUrls: updated,
      }));
      setSuccessMessage("Images uploaded successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setFiles([]);
    }
  };

  const handleDelete = (url) => {
    const updated = imageUrls.filter((img) => img !== url);
    setImageUrls(updated);
    setFormData((prev) => ({
      ...prev,
      imageUrls: updated,
    }));
  };

  const handleChange = (e) => {
    const { id, type, checked, value } = e.target;

    if (id === "sale" || id === "rent") {
      return setFormData({ ...formData, type: id });
    }

    if (["parking", "offer", "furnished"].includes(id)) {
      return setFormData({ ...formData, [id]: checked });
    }

    setFormData({ ...formData, [id]: value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.imageUrls.length)
    return setError("You have to upload at least 1 image");
  if (formData.regularPrice < formData.discountPrice)
    return setError("Discount price must be less than regular price");

  try {
    setLoadingForServer(true);

    const response = await fetch(`/api/listing/update/${params.listingId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...formData, userRef: currentUser._id }),
    });

    const jsonData = await response.json();
    console.log("Server Response:", jsonData);

    // remove this check
    // if (!jsonData.success) throw new Error(jsonData.message);

    if (!jsonData._id) throw new Error("Update failed: No ID returned");

    setLoadingForServer(false);
    setError(null);
    navigate(`/listing/${jsonData._id}`);
  } catch (e) {
    setLoadingForServer(false);
    setError(e.message);
  }
};
  if (!formData) return <p className="text-center">Loading...</p>;

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            id="name"
            placeholder="Name"
            required
            className="border p-3 rounded-lg"
            value={formData.name}
            onChange={handleChange}
          />
          <textarea
            id="description"
            placeholder="Description"
            required
            className="border p-3 rounded-lg"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="text"
            id="address"
            placeholder="Address"
            required
            className="border p-3 rounded-lg"
            value={formData.address}
            onChange={handleChange}
          />

          <div className="flex gap-6 flex-wrap">
            {["sale", "rent"].map((type) => (
              <label key={type} className="flex gap-2">
                <input
                  type="checkbox"
                  id={type}
                  checked={formData.type === type}
                  onChange={handleChange}
                />
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </label>
            ))}
            {["parking", "furnished", "offer"].map((option) => (
              <label key={option} className="flex gap-2">
                <input
                  type="checkbox"
                  id={option}
                  checked={formData[option]}
                  onChange={handleChange}
                />
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>

          <div className="flex gap-4 flex-wrap">
            <input
              type="number"
              id="bedRooms"
              min="1"
              max="10"
              className="p-3 border rounded"
              value={formData.bedRooms}
              onChange={handleChange}
              placeholder="Bedrooms"
            />
            <input
              type="number"
              id="bathRooms"
              min="1"
              max="10"
              className="p-3 border rounded"
              value={formData.bathRooms}
              onChange={handleChange}
              placeholder="Bathrooms"
            />
            <input
              type="number"
              id="regularPrice"
              min="50"
              className="p-3 border rounded"
              value={formData.regularPrice}
              onChange={handleChange}
              placeholder="Regular Price"
            />
            <input
              type="number"
              id="discountPrice"
              min="50"
              className="p-3 border rounded"
              value={formData.discountPrice}
              onChange={handleChange}
              placeholder="Discount Price"
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-4">
          <label className="font-medium">Upload Images (max 6):</label>
          <div className="flex gap-4">
            <input
              onChange={handleFileChange}
              type="file"
              accept="image/*"
              multiple
              className="border p-3 w-full rounded"
            />
            <button
              type="button"
              onClick={handleImageSubmit}
              className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800"
            >
              Upload
            </button>
          </div>

          {successMessage && (
            <p className="text-green-600 text-sm">{successMessage}</p>
          )}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 flex-wrap">
            {imageUrls.map((url, idx) => (
              <div key={idx} className="relative w-24 h-24">
                <img
                  src={url}
                  alt={`uploaded-${idx}`}
                  className="w-full h-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleDelete(url)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full text-xs px-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-slate-700 text-white p-3 rounded hover:bg-slate-800"
            disabled={loadingForServer}
          >
            {loadingForServer ? "Updating..." : "Update Listing"}
          </button>
        </div>
      </form>
    </main>
  );
}
