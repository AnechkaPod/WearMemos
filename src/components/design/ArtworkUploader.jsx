import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image, ArrowRight, Loader2 } from 'lucide-react';

const API_BASE = "http://localhost:5243";

export default function ArtworkUploader({ artworks, onArtworksChange, onGenerate }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      await uploadFiles(files);
    }
  }, []);

  const handleFileInput = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await uploadFiles(files);
    }
  };

  const uploadFiles = async (files) => {
    setUploading(true);
    const token = localStorage.getItem('token');
    const uploaded = [];

    for (const file of files) {
      try {
        // For guest users, just create local previews
        if (!token) {
          uploaded.push({
            id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: URL.createObjectURL(file),
            preview: URL.createObjectURL(file),
            fileName: file.name,
            isLocal: true,
            file: file // Keep the file for later upload when user logs in
          });
        } else {
          const formData = new FormData();
          formData.append('file', file);

          const res = await fetch(`${API_BASE}/artworks/upload`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
          });

          if (res.ok) {
            const data = await res.json();
            uploaded.push({
              ...data,
              preview: URL.createObjectURL(file)
            });
          }
        }
      } catch (err) {
        console.error('Upload error:', err);
      }
    }

    onArtworksChange([...artworks, ...uploaded]);
    setUploading(false);
  };

  const removeArtwork = (id) => {
    onArtworksChange(artworks.filter(a => a.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">Upload Your Artwork</h2>
        <p className="text-gray-500">Add photos to transform into beautiful patterns</p>
      </div>

      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all ${
          dragActive 
            ? 'border-rose-500 bg-rose-50' 
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        <div className="pointer-events-none">
          {uploading ? (
            <Loader2 className="w-12 h-12 text-rose-500 animate-spin mx-auto mb-4" />
          ) : (
            <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors ${
              dragActive ? 'bg-rose-500' : 'bg-navy-900'
            }`}>
              <Upload className="w-8 h-8 text-white" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-navy-900 mb-2">
            {uploading ? 'Uploading...' : dragActive ? 'Drop files here' : 'Drag & drop images'}
          </h3>
          <p className="text-gray-500">or click to browse</p>
        </div>
      </div>

      {/* Uploaded Artworks */}
      <AnimatePresence>
        {artworks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h3 className="font-semibold text-navy-900 mb-4">
              Selected Images ({artworks.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {artworks.map((artwork) => (
                <motion.div
                  key={artwork.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src={artwork.preview || artwork.url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeArtwork(artwork.id)}
                    className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={onGenerate}
                disabled={artworks.length === 0}
                className="inline-flex items-center gap-2 px-8 py-4 bg-navy-900 text-white rounded-xl font-medium hover:bg-navy-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate Pattern
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {artworks.length === 0 && (
        <div className="mt-12 text-center">
          <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Upload images to get started</p>
        </div>
      )}
    </div>
  );
}