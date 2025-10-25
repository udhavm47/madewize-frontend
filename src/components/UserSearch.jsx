import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI } from '../services/api';

const UserSearch = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchType, setSearchType] = useState('all'); // 'all', 'users', 'companies'
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        if (onClose) onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchType]);

  const performSearch = async (query) => {
    try {
      setLoading(true);
      const response = await usersAPI.searchUsers(query, 10, searchType);
      if (response.data.success) {
        setSearchResults(response.data.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId, isCompany = false) => {
    if (isCompany) {
      navigate(`/company/${userId}`);
    } else {
      navigate(`/user/${userId}`);
    }
    setShowResults(false);
    if (onClose) onClose();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search users, companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-2 mt-2">
        <button
          onClick={() => setSearchType('all')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            searchType === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setSearchType('users')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            searchType === 'users' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setSearchType('companies')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            searchType === 'companies' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Companies
        </button>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="py-1">
              {searchResults.map((item) => {
                const isCompany = searchType === 'companies' || (searchType === 'all' && item.companyName);
                return (
                  <div
                    key={item._id}
                    onClick={() => handleUserClick(item._id, isCompany)}
                    className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompany 
                            ? 'bg-gradient-to-r from-orange-500 to-blue-600' 
                            : 'bg-gradient-to-r from-blue-500 to-purple-600'
                        }`}>
                          <span className="text-white font-semibold text-sm">
                            {isCompany 
                              ? (item.companyName?.charAt(0).toUpperCase() || 'C')
                              : (item.username?.charAt(0).toUpperCase() || 'U')
                            }
                          </span>
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {isCompany ? item.companyName : item.username}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            isCompany 
                              ? 'bg-orange-100 text-orange-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {isCompany ? 'Company' : `${item.profileCompletionPercentage}% Complete`}
                          </span>
                        </div>
                        {isCompany ? (
                          <>
                            {item.companyDescription && (
                              <p className="text-xs text-gray-500 truncate mt-1">
                                {item.companyDescription}
                              </p>
                            )}
                            {item.vendors && item.vendors.length > 0 && (
                              <p className="text-xs text-gray-400 mt-1">
                                Vendors: {item.vendors.slice(0, 2).join(', ')}
                                {item.vendors.length > 2 && ` +${item.vendors.length - 2} more`}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-gray-600 truncate">
                              {item.companyName}
                            </p>
                            {item.companyDescription && (
                              <p className="text-xs text-gray-500 truncate mt-1">
                                {item.companyDescription}
                              </p>
                            )}
                          </>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {isCompany ? 'Company' : 'User'} • Joined {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : searchQuery.trim().length >= 2 ? (
            <div className="px-4 py-8 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try searching with different keywords
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
