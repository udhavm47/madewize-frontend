import { useState } from 'react';

const ProfileCompletionModal = ({ user, onClose, onCompleteProfile }) => {
  const [showModal, setShowModal] = useState(true);

  const handleClose = () => {
    setShowModal(false);
    onClose();
  };

  const handleCompleteProfile = () => {
    setShowModal(false);
    onCompleteProfile();
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="relative rounded-2xl max-w-2xl w-full shadow-2xl border border-gray-700 bg-gray-900/95 backdrop-blur-sm"
        style={{
          backgroundImage: 'url("/bg.avif")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70 rounded-2xl"></div>
        
        {/* Content */}
        <div className="relative z-10 p-8">
          <div className="text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Complete Your Profile
            </h2>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Profile Completion</span>
                <span>{user?.profileCompletionPercentage || 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${user?.profileCompletionPercentage || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Message */}
            <div className="text-gray-300 mb-8 space-y-4">
              <p className="text-lg">
                Your profile is <span className="text-yellow-400 font-semibold">{user?.profileCompletionPercentage || 0}% complete</span>
              </p>
              <p className="text-sm">
                Complete your profile to get better reach and growth opportunities. 
                Add your company details, certifications, and showcase your manufacturing capabilities.
              </p>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Better Reach</h3>
                <p className="text-gray-400 text-xs">Get discovered by more buyers</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">More Connections</h3>
                <p className="text-gray-400 text-xs">Build your professional network</p>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">Trust & Credibility</h3>
                <p className="text-gray-400 text-xs">Showcase your expertise</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 border border-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Maybe Later
              </button>
              <button
                onClick={handleCompleteProfile}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold rounded-lg transition-all duration-200 shadow-lg"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Complete Profile Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
