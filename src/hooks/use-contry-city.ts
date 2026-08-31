// ============================================
// hooks/useCountryCity.ts
// ============================================

import { useState, useMemo, useCallback } from "react";

// Types
interface CountryOption {
  value: string;
  label: string;
}

interface CityOption {
  value: string;
  label: string;
}

interface CountryData {
  country: CountryOption & { code: string };
  cities: CityOption[];
}

// Données statiques
const countryCityData: Record<string, CountryData> = {
  MAROC: {
    country: { value: "MAROC", label: "Maroc", code: "+212" },
    cities: [
      { value: "CASABLANCA", label: "Casablanca" },
      { value: "RABAT", label: "Rabat" },
      { value: "MARRAKECH", label: "Marrakech" },
      { value: "FES", label: "Fès" },
      { value: "TANGER", label: "Tanger" },
      { value: "AGADIR", label: "Agadir" },
      { value: "MEKNES", label: "Meknès" },
      { value: "OUJDA", label: "Oujda" },
      { value: "KENITRA", label: "Kénitra" },
      { value: "TETOUAN", label: "Tétouan" },
      { value: "SALE", label: "Salé" },
      { value: "NADOR", label: "Nador" },
      { value: "BENI_MELLAL", label: "Beni Mellal" },
      { value: "ERRACHIDIA", label: "Errachidia" },
      { value: "GUELMIM", label: "Guelmim" },
      { value: "LAAYOUNE", label: "Laâyoune" },
      { value: "OUEZZANE", label: "Ouezzane" },
      { value: "SAFI", label: "Safi" },
      { value: "SETTAT", label: "Settat" },
      { value: "TAOUNATE", label: "Taounate" },
      { value: "TARFAYA", label: "Tarfaya" },
      { value: "TAZA", label: "Taza" },
      { value: "TIZNIT", label: "Tiznit" },
    ],
  },
  FRANCE: {
    country: { value: "FRANCE", label: "France", code: "+33" },
    cities: [
      { value: "PARIS", label: "Paris" },
      { value: "MARSEILLE", label: "Marseille" },
      { value: "LYON", label: "Lyon" },
      { value: "TOULOUSE", label: "Toulouse" },
      { value: "NICE", label: "Nice" },
      { value: "NANTES", label: "Nantes" },
      { value: "MONTPELLIER", label: "Montpellier" },
      { value: "STRASBOURG", label: "Strasbourg" },
      { value: "BORDEAUX", label: "Bordeaux" },
      { value: "LILLE", label: "Lille" },
      { value: "RENNES", label: "Rennes" },
      { value: "REIMS", label: "Reims" },
      { value: "LE_HAVRE", label: "Le Havre" },
      { value: "SAINT_ETIENNE", label: "Saint-Étienne" },
      { value: "TOULON", label: "Toulon" },
      { value: "GRENOBLE", label: "Grenoble" },
      { value: "DIJON", label: "Dijon" },
      { value: "ANGERS", label: "Angers" },
      { value: "NIMES", label: "Nîmes" },
      { value: "VILLEURBANNE", label: "Villeurbanne" },
    ],
  },
  ETATS_UNIS: {
    country: { value: "ETATS_UNIS", label: "États-Unis", code: "+1" },
    cities: [
      { value: "NEW_YORK", label: "New York" },
      { value: "LOS_ANGELES", label: "Los Angeles" },
      { value: "CHICAGO", label: "Chicago" },
      { value: "HOUSTON", label: "Houston" },
      { value: "PHOENIX", label: "Phoenix" },
      { value: "PHILADELPHIA", label: "Philadelphia" },
      { value: "SAN_ANTONIO", label: "San Antonio" },
      { value: "SAN_DIEGO", label: "San Diego" },
      { value: "DALLAS", label: "Dallas" },
      { value: "SAN_JOSE", label: "San Jose" },
      { value: "AUSTIN", label: "Austin" },
      { value: "JACKSONVILLE", label: "Jacksonville" },
      { value: "FORT_WORTH", label: "Fort Worth" },
      { value: "COLUMBUS", label: "Columbus" },
      { value: "CHARLOTTE", label: "Charlotte" },
      { value: "SAN_FRANCISCO", label: "San Francisco" },
      { value: "INDIANAPOLIS", label: "Indianapolis" },
      { value: "SEATTLE", label: "Seattle" },
      { value: "DENVER", label: "Denver" },
      { value: "WASHINGTON", label: "Washington" },
    ],
  },
  ESPAGNE: {
    country: { value: "ESPAGNE", label: "Espagne", code: "+34" },
    cities: [
      { value: "MADRID", label: "Madrid" },
      { value: "BARCELONE", label: "Barcelone" },
      { value: "VALENCE", label: "Valence" },
      { value: "SEVILLE", label: "Séville" },
      { value: "SARAGOSSE", label: "Saragosse" },
      { value: "MALAGA", label: "Malaga" },
      { value: "MURCIE", label: "Murcie" },
      { value: "PALMA", label: "Palma" },
      { value: "LAS_PALMAS", label: "Las Palmas" },
      { value: "BILBAO", label: "Bilbao" },
      { value: "ALICANTE", label: "Alicante" },
      { value: "CORDOUE", label: "Cordoue" },
      { value: "VALLADOLID", label: "Valladolid" },
      { value: "VIGO", label: "Vigo" },
      { value: "GIJON", label: "Gijón" },
      { value: "HOSPITALET", label: "L'Hospitalet" },
    ],
  },
  ITALIE: {
    country: { value: "ITALIE", label: "Italie", code: "+39" },
    cities: [
      { value: "ROME", label: "Rome" },
      { value: "MILAN", label: "Milan" },
      { value: "NAPLES", label: "Naples" },
      { value: "TURIN", label: "Turin" },
      { value: "FLORENCE", label: "Florence" },
      { value: "VENISE", label: "Venise" },
      { value: "BOLOGNE", label: "Bologne" },
      { value: "GENES", label: "Gênes" },
      { value: "PALERME", label: "Palerme" },
      { value: "VERONE", label: "Vérone" },
    ],
  },
  ALLEMAGNE: {
    country: { value: "ALLEMAGNE", label: "Allemagne", code: "+49" },
    cities: [
      { value: "BERLIN", label: "Berlin" },
      { value: "HAMBURG", label: "Hambourg" },
      { value: "MUNICH", label: "Munich" },
      { value: "COLOGNE", label: "Cologne" },
      { value: "FRANCFORT", label: "Francfort" },
      { value: "STUTTGART", label: "Stuttgart" },
      { value: "DUSSELDORF", label: "Düsseldorf" },
      { value: "DORTMUND", label: "Dortmund" },
      { value: "ESSEN", label: "Essen" },
      { value: "LEIPZIG", label: "Leipzig" },
      { value: "BREMEN", label: "Brême" },
      { value: "DRESDE", label: "Dresde" },
    ],
  },
  ROYAUME_UNI: {
    country: { value: "ROYAUME_UNI", label: "Royaume-Uni", code: "+44" },
    cities: [
      { value: "LONDRES", label: "Londres" },
      { value: "MANCHESTER", label: "Manchester" },
      { value: "BIRMINGHAM", label: "Birmingham" },
      { value: "GLASGOW", label: "Glasgow" },
      { value: "LIVERPOOL", label: "Liverpool" },
      { value: "EDIMBOURG", label: "Édimbourg" },
      { value: "LEEDS", label: "Leeds" },
      { value: "SHEFFIELD", label: "Sheffield" },
      { value: "BRISTOL", label: "Bristol" },
      { value: "NEWCASTLE", label: "Newcastle" },
    ],
  },
  CANADA: {
    country: { value: "CANADA", label: "Canada", code: "+1" },
    cities: [
      { value: "TORONTO", label: "Toronto" },
      { value: "VANCOUVER", label: "Vancouver" },
      { value: "MONTREAL", label: "Montréal" },
      { value: "CALGARY", label: "Calgary" },
      { value: "OTTAWA", label: "Ottawa" },
      { value: "EDMONTON", label: "Edmonton" },
      { value: "QUEBEC", label: "Québec" },
      { value: "WINNIPEG", label: "Winnipeg" },
      { value: "HAMILTON", label: "Hamilton" },
    ],
  },
  BELGIQUE: {
    country: { value: "BELGIQUE", label: "Belgique", code: "+32" },
    cities: [
      { value: "BRUXELLES", label: "Bruxelles" },
      { value: "ANVERS", label: "Anvers" },
      { value: "GAND", label: "Gand" },
      { value: "LIEGE", label: "Liège" },
      { value: "CHARLEROI", label: "Charleroi" },
      { value: "BRUGES", label: "Bruges" },
      { value: "NAMUR", label: "Namur" },
      { value: "LEUVEN", label: "Louvain" },
    ],
  },
  SUISSE: {
    country: { value: "SUISSE", label: "Suisse", code: "+41" },
    cities: [
      { value: "ZURICH", label: "Zurich" },
      { value: "GENEVE", label: "Genève" },
      { value: "BALE", label: "Bâle" },
      { value: "BERNE", label: "Berne" },
      { value: "LAUSANNE", label: "Lausanne" },
      { value: "LUCERNE", label: "Lucerne" },
      { value: "ST_GALL", label: "Saint-Gall" },
      { value: "LUGANO", label: "Lugano" },
    ],
  },
};

