import React from 'react';
import { FilterState } from '../types';

interface FilterSectionProps {
  filters: FilterState;
  onFiltersChange: (newFilters: FilterState) => void;
  popularCountries: { ulkeAd: string; ulkeKodu: string }[];
  allCountries: { ulkeAd: string; ulkeKodu: string }[];
}
const FilterSection: React.FC<FilterSectionProps> = ({
                                                       filters,
                                                       onFiltersChange,
                                                       popularCountries,
                                                       allCountries,
                                                     }) => {
  const handleFilterChange = (key: keyof FilterState, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const dataQuotaOptions = [1, 2, 5, 10, 20, 50, 'Sınırsız'];
  const validityOptions = [7, 15, 30];

  return (
      <div className="bg-white rounded-xl shadow-md border border-pink-100 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">eSIM Filtrele</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">


          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ülke</label>
            <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white"
            >
              {popularCountries.map(country => (
                  <option key={'pop-' + country.ulkeKodu} value={country.ulkeKodu} className="text-blue-600 bg-blue-50">
                    {country.ulkeAd}
                  </option>
              ))}
              {allCountries.map(country => (
                  <option key={'all-' + country.ulkeKodu} value={country.ulkeKodu}>
                    {country.ulkeAd}
                  </option>
              ))}
            </select>
          </div>

          {/* FİLTRE: KOTA */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kota (GB)</label>
            <select
                value={filters.dataQuota}
                onChange={(e) => handleFilterChange('dataQuota', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white"
            >
              <option value={0}>Tümü</option>
              {dataQuotaOptions.map(quota => (
                  <option key={quota} value={quota}>{quota} GB</option>
              ))}
            </select>
          </div>

          {/* FİLTRE: GEÇERLİLİK */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Geçerlilik (Gün)</label>
            <select
                value={filters.validity}
                onChange={(e) => handleFilterChange('validity', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all bg-white"
            >
              <option value={0}>Tümü</option>
              {validityOptions.map(days => (
                  <option key={days} value={days}>{days} Gün</option>
              ))}
            </select>
          </div>
        </div>
      </div>
  );
};

export default FilterSection;