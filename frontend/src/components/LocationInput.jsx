import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2, X, Navigation } from 'lucide-react';
import { searchPlaces } from '../utils/geocoding';

export default function LocationInput({
  label,
  value,
  onChange,
  onSelectLocation,
  placeholder,
  iconColor = 'text-emerald-600',
  required = false,
  autoDetectBtn = null,
}) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Debounced place search
  useEffect(() => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      const results = await searchPlaces(query);
      setSuggestions(results);
      setIsLoading(false);
      setIsOpen(results.length > 0);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) onChange(val);
  };

  const handleSelect = (item) => {
    const chosenName = item.shortName || item.displayName;
    setQuery(chosenName);
    setIsOpen(false);
    if (onChange) onChange(chosenName);
    if (onSelectLocation) {
      onSelectLocation({
        name: chosenName,
        fullName: item.displayName,
        coords: [item.lat, item.lon],
      });
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    if (onChange) onChange('');
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {autoDetectBtn}
      </div>

      <div className="relative">
        <div className={`absolute left-3.5 top-3.5 ${iconColor}`}>
          <MapPin className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          required={required}
          className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-hidden transition"
        />

        <div className="absolute right-3 top-3 flex items-center gap-1.5">
          {isLoading && <Loader2 className="w-4 h-4 animate-spin text-amber-500" />}
          {query && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Autocomplete Dropdown List */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 max-h-64 overflow-y-auto">
          {suggestions.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item)}
              className="w-full px-4 py-2.5 text-left hover:bg-amber-50 flex items-start gap-3 transition border-b border-gray-50 last:border-0"
            >
              <Navigation className="w-4 h-4 text-amber-600 mt-1 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {item.shortName}
                </p>
                <p className="text-xs text-gray-500 truncate">{item.displayName}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
