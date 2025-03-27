import React, { useState, useEffect, useRef } from "react";
import { QrReader } from "react-qr-reader";
import { utils, writeFile } from "xlsx"; // For exporting data to Excel

const Scanner = () => {
  const [qrData, setQrData] = useState([]);
  const [scannerActive, setScannerActive] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [cameraError, setCameraError] = useState(""); // To handle camera errors
  const qrReaderRef = useRef(null); // Ref to access the QrReader instance

  useEffect(() => {
    // Suppress specific warning about defaultProps
    const consoleError = console.error;
    console.error = (...args) => {
      if (/Warning: QrReader: Support for defaultProps/.test(args[0])) {
        return;
      }
      consoleError(...args);
    };
  }, []);

  const handleResult = (result) => {
    if (result?.text) {
      console.log("Scanned Data:", result.text); // Log raw QR code data
      setLoading(true);
      try {
        // Try to parse the QR code data as JSON
        const userData = JSON.parse(result.text);

        if (!userData.email) {
          setError("Invalid QR Code: Email not found.");
          setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
          return;
        }

        // Check if the email is already checked in
        const isAlreadyCheckedIn = qrData.some(
          (entry) => entry.email === userData.email
        );

        if (isAlreadyCheckedIn) {
          setError(`User with email ${userData.email} is already checked in.`);
          setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
        } else {
          // Add the new user to the checked-in list
          setQrData((prevData) => [
            ...prevData,
            { id: prevData.length + 1, ...userData, status: "Checked In" },
          ]);
          setSuccess(`User ${userData.email} checked in successfully!`);
          setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
          setError(""); // Clear previous errors
        }
      } catch (err) {
        // Handle plain text QR codes (comma-separated values)
        const [name, email] = result.text.split(",");
        if (name && email) {
          const isAlreadyCheckedIn = qrData.some(
            (entry) => entry.email === email.trim()
          );

          if (isAlreadyCheckedIn) {
            setError(`User with email ${email.trim()} is already checked in.`);
            setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
          } else {
            setQrData((prevData) => [
              ...prevData,
              {
                id: prevData.length + 1,
                name: name.trim(),
                email: email.trim(),
                status: "Checked In",
              },
            ]);
            setSuccess(`User ${email.trim()} checked in successfully!`);
            setTimeout(() => setSuccess(""), 3000); // Clear success message after 3 seconds
            setError(""); // Clear previous errors
          }
        } else {
          setError("Invalid QR Code format.");
          setTimeout(() => setError(""), 3000); // Clear error after 3 seconds
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const exportToExcel = () => {
    const ws = utils.json_to_sheet(qrData);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "QR Data");
    writeFile(wb, "data.xlsx");
  };

  const toggleScanner = () => {
    if (scannerActive) {
      // Stop the camera stream
      if (qrReaderRef.current) {
        qrReaderRef.current.stopCamera();
      }
    }
    setScannerActive((prev) => !prev);
    setError(""); // Clear errors when toggling scanner
    setSuccess(""); // Clear success messages
    setCameraError(""); // Clear camera errors
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">QR Code Scanner</h1>

      {/* Scanner Toggle Button */}
      <button
        onClick={toggleScanner}
        className={`px-6 py-3 rounded-lg text-white font-semibold transition-all ${
          scannerActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {scannerActive ? "Stop Scanner" : "Start Scanner"}
      </button>

      {/* Scanner Section */}
      {scannerActive && (
        <div className="mt-8 relative w-full max-w-md">
          <div className="border-4 border-blue-500 rounded-lg overflow-hidden relative">
            <QrReader
              ref={qrReaderRef}
              onResult={handleResult}
              constraints={{ facingMode: "environment" }}
              containerStyle={{ width: "100%", height: "100%" }}
              videoContainerStyle={{ width: "100%", height: "100%" }}
              videoStyle={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(err) => {
                console.error("Camera Error:", err);
                setCameraError("Failed to access the camera. Please check permissions.");
              }}
              onLoad={() => console.log("Camera stream loaded successfully!")}
            />
            {/* Scanner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="border-2 border-white rounded-lg w-64 h-64"></div>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg">
              {success}
            </div>
          )}

          {/* Camera Error Message */}
          {cameraError && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg">
              {cameraError}
            </div>
          )}
        </div>
      )}

      {/* Scanned Data Section */}
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Scanned Data</h2>
        {qrData.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md p-4">
            <ul className="space-y-2">
              {qrData.map((user) => (
                <li key={user.id} className="flex justify-between items-center p-2 border-b">
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                  <span className="text-sm text-green-500">{user.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600">No data scanned yet.</p>
        )}
      </div>

      {/* Export Button */}
      <button
        onClick={exportToExcel}
        disabled={qrData.length === 0}
        className={`mt-6 px-6 py-3 rounded-lg text-white font-semibold transition-all ${
          qrData.length === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        Export to Excel
      </button>
    </div>
  );
};

export default Scanner;