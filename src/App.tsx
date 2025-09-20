import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import html2canvas from "html2canvas";
import { getCroppedImg } from "./utils/cropImage.js";

// Import the template images directly
import template4 from "./assets/template4.png";
import template3 from "./assets/template3.png";

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [template, setTemplate] = useState<string>(template4); // Use the imported variable

  const onCropComplete = useCallback((_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImageSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImageSrc(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = async () => {
    try {
      const croppedImg = await getCroppedImg(imageSrc, croppedAreaPixels);
      setCroppedImage(croppedImg);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownload = async () => {
    const element = document.getElementById("final-poster");
    if (!element) return;
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2,
      logging: false,
    });
    const link = document.createElement("a");
    link.download = "poster.png";
    link.href = canvas.toDataURL("image/png", 1.0);
    link.click();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <div
          className="backdrop-blur-md bg-gray-800/80 shadow-2xl rounded-2xl p-6 w-full max-w-lg border border-gray-600/50"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-100">
            Sweet of madeena
          </h1>

          {/* Ratio Selection */}
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => {
                setAspectRatio(4 / 3);
                setTemplate(template4); // Use the imported variable
              }}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                aspectRatio === 4 / 3
                  ? "bg-green-500 text-white border-green-500"
                  : "backdrop-blur-md bg-gray-700/60 text-gray-100 hover:bg-gray-600/70 border border-gray-500/50"
              }`}
            >
              4:3 Ratio
            </button>
            <button
              onClick={() => {
                setAspectRatio(3 / 4);
                setTemplate(template3); // Use the imported variable
              }}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                aspectRatio === 3 / 4
                  ? "bg-green-500 text-white border-green-500"
                  : "backdrop-blur-md bg-gray-700/60 text-gray-100 hover:bg-gray-600/70 border border-gray-500/50"
              }`}
            >
              3:4 Ratio
            </button>
          </div>

          {/* Upload and Camera */}
          <div className="flex gap-2 mb-4">
            {/* File Upload Button */}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer block w-full text-center backdrop-blur-md bg-gray-700/60 text-gray-100 py-2 rounded-lg hover:bg-gray-600/70 border border-gray-500/50 transition-all duration-300"
              >
                Choose Image
              </label>
            </div>

            {/* Camera Button */}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
                id="camera-capture"
              />
              <label
                htmlFor="camera-capture"
                className="cursor-pointer block w-full text-center backdrop-blur-md bg-gray-700/60 text-gray-100 py-2 rounded-lg hover:bg-gray-600/70 border border-gray-500/50 transition-all duration-300"
              >
                Take Photo
              </label>
            </div>
          </div>

          {/* Crop Section */}
          {imageSrc && !croppedImage && (
            <div className="relative w-full h-64 bg-gray-700 rounded-lg">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspectRatio}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}

          {imageSrc && !croppedImage && (
            <button
              onClick={handleCrop}
              className="mt-4 w-full backdrop-blur-md bg-gray-700/60 text-gray-100 py-2 rounded-lg hover:bg-gray-600/70 border border-gray-500/50 transition-all duration-300"
            >
              Crop Image
            </button>
          )}

          {/* Final Poster Preview */}
          {croppedImage && (
            <div className="mt-6">
              <div
                id="final-poster"
                className="relative w-full max-w-md mx-auto"
                style={{ aspectRatio: `${aspectRatio}` }}
              >
                <img
                  src={croppedImage}
                  alt="Cropped"
                  className="w-full h-full object-cover"
                />
                <img
                  src={template} // Use the imported variable here
                  alt="Template Overlay"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />
              </div>
              <button
                onClick={handleDownload}
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-all duration-300"
              >
                Download Poster
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
