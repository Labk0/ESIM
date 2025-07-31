import React, {useState, useEffect, useMemo} from 'react';
import {eSIM, FilterState} from '../types';
import {getCountries, getPlansForCountry} from '../services/api';
import ProductListItem from './ProductListItem';
import FilterSection from './FilterSection';
import SkeletonListItem from './SkeletonListItem';

const ProductList: React.FC = () => {
    const [allPlansForCountry, setAllPlansForCountry] = useState<eSIM[]>([]);
    const [allCountries, setAllCountries] = useState<{ ulkeAd: string; ulkeKodu: string }[]>([]);
    const [popularCountries, setPopularCountries] = useState<{ ulkeAd: string; ulkeKodu: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [filters, setFilters] = useState<FilterState>({
        country: 'eur',
        dataQuota: 0,
        validity: 0,
    });

    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                const countriesResponse = await getCountries();

                const popular = Array.isArray(countriesResponse?.popular) ? countriesResponse.popular : [];
                const all = Array.isArray(countriesResponse?.all) ? countriesResponse.all : [];

                setPopularCountries(popular);
                setAllCountries(all);

                setFilters(prev => ({...prev, country: 'eur'}));
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ülkeler yüklenemedi.');
            } finally {
                setLoading(false);
            }
        };
        void loadInitialData();
    }, []);

    useEffect(() => {
        if (filters.country) {
            const loadPlans = async () => {
                setLoading(true);
                setError(null);
                try {
                    const currentCountry = allCountries.find(c => c.ulkeKodu === filters.country);
                    const countryName = currentCountry ? currentCountry.ulkeAd : filters.country;

                    const plansData = await getPlansForCountry(filters.country, countryName);
                    setAllPlansForCountry(plansData);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Seçili ülke için paketler alınamadı.');
                    setAllPlansForCountry([]);
                } finally {
                    setLoading(false);
                }
            };
            void loadPlans();
        }
    }, [filters.country, allCountries]); // Added allCountries to dependency array

    const filteredSIMs = useMemo(() => {
        if (!allPlansForCountry) return [];
        return allPlansForCountry.filter(esim => {
            const dataMatch = filters.dataQuota === 0 || esim.dataQuota === filters.dataQuota;
            const validityMatch = filters.validity === 0 || esim.validity === filters.validity;
            return dataMatch && validityMatch;
        });
    }, [allPlansForCountry, filters.dataQuota, filters.validity]);

    return (
        <div className="space-y-4">
            <FilterSection
                filters={filters}
                onFiltersChange={setFilters}
                popularCountries={popularCountries}
                allCountries={allCountries}
            />

            {error && <p className="text-red-500 text-center">{error}</p>}

            <div className="flex flex-col gap-4">
                {loading ? (
                    Array.from({ length: 5 }).map((_, index) => <SkeletonListItem key={index} />)
                ) : filteredSIMs.length > 0 ? (
                    filteredSIMs.map(esim => (
                        <ProductListItem key={esim.id} esim={esim} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Ürün Bulunamadı</h3>
                        <p className="text-gray-600">Mevcut filtrelerinize uygun eSIM bulunamadı.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;