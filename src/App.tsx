import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import html2canvas from "html2canvas";
import { getCroppedImg } from "./utils/cropImage.js";

// Import the template images directly
import template4 from "./assets/template4.png";
import template3 from "./assets/template3.png";
import bgImage from "./assets/BG.png";

function App() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number>(4 / 3);
  const [template, setTemplate] = useState<string>(template4); // Use the imported variable

  const backgroundStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    zIndex: -1,
  } as const;

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
    <div className="relative">
      <div style={backgroundStyle}></div>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <div
          className="backdrop-blur-md bg-white/30 shadow-lg rounded-2xl p-6 w-full max-w-lg border border-white/30"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <h1 className="text-2xl font-bold text-center mb-4 text-white">
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
                  : "backdrop-blur-md bg-white/20 text-white hover:bg-white/30 border border-white/30"
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
                  : "backdrop-blur-md bg-white/20 text-white hover:bg-white/30 border border-white/30"
              }`}
            >
              3:4 Ratio
            </button>
          </div>

          {/* Upload and Camera */}
          <div className="relative mb-4">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer inline-block w-full text-center backdrop-blur-md bg-white/20 text-white py-2 rounded-lg hover:bg-white/30 border border-white/30 transition-all duration-300"
            >
              Choose Image
            </label>
          </div>

          {/* Crop Section */}
          {imageSrc && !croppedImage && (
            <div className="relative w-full h-64 bg-gray-200">
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
              className="mt-4 w-full backdrop-blur-md bg-white/20 text-white py-2 rounded-lg hover:bg-white/30 border border-white/30 transition-all duration-300"
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
                className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
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