export const useCountryCity = (
  initialCountry: string = "",
  initialCity: string = "",
) => {
  const [selectedCountry, setSelectedCountry] =
    useState<string>(initialCountry);
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);

  const countryOptions: CountryOption[] = useMemo(() => {
    return Object.values(countryCityData).map((item) => ({
      value: item.country.value,
      label: item.country.label,
    }));
  }, []);

  const cityOptions: CityOption[] = useMemo(() => {
    if (!selectedCountry) return [];
    if (!countryCityData.hasOwnProperty(selectedCountry)) return [];
    return countryCityData[selectedCountry].cities.map((city) => ({
      value: city.value,
      label: city.label,
    }));
  }, [selectedCountry]);

  const handleCountryChange = useCallback((value: string) => {
    setSelectedCountry(value);
    setSelectedCity("");
  }, []);

  const handleCityChange = useCallback((value: string) => {
    setSelectedCity(value);
  }, []);

  const reset = useCallback(() => {
    setSelectedCountry("");
    setSelectedCity("");
  }, []);

  return {
    selectedCountry,
    selectedCity,
    countryOptions,
    cityOptions,
    handleCountryChange,
    handleCityChange,
    reset,
    isCountrySelected: !!selectedCountry,
    isCitySelected: !!selectedCity,
    hasCities: cityOptions.length > 0,
  };
};

export default useCountryCity;
