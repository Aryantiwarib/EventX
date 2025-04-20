import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';

// Import the QR scanner library
import { Html5Qrcode } from 'html5-qrcode';

const QrScannerModal = ({ eventId, attendees, onScanSuccess, onClose }) => {
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState('ready'); // ready, success, error, warning
  const [errorMessage, setErrorMessage] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [processingCode, setProcessingCode] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const scannerRef = useRef(null);
  const scannerContainerRef = useRef(null);
  
  // Initialize the scanner on component mount
  useEffect(() => {
    // Create scanner instance
    if (scannerContainerRef.current && !scannerRef.current) {
      scannerRef.current = new Html5Qrcode(scannerContainerRef.current.id);
    }
    
    // Clean up on unmount
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop()
          .catch(err => console.error("Error stopping scanner:", err));
      }
    };
  }, []);
  
  // Start camera when component is ready
  useEffect(() => {
    if (scannerRef.current && scannerContainerRef.current) {
      startScanner();
    }
  }, [scannerRef.current, scannerContainerRef.current]);
  
  const startScanner = async () => {
    if (!scannerRef.current) return;
    
    try {
      await scannerRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleQrCodeSuccess,
        handleQrCodeError
      );
      setCameraReady(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      setErrorMessage("Could not access camera. Please ensure camera permissions are enabled.");
      setCameraReady(false);
    }
  };
  
  const showSuccessToast = (name) => {
    setToastMessage(`${name} checked in successfully`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const handleQrCodeSuccess = async (decodedText) => {
    if (processingCode) return; // Prevent duplicate processing
    
    try {
      setProcessingCode(true);
      console.log("QR Code detected:", decodedText);
      
      // Handle empty or undefined values
      if (!decodedText || decodedText === "undefined") {
        throw new Error("Invalid QR code");
      }
      
      // Try to parse as JSON
      let scannedData;
      try {
        scannedData = JSON.parse(decodedText);
      } catch (e) {
        // If not JSON, check if the text itself might be a booking ID
        if (typeof decodedText === 'string' && decodedText.length > 0) {
          const possibleAttendee = attendees.find(a => a.$id === decodedText);
          if (possibleAttendee) {
            scannedData = { bookingId: decodedText };
          } else {
            throw new Error('Only EventX tickets can be scanned');
          }
        } else {
          throw new Error('Only EventX tickets can be scanned');
        }
      }
      
      // Validate booking ID
      if (!scannedData?.bookingId) {
        throw new Error('Only EventX tickets can be scanned');
      }
      
      // Find attendee
      const attendee = attendees.find(a => a.$id === scannedData.bookingId);
      
      if (!attendee) {
        throw new Error('Attendee not found in the event');
      }
      
      // Check if already checked in
      if (attendee.status === 'checkedIn') {
        setScanResult({
          name: attendee.ticketHolderName,
          status: 'warning',
          message: 'Already checked in'
        });
        setScanStatus('warning');
        
        setTimeout(() => {
          setScanStatus('ready');
          setScanResult(null);
          setProcessingCode(false);
        }, 2000);
        
        return;
      }
      
      // Success
      setScanResult({
        name: attendee.ticketHolderName,
        status: 'success'
      });
      setScanStatus('success');
      
      // Call onScanSuccess with the booking ID
      onScanSuccess(scannedData.bookingId);
      
      // Show toast notification
      showSuccessToast(attendee.ticketHolderName);
      
      // Reset after delay
      setTimeout(() => {
        setScanStatus('ready');
        setScanResult(null);
        setProcessingCode(false);
      }, 2000);
      
    } catch (error) {
      console.error("Scan processing error:", error);
      setScanResult({
        status: 'error',
        message: error.message || 'Unknown error'
      });
      setScanStatus('error');
      
      setTimeout(() => {
        setScanStatus('ready');
        setScanResult(null);
        setProcessingCode(false);
      }, 2000);
    }
  };
  
  const handleQrCodeError = (error) => {
    // Don't show errors from normal scanning process
    // console.error("QR Scanner error:", error);
  };
  
  const handleClose = () => {
    // Stop scanner before closing
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop()
        .then(() => onClose())
        .catch(err => {
          console.error("Error stopping scanner:", err);
          onClose();
        });
    } else {
      onClose();
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Toast notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {toastMessage}
        </div>
      )}
      
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">QR Code Scanner</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        
        {/* Scanner container */}
        <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
          <div 
            id="qr-scanner-container"
            ref={scannerContainerRef}
            className="w-full h-full" 
          />
          
          {/* Loading state */}
          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
              {errorMessage || 'Initializing camera...'}
            </div>
          )}
          
          {/* Scan Results Overlay */}
          {scanResult && (
            <div className={`absolute inset-0 flex items-center justify-center bg-black/70
              ${scanResult.status === 'success' ? 'text-green-400' : 
                scanResult.status === 'warning' ? 'text-yellow-400' : 'text-red-400'}`}>
              <div className="text-center p-4">
                {scanResult.status === 'success' ? (
                  <>
                    <CheckCircleIcon className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-xl font-bold">Check-in Successful!</h3>
                    <p className="mt-2 text-lg">{scanResult.name}</p>
                  </>
                ) : scanResult.status === 'warning' ? (
                  <>
                    <ExclamationTriangleIcon className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                    <h3 className="text-xl font-bold">{scanResult.message}</h3>
                    <p className="mt-2 text-lg">{scanResult.name}</p>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-xl font-bold">Scan Failed</h3>
                    <p className="mt-2 text-lg">{scanResult.message}</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Debug info */}
        <div className="mt-4 p-2 text-xs bg-gray-100 rounded-md overflow-auto max-h-24">
          <p>Event ID: {eventId}</p>
          <p>Attendees: {attendees.length}</p>
          <p>Status: {scanStatus}</p>
          <p>Camera: {cameraReady ? 'Ready' : 'Not ready'}</p>
        </div>
        
        {/* Footer Instructions */}
        <div className="mt-4 text-center text-sm text-gray-500">
          {scanStatus === 'success' ? 'Scan another ticket or close scanner' :
           scanStatus === 'error' ? 'Try scanning again' :
           'Point camera at attendee QR code'}
        </div>
      </div>
    </div>
  );
};

QrScannerModal.propTypes = {
  eventId: PropTypes.string.isRequired,
  attendees: PropTypes.arrayOf(PropTypes.object).isRequired,
  onScanSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default QrScannerModal;