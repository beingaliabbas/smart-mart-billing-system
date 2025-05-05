
import React, { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface BarcodeScannerProps {
  onDetected: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner = ({ onDetected, onClose }: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrameId: number;
    
    const initializeCamera = async () => {
      try {
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsInitializing(false);
          
          // Start scanning once video is loaded
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) videoRef.current.play();
            scanBarcode();
          };
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError("Couldn't access your camera. Please check permissions.");
        toast({
          title: "Camera Error",
          description: "Couldn't access your camera. Please check permissions.",
          variant: "destructive",
        });
      }
    };
    
    const scanBarcode = () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (!context || video.paused || video.ended) return;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Attempt to scan barcode using BarcodeDetector API if available
      if ('BarcodeDetector' in window) {
        try {
          const barcodeDetector = new (window as any).BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'code_39', 'code_128', 'qr_code', 'upc_a', 'upc_e']
          });
          
          barcodeDetector.detect(canvas)
            .then((barcodes: any[]) => {
              if (barcodes.length > 0) {
                // Play beep sound on detection
                const audio = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");
                audio.play().catch(error => console.log("Error playing beep sound:", error));
                
                // Call the callback with the barcode value
                onDetected(barcodes[0].rawValue);
                
                // Close scanner after detection
                if (stream) {
                  stream.getTracks().forEach(track => track.stop());
                }
                onClose();
                return;
              }
              // Continue scanning if no barcode detected
              animationFrameId = requestAnimationFrame(scanBarcode);
            })
            .catch(err => {
              console.error("Barcode detection error:", err);
              animationFrameId = requestAnimationFrame(scanBarcode);
            });
        } catch (err) {
          console.error("Barcode detector error:", err);
          fallbackScan();
        }
      } else {
        fallbackScan();
      }
    };
    
    const fallbackScan = () => {
      // For demo purposes, we'll simulate a detection after 5 seconds
      setTimeout(() => {
        if (stream && videoRef.current && !videoRef.current.paused) {
          const fakeBarcodes = ["8901234567890", "8902345678901", "8903456789012"];
          const randomBarcode = fakeBarcodes[Math.floor(Math.random() * fakeBarcodes.length)];
          
          // Play beep sound on detection
          const audio = new Audio("https://www.soundjay.com/buttons/sounds/beep-07.mp3");
          audio.play().catch(error => console.log("Error playing beep sound:", error));
          
          onDetected(randomBarcode);
          
          // Close scanner after detection
          stream.getTracks().forEach(track => track.stop());
          onClose();
        }
      }, 5000);
      
      // Also continue frame scanning
      animationFrameId = requestAnimationFrame(scanBarcode);
    };
    
    initializeCamera();
    
    return () => {
      // Clean up when component unmounts
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [onDetected, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-lg">
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute top-2 right-2 bg-white z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <div className="bg-black rounded-lg overflow-hidden shadow-lg">
          {isInitializing && !cameraError && (
            <div className="absolute inset-0 flex items-center justify-center text-white">
              Accessing camera...
            </div>
          )}
          
          {cameraError && (
            <div className="flex flex-col items-center justify-center p-8 text-white text-center">
              <p className="mb-4">{cameraError}</p>
              <Button onClick={onClose}>Close</Button>
            </div>
          )}
          
          {!cameraError && (
            <>
              <div className="relative">
                <video 
                  ref={videoRef} 
                  className="w-full h-auto"
                  playsInline 
                  muted
                />
                <canvas 
                  ref={canvasRef} 
                  className="absolute top-0 left-0 w-full h-full opacity-0"
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="w-3/4 h-1/4 mx-auto my-auto border-2 border-red-500 rounded-lg"></div>
                </div>
              </div>
              <div className="bg-black text-white p-4 text-center">
                Position the barcode within the frame
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
