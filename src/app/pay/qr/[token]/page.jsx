"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Loader2, Download, Copy, CheckCircle, Shield } from "lucide-react";

export default function QRPaymentPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [qrData, setQrData] = useState(null);
  const [error, setError] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // ✅ Two-Step Verification States
  const [showPinModal, setShowPinModal] = useState(false);
  const [staffPin, setStaffPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (token) {
      verifyQR();
      checkAuth();
    }
  }, [token]);

  // ✅ Check if user is logged in as admin/staff
  const checkAuth = async () => {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        setIsAuthorized(false);
        return;
      }
      
      const response = await fetch('/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      const data = await response.json();
      
      if (data.role === 'admin' || data.role === 'staff') {
        setIsAuthorized(true);
        setUserRole(data.role);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      setIsAuthorized(false);
    }
  };

  const verifyQR = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/admin/fees/verify-qr?token=${token}`);
      
      if (!response.ok) {
        console.error("HTTP Error:", response.status, response.statusText);
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const text = await response.text();
      console.log("Raw API Response:", text.substring(0, 200));
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        throw new Error("Invalid response from server");
      }
      
      if (data.valid) {
        setQrData(data);
        setPaymentAmount(data.fee?.remainingAmount || 0);
      } else {
        setError(data);
      }
    } catch (error) {
      console.error("Verify error:", error);
      setError({ 
        message: error.message || 'Failed to verify QR code. Please try again.',
        reason: 'NETWORK_ERROR'
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Updated handlePayment - Show PIN modal first
  const handlePayment = () => {
    if (paymentAmount <= 0) {
      alert('Please enter valid amount');
      return;
    }
    
    if (paymentAmount > qrData?.fee?.remainingAmount) {
      alert(`Amount cannot exceed remaining: PKR ${qrData.fee.remainingAmount.toLocaleString()}`);
      return;
    }
    
    // ✅ Show PIN modal for verification
    setShowPinModal(true);
    setStaffPin("");
    setPinError("");
  };

  // ✅ Confirm payment with staff PIN
  const confirmPaymentWithPin = async () => {
    if (!staffPin) {
      setPinError("Please enter staff PIN");
      return;
    }
    
    setProcessing(true);
    setShowPinModal(false);
    
    try {
      const response = await fetch('/api/admin/fees/qr-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          token, 
          amount: paymentAmount,
          staffPin: staffPin,
          remarks: `Payment collected by ${userRole || 'staff'}`
        })
      });
      
      const result = await response.json();
      
      // ✅ If PIN is required but not provided or invalid
      if (result.requirePin) {
        setPinError(result.error || "Invalid staff PIN");
        setShowPinModal(true);
        setProcessing(false);
        return;
      }
      
      if (result.success) {
        alert(result.message);
        verifyQR(); // Refresh data
      } else {
        alert(result.error || 'Payment failed');
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const copyLink = () => {
    const link = window.location.href;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    if (qrData?.qrCodeImage) {
      const link = document.createElement('a');
      link.href = qrData.qrCodeImage;
      link.download = `qr_${qrData?.student?.rollNo || 'student'}_${qrData?.fee?.month || 'fee'}.png`;
      link.click();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 text-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading QR Code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center">
          <div className={`text-5xl mb-4 ${error.reason === 'PAID' ? 'text-green-500' : 'text-red-500'}`}>
            {error.reason === 'PAID' ? '✅' : '⚠️'}
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {error.reason === 'PAID' ? 'Fee Already Paid' : 'QR Code Issue'}
          </h2>
          <p className="text-gray-600">{error.message}</p>
          {error.reason === 'EXPIRED' && (
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Try Again
            </button>
          )}
          {error.reason === 'NETWORK_ERROR' && (
            <button 
              onClick={() => verifyQR()}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-xl p-4 text-center border-b">
          <h1 className="text-xl font-bold text-gray-800">🏫 Fee Payment QR Code</h1>
          <p className="text-sm text-gray-500">Show this QR at fee counter</p>
        </div>
        
        {/* QR CODE IMAGE */}
        <div className="bg-white p-6 text-center">
          <div className="bg-white p-4 rounded-xl inline-block border-2 border-gray-200 shadow-sm">
            {qrData?.qrCodeImage ? (
              <img 
                src={qrData.qrCodeImage} 
                alt="Payment QR Code"
                className="w-64 h-64 mx-auto"
              />
            ) : (
              <div className="w-64 h-64 bg-gray-100 flex flex-col items-center justify-center rounded-lg">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                <p className="text-gray-400 text-sm mt-2">Loading QR...</p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-3 mt-4 justify-center">
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {copied ? <CheckCircle size={16} className="text-green-600" /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button
              onClick={downloadQR}
              disabled={!qrData?.qrCodeImage}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
            >
              <Download size={16} />
              Download QR
            </button>
          </div>
        </div>
        
        {/* Student Details */}
        <div className="bg-white p-4 mt-4 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-blue-500 rounded"></span>
            Student Details
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="font-medium">{qrData?.student?.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Roll No:</span>
              <span>{qrData?.student?.rollNo || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Class:</span>
              <span>{qrData?.student?.className || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Month:</span>
              <span>{qrData?.fee?.month || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        {/* Fee Summary */}
        <div className="bg-white p-4 mt-4 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-green-500 rounded"></span>
            Fee Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Total Fee:</span>
              <span className="font-medium">PKR {qrData?.fee?.totalAmount?.toLocaleString() || 0}</span>
            </div>
            {(qrData?.fee?.paidAmount || 0) > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Already Paid:</span>
                <span className="text-green-600">PKR {qrData?.fee?.paidAmount?.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-semibold">Remaining:</span>
              <span className="font-bold text-red-600">PKR {(qrData?.fee?.remainingAmount || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        {/* ✅ PAYMENT SECTION - ONLY FOR AUTHORIZED STAFF */}
        {(qrData?.fee?.remainingAmount || 0) > 0 && (
          <>
            {isAuthorized ? (
              // ✅ Staff/Admin can process payment
              <div className="bg-white p-4 mt-4 rounded-xl shadow-sm border-2 border-green-200">
                <div className="flex items-center gap-2 mb-3 text-green-700">
                  <Shield size={18} />
                  <h3 className="font-semibold">💵 Process Payment (Staff Only)</h3>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Amount (PKR)
                  </label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    max={qrData?.fee?.remainingAmount || 0}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter amount"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum: PKR {(qrData?.fee?.remainingAmount || 0).toLocaleString()}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(qrData?.fee?.remainingAmount || 0)}
                    className="py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Full Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(Math.floor((qrData?.fee?.remainingAmount || 0) / 2))}
                    className="py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Half Payment
                  </button>
                </div>
                
                <button
                  onClick={handlePayment}
                  disabled={processing || paymentAmount <= 0}
                  className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {processing ? (
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />
                  ) : null}
                  Pay PKR {paymentAmount.toLocaleString()}
                </button>
              </div>
            ) : (
              // ❌ Student/Parent - Payment disabled
              <div className="bg-yellow-50 p-4 mt-4 rounded-xl text-center border border-yellow-200">
                <Shield className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
                <p className="text-yellow-700 font-semibold">🔐 Staff Verification Required</p>
                <p className="text-sm text-yellow-600 mt-1">
                  Please show this QR code at the fee counter.<br />
                  Only authorized staff can process payment.
                </p>
              </div>
            )}
          </>
        )}
        
        {/* Already Paid Message */}
        {(qrData?.fee?.remainingAmount || 0) === 0 && qrData && (
          <div className="bg-green-50 p-4 mt-4 rounded-xl text-center border border-green-200">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
            <p className="text-green-700 font-semibold">✅ Fee Fully Paid!</p>
            <p className="text-sm text-green-600 mt-1">
              Total Paid: PKR {(qrData?.fee?.totalAmount || 0).toLocaleString()}
            </p>
          </div>
        )}
        
        {/* Instructions */}
        <div className="bg-blue-50 p-4 mt-4 rounded-xl text-center">
          <p className="text-sm text-blue-800">
            📖 Show this QR code at school fee counter for payment
          </p>
        </div>
      </div>

      {/* ✅ PIN VERIFICATION MODAL */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <div className="text-center mb-4">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <h3 className="text-lg font-bold">🔐 Staff Verification</h3>
              <p className="text-sm text-gray-600">Enter your staff PIN to process payment</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Staff PIN
              </label>
              <input
                type="password"
                value={staffPin}
                onChange={(e) => {
                  setStaffPin(e.target.value);
                  setPinError("");
                }}
                placeholder="Enter staff PIN"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              {pinError && (
                <p className="text-red-500 text-sm mt-1">{pinError}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowPinModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPaymentWithPin}
                disabled={!staffPin || processing}
                className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin inline mr-1" /> : null}
                Confirm Payment
              </button>
            </div>
            
            <p className="text-xs text-gray-400 text-center mt-4">
              Authorized staff only. Contact admin if you don't have PIN.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}