import { useState, useEffect } from 'react';
import QrScanner from 'react-qr-scanner';
import PropTypes from 'prop-types';
import { CheckCircleIcon, XCircleIcon, ViewfinderCircleIcon } from '@heroicons/react/24/solid';

const QrScannerModal = ({ eventId, attendees, onScanSuccess, onClose }) => {
    const [scanResult, setScanResult] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [scanError, setScanError] = useState('');
    const [scanStatus, setScanStatus] = useState('ready'); // ready, scanning, success, error

    // Initialize camera
    useEffect(() => {
        const initializeCamera = async () => {
            try {
                await navigator.mediaDevices.getUserMedia({ 
                    video: { 
                        facingMode: 'environment',
                        aspectRatio: 1 
                    } 
                });
                setCameraReady(true);
                setScanStatus('ready');
            } catch (error) {
                setScanError('Camera access required - please enable in browser settings');
                setCameraReady(false);
            }
        };

        initializeCamera();
    }, []);

    const handleScan = async (data) => {
        if (!data) {
            // No QR code detected
            setScanStatus('scanning');
            return;
        }

        try {
            setScanResult(null);

            if (!data || typeof data.text !== 'string') {
                setScanStatus('ready');
                return;
            }
            
            const text = data.text.trim();

            if (!text) {
                setScanResult({
                    status: 'error',
                    message: 'Empty QR code detected'
                });
                setScanStatus('error');
                return;
            }

            if (!(text.startsWith('{') && text.endsWith('}'))) {
                throw new Error('Invalid QR format - not JSON');
            }

            const scannedData = JSON.parse(text);
            
            // Validation checks
            if (!scannedData?.bookingId || !scannedData?.eventId) {
                throw new Error('Missing required fields in QR code');
            }

            const attendee = attendees.find(a => a.$id === scannedData.bookingId);
            if (!attendee) throw new Error('Attendee not found');
            if (attendee.status === 'checkedIn') throw new Error('Already checked in');

            // Successful scan
            setScanResult({
                name: attendee.ticketHolderName,
                status: 'success'
            });
            setScanStatus('success');
            
            onScanSuccess(scannedData.bookingId);

            // Reset after 2 seconds
            setTimeout(() => {
                setScanStatus('ready');
                setScanResult(null);
            }, 2000);

        } catch (error) {
            setScanResult({
                status: 'error',
                message: error.message.replace('JSON.parse:', '').trim()
            });
            setScanStatus('error');
            
            setTimeout(() => {
                setScanStatus('ready');
                setScanResult(null);
            }, 3000);
        }
    };

    const handleError = (err) => {
        console.error('Scanner Error:', err);
        setScanError(err.message || 'Scanner error');
        setCameraReady(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">QR Code Scanner</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Camera Preview */}
                <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {cameraReady ? (
                        <>
                            <QrScanner
                                delay={300}
                                onError={handleError}
                                onScan={handleScan}
                                constraints={{
                                    video: {
                                        facingMode: 'environment',
                                        aspectRatio: 1
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transform: 'scaleX(-1)',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                }}
                            />

                            {/* ... [keep scanning overlay and other elements] ... */}
                        </>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-500">
                            {scanError || 'Initializing camera...'}
                        </div>
                    )}

                    {/* Scan Results */}
                    {scanResult && (
                        <div className={`absolute inset-0 flex items-center justify-center bg-black/70
                            ${scanResult.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            <div className="text-center">
                                {scanResult.status === 'success' ? (
                                    <>
                                        <CheckCircleIcon className="w-16 h-16 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold">Check-in Successful!</h3>
                                        <p className="mt-2">{scanResult.name}</p>
                                    </>
                                ) : (
                                    <>
                                        <XCircleIcon className="w-16 h-16 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold">Scan Failed</h3>
                                        <p className="mt-2">{scanResult.message}</p>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
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