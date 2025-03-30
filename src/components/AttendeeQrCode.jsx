import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Correct import name

const AttendeeQrCode = ({ eventId, attendee }) => {
    const qrRef = useRef(null);

    const handleDownload = () => {
        if (!qrRef.current) return;

        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) return;

        const url = canvas.toDataURL();
        const a = document.createElement('a');
        a.download = `ticket-${attendee.$id}.png`;
        a.href = url;
        a.click();
    };

    return (
        <div ref={qrRef} className="flex flex-col items-center">
            <QRCodeSVG
                value={JSON.stringify({
                    eventId: eventId || 'invalid-event',
                    bookingId: attendee?.$id || 'invalid-booking',
                    name: attendee?.ticketHolderName || 'unknown'
                })}
                size={80}
                includeMargin={true}
            />
            <button
                onClick={handleDownload}
                className="text-sm mt-1 text-blue-600 hover:text-blue-700 transition-colors"
            >
                Download QR
            </button>
        </div>
    );
};

export default AttendeeQrCode;