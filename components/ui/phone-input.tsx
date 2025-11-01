"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

interface Country {
  code: string;
  name: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: "TR", name: "Türkiye", dialCode: "+90" },
  { code: "US", name: "United States", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", dialCode: "+44" },
  { code: "DE", name: "Germany", dialCode: "+49" },
  { code: "FR", name: "France", dialCode: "+33" },
  { code: "IT", name: "Italy", dialCode: "+39" },
  { code: "ES", name: "Spain", dialCode: "+34" },
  { code: "NL", name: "Netherlands", dialCode: "+31" },
  { code: "BE", name: "Belgium", dialCode: "+32" },
  { code: "SE", name: "Sweden", dialCode: "+46" },
  { code: "NO", name: "Norway", dialCode: "+47" },
  { code: "DK", name: "Denmark", dialCode: "+45" },
  { code: "FI", name: "Finland", dialCode: "+358" },
  { code: "PL", name: "Poland", dialCode: "+48" },
  { code: "CZ", name: "Czech Republic", dialCode: "+420" },
  { code: "GR", name: "Greece", dialCode: "+30" },
  { code: "PT", name: "Portugal", dialCode: "+351" },
  { code: "CH", name: "Switzerland", dialCode: "+41" },
  { code: "AT", name: "Austria", dialCode: "+43" },
  { code: "IE", name: "Ireland", dialCode: "+353" },
  { code: "CA", name: "Canada", dialCode: "+1" },
  { code: "AU", name: "Australia", dialCode: "+61" },
  { code: "JP", name: "Japan", dialCode: "+81" },
  { code: "KR", name: "South Korea", dialCode: "+82" },
  { code: "CN", name: "China", dialCode: "+86" },
  { code: "IN", name: "India", dialCode: "+91" },
  { code: "BR", name: "Brazil", dialCode: "+55" },
  { code: "MX", name: "Mexico", dialCode: "+52" },
  { code: "RU", name: "Russia", dialCode: "+7" },
  { code: "AE", name: "UAE", dialCode: "+971" },
  { code: "SA", name: "Saudi Arabia", dialCode: "+966" },
  { code: "SG", name: "Singapore", dialCode: "+65" },
  { code: "MY", name: "Malaysia", dialCode: "+60" },
  { code: "TH", name: "Thailand", dialCode: "+66" },
  { code: "ID", name: "Indonesia", dialCode: "+62" },
  { code: "PH", name: "Philippines", dialCode: "+63" },
  { code: "VN", name: "Vietnam", dialCode: "+84" },
  { code: "ZA", name: "South Africa", dialCode: "+27" },
  { code: "NG", name: "Nigeria", dialCode: "+234" },
  { code: "EG", name: "Egypt", dialCode: "+20" },
  { code: "IL", name: "Israel", dialCode: "+972" },
  { code: "NZ", name: "New Zealand", dialCode: "+64" },
  { code: "AR", name: "Argentina", dialCode: "+54" },
  { code: "CL", name: "Chile", dialCode: "+56" },
  { code: "CO", name: "Colombia", dialCode: "+57" },
  { code: "PE", name: "Peru", dialCode: "+51" },
  { code: "VE", name: "Venezuela", dialCode: "+58" },
  { code: "RO", name: "Romania", dialCode: "+40" },
  { code: "HU", name: "Hungary", dialCode: "+36" },
  { code: "BG", name: "Bulgaria", dialCode: "+359" },
  { code: "HR", name: "Croatia", dialCode: "+385" },
  { code: "SK", name: "Slovakia", dialCode: "+421" },
  { code: "SI", name: "Slovenia", dialCode: "+386" },
  { code: "LT", name: "Lithuania", dialCode: "+370" },
  { code: "LV", name: "Latvia", dialCode: "+371" },
  { code: "EE", name: "Estonia", dialCode: "+372" },
  { code: "LU", name: "Luxembourg", dialCode: "+352" },
  { code: "MT", name: "Malta", dialCode: "+356" },
  { code: "CY", name: "Cyprus", dialCode: "+357" },
  { code: "IS", name: "Iceland", dialCode: "+354" },
  { code: "KW", name: "Kuwait", dialCode: "+965" },
  { code: "QA", name: "Qatar", dialCode: "+974" },
  { code: "OM", name: "Oman", dialCode: "+968" },
  { code: "BH", name: "Bahrain", dialCode: "+973" },
  { code: "JO", name: "Jordan", dialCode: "+962" },
  { code: "LB", name: "Lebanon", dialCode: "+961" },
  { code: "IQ", name: "Iraq", dialCode: "+964" },
  { code: "IR", name: "Iran", dialCode: "+98" },
  { code: "PK", name: "Pakistan", dialCode: "+92" },
  { code: "BD", name: "Bangladesh", dialCode: "+880" },
  { code: "LK", name: "Sri Lanka", dialCode: "+94" },
  { code: "NP", name: "Nepal", dialCode: "+977" },
  { code: "MM", name: "Myanmar", dialCode: "+95" },
  { code: "KH", name: "Cambodia", dialCode: "+855" },
  { code: "LA", name: "Laos", dialCode: "+856" },
  { code: "MO", name: "Macau", dialCode: "+853" },
  { code: "HK", name: "Hong Kong", dialCode: "+852" },
  { code: "TW", name: "Taiwan", dialCode: "+886" },
  { code: "MN", name: "Mongolia", dialCode: "+976" },
  { code: "UZ", name: "Uzbekistan", dialCode: "+998" },
  { code: "KZ", name: "Kazakhstan", dialCode: "+7" },
  { code: "KG", name: "Kyrgyzstan", dialCode: "+996" },
  { code: "TJ", name: "Tajikistan", dialCode: "+992" },
  { code: "TM", name: "Turkmenistan", dialCode: "+993" },
  { code: "AF", name: "Afghanistan", dialCode: "+93" },
  { code: "GE", name: "Georgia", dialCode: "+995" },
  { code: "AM", name: "Armenia", dialCode: "+374" },
  { code: "AZ", name: "Azerbaijan", dialCode: "+994" },
  { code: "BY", name: "Belarus", dialCode: "+375" },
  { code: "MD", name: "Moldova", dialCode: "+373" },
  { code: "UA", name: "Ukraine", dialCode: "+380" },
  { code: "RS", name: "Serbia", dialCode: "+381" },
  { code: "BA", name: "Bosnia and Herzegovina", dialCode: "+387" },
  { code: "ME", name: "Montenegro", dialCode: "+382" },
  { code: "MK", name: "North Macedonia", dialCode: "+389" },
  { code: "AL", name: "Albania", dialCode: "+355" },
  { code: "DZ", name: "Algeria", dialCode: "+213" },
  { code: "MA", name: "Morocco", dialCode: "+212" },
  { code: "TN", name: "Tunisia", dialCode: "+216" },
  { code: "LY", name: "Libya", dialCode: "+218" },
  { code: "SD", name: "Sudan", dialCode: "+249" },
  { code: "ET", name: "Ethiopia", dialCode: "+251" },
  { code: "KE", name: "Kenya", dialCode: "+254" },
  { code: "TZ", name: "Tanzania", dialCode: "+255" },
  { code: "UG", name: "Uganda", dialCode: "+256" },
  { code: "RW", name: "Rwanda", dialCode: "+250" },
  { code: "GH", name: "Ghana", dialCode: "+233" },
  { code: "AO", name: "Angola", dialCode: "+244" },
  { code: "MZ", name: "Mozambique", dialCode: "+258" },
  { code: "ZM", name: "Zambia", dialCode: "+260" },
  { code: "ZW", name: "Zimbabwe", dialCode: "+263" },
  { code: "BW", name: "Botswana", dialCode: "+267" },
  { code: "NA", name: "Namibia", dialCode: "+264" },
  { code: "MW", name: "Malawi", dialCode: "+265" },
  { code: "MG", name: "Madagascar", dialCode: "+261" },
  { code: "MU", name: "Mauritius", dialCode: "+230" },
  { code: "SC", name: "Seychelles", dialCode: "+248" },
  { code: "SN", name: "Senegal", dialCode: "+221" },
  { code: "CI", name: "Ivory Coast", dialCode: "+225" },
  { code: "CM", name: "Cameroon", dialCode: "+237" },
  { code: "GA", name: "Gabon", dialCode: "+241" },
  { code: "CD", name: "DR Congo", dialCode: "+243" },
  { code: "CG", name: "Congo", dialCode: "+242" },
  { code: "CF", name: "Central African Republic", dialCode: "+236" },
  { code: "TD", name: "Chad", dialCode: "+235" },
  { code: "NE", name: "Niger", dialCode: "+227" },
  { code: "ML", name: "Mali", dialCode: "+223" },
  { code: "BF", name: "Burkina Faso", dialCode: "+226" },
  { code: "MR", name: "Mauritania", dialCode: "+222" },
  { code: "GM", name: "Gambia", dialCode: "+220" },
  { code: "GN", name: "Guinea", dialCode: "+224" },
  { code: "GW", name: "Guinea-Bissau", dialCode: "+245" },
  { code: "SL", name: "Sierra Leone", dialCode: "+232" },
  { code: "LR", name: "Liberia", dialCode: "+231" },
  { code: "TG", name: "Togo", dialCode: "+228" },
  { code: "BJ", name: "Benin", dialCode: "+229" },
];

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: string;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value, onChange, defaultCountry = "TR", ...props }, ref) => {
    const language = useLanguageStore((state) => state.language);
    const [selectedCountry, setSelectedCountry] = React.useState<Country>(
      countries.find((c) => c.code === defaultCountry) || countries[0]
    );
    const [isOpen, setIsOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);

    const translations = {
      tr: {
        searchPlaceholder: "Ülke ara...",
        noResults: "Sonuç bulunamadı",
      },
      en: {
        searchPlaceholder: "Search country...",
        noResults: "No results found",
      },
    };

    const t = translations[language];

    // Memoized filtered countries for performance
    const filteredCountries = React.useMemo(() => {
      if (!searchTerm) return countries;
      const lowerSearch = searchTerm.toLowerCase();
      return countries.filter(
        (country) =>
          country.name.toLowerCase().includes(lowerSearch) ||
          country.dialCode.includes(searchTerm)
      );
    }, [searchTerm]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Only allow digits, spaces, and hyphens
      const numericValue = inputValue.replace(/[^\d\s-]/g, "");
      // Only return full number with country code if there's actual phone number
      if (numericValue.trim()) {
        onChange(`${selectedCountry.dialCode} ${numericValue}`);
      } else {
        onChange("");
      }
    };

    const handleCountrySelect = (country: Country) => {
      setSelectedCountry(country);
      // Update phone value with new country code only if there's actual phone number
      const currentNumber = displayValue;
      if (currentNumber.trim()) {
        onChange(`${country.dialCode} ${currentNumber}`);
      } else {
        onChange("");
      }
      setIsOpen(false);
      setSearchTerm("");
    };

    // Separate country code from phone number if needed
    const displayValue = value.replace(/^\+\d+\s*/, "");

    const handleClearSearch = () => {
      setSearchTerm("");
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.phone-dropdown-container')) {
          setIsOpen(false);
          setSearchTerm("");
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    return (
      <div className="relative phone-dropdown-container">
        <div className={`flex ${isFocused || isOpen ? 'ring-2 ring-ring rounded-md' : ''}`}>
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex h-10 items-center gap-2 rounded-l-md border border-input bg-background px-3 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
            >
            <Image
              src={`https://flagcdn.com/w20/${selectedCountry.code.toLowerCase()}.png`}
              alt={selectedCountry.name}
              width={20}
              height={16}
              className="w-5 h-4 object-cover rounded-sm"
            />
            <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            </button>

            {isOpen && (
              <div className="absolute left-0 top-11 z-50 max-h-80 w-72 overflow-hidden rounded-md border border-border bg-background shadow-lg">
              {/* Search input */}
              <div className="sticky top-0 border-b border-border bg-background p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full rounded-md border border-input bg-background px-8 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0"
                    autoFocus
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Countries list */}
              <div className="max-h-64 overflow-auto">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountrySelect(country)}
                      className="flex w-full items-center gap-3 px-4 py-2 hover:bg-accent"
                    >
                      <Image
                        src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                        alt={country.name}
                        width={20}
                        height={16}
                        className="w-5 h-4 object-cover rounded-sm"
                      />
                      <span className="flex-1 text-left text-sm">{country.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {country.dialCode}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                    {t.noResults}
                  </div>
                )}
              </div>
            </div>
            )}
          </div>

          <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          value={displayValue}
          onChange={handlePhoneChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "flex h-10 w-full rounded-r-md border border-l-0 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          {...props}
        />
        </div>
      </div>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

export { PhoneInput, countries };

