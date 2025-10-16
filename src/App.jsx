import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./assets/logo1.jpg";

const API_KEY = "rwol27iI6w8n7E5RGVMa1iExm-ReOroYNGCkwOEMYB8";
const API_URL = "https://api.unsplash.com/search/photos";

const App = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  // Load random images when the page opens
  useEffect(() => {
    fetchImages(true, "nature"); // Default random images (change "nature" to any keyword)
  }, []);

  // Fetch images from Unsplash
  const fetchImages = async (newSearch = false, customQuery = query) => {
    if (!customQuery.trim()) return alert("Please enter a search term");

    const response = await fetch(
      `${API_URL}?query=${customQuery}&client_id=${API_KEY}&per_page=20&page=${
        newSearch ? 1 : page
      }`
    );
    const data = await response.json();

    if (newSearch) {
      setImages(data.results);
      setPage(2);
    } else {
      setImages((prev) => [...prev, ...data.results]);
      setPage((prev) => prev + 1);
    }

    setTotalPages(data.total_pages);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchImages(true);
  };

  // Open image in modal
  const openModal = (img) => {
    setSelectedImage(img);
  };

  // Close modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Download image
  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename || "downloaded_image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="container">
      <header>
        <img src={logo} alt="SeekPick Logo" className="logo" />
        <h1>SeekPick - Image Finder</h1>
        <p>"Explore and download stunning, high-quality images."</p>
        <form onSubmit={handleSubmit}>
          <div className="search-bar">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for images..."
            />
            <button type="submit">Search</button>
          </div>
        </form>
      </header>

      <main className="gallery">
        {images.map((img) => (
          <div key={img.id} className="image-card">
            <img
              src={img.urls.small}
              alt={img.alt_description}
              onClick={() => openModal(img)}
            />
            <button
              className="download-btn"
              onClick={() =>
                downloadImage(img.urls.full, `image_${img.id}.jpg`)
              }
            >
              Download
            </button>
          </div>
        ))}
      </main>

      {page <= totalPages && images.length > 0 && (
        <button className="seeMoreBtn" onClick={() => fetchImages(false)}>
          See More
        </button>
      )}

      {/* Modal for Full-Size Image */}
      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>
              &times;
            </span>
            <img
              src={selectedImage.urls.regular}
              alt={selectedImage.alt_description}
            />
            <button
              className="download-btn"
              onClick={() =>
                downloadImage(
                  selectedImage.urls.full,
                  `image_${selectedImage.id}.jpg`
                )
              }
            >
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
