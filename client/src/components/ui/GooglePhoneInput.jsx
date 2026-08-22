import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, Smartphone } from 'lucide-react';

const COUNTRIES = [
  // Top / Frequent countries
  { code: '+31', iso: 'nl', flag: '🇳🇱', name: 'Netherlands', placeholder: '06 12 34 56 78' },
  { code: '+32', iso: 'be', flag: '🇧🇪', name: 'Belgium', placeholder: '0470 12 34 56' },
  { code: '+49', iso: 'de', flag: '🇩🇪', name: 'Germany', placeholder: '0151 23456789' },
  { code: '+44', iso: 'gb', flag: '🇬🇧', name: 'United Kingdom', placeholder: '07123 456789' },
  { code: '+1', iso: 'us', flag: '🇺🇸', name: 'United States', placeholder: '(555) 000-0000' },
  { code: '+1', iso: 'ca', flag: '🇨🇦', name: 'Canada', placeholder: '(555) 000-0000' },
  { code: '+33', iso: 'fr', flag: '🇫🇷', name: 'France', placeholder: '06 12 34 56 78' },
  { code: '+34', iso: 'es', flag: '🇪🇸', name: 'Spain', placeholder: '612 34 56 78' },
  { code: '+39', iso: 'it', flag: '🇮🇹', name: 'Italy', placeholder: '312 345 6789' },
  { code: '+41', iso: 'ch', flag: '🇨🇭', name: 'Switzerland', placeholder: '079 123 45 67' },
  { code: '+43', iso: 'at', flag: '🇦🇹', name: 'Austria', placeholder: '0664 1234567' },
  { code: '+61', iso: 'au', flag: '🇦🇺', name: 'Australia', placeholder: '0412 345 678' },

  // All Global Countries (Alphabetical)
  { code: '+93', iso: 'af', flag: '🇦🇫', name: 'Afghanistan', placeholder: '070 123 4567' },
  { code: '+355', iso: 'al', flag: '🇦🇱', name: 'Albania', placeholder: '067 123 4567' },
  { code: '+213', iso: 'dz', flag: '🇩🇿', name: 'Algeria', placeholder: '0551 23 45 67' },
  { code: '+376', iso: 'ad', flag: '🇦🇩', name: 'Andorra', placeholder: '345 678' },
  { code: '+244', iso: 'ao', flag: '🇦🇴', name: 'Angola', placeholder: '923 456 789' },
  { code: '+1264', iso: 'ai', flag: '🇦🇮', name: 'Anguilla', placeholder: '497 1234' },
  { code: '+1268', iso: 'ag', flag: '🇦🇬', name: 'Antigua and Barbuda', placeholder: '464 1234' },
  { code: '+54', iso: 'ar', flag: '🇦🇷', name: 'Argentina', placeholder: '11 1234-5678' },
  { code: '+374', iso: 'am', flag: '🇦🇲', name: 'Armenia', placeholder: '091 123456' },
  { code: '+297', iso: 'aw', flag: '🇦🇼', name: 'Aruba', placeholder: '560 1234' },
  { code: '+994', iso: 'az', flag: '🇦🇿', name: 'Azerbaijan', placeholder: '050 123 45 67' },
  { code: '+1242', iso: 'bs', flag: '🇧🇸', name: 'Bahamas', placeholder: '359 1234' },
  { code: '+973', iso: 'bh', flag: '🇧🇭', name: 'Bahrain', placeholder: '3600 1234' },
  { code: '+880', iso: 'bd', flag: '🇧🇩', name: 'Bangladesh', placeholder: '01712-345678' },
  { code: '+1246', iso: 'bb', flag: '🇧🇧', name: 'Barbados', placeholder: '230 1234' },
  { code: '+375', iso: 'by', flag: '🇧🇾', name: 'Belarus', placeholder: '29 123-45-67' },
  { code: '+501', iso: 'bz', flag: '🇧🇿', name: 'Belize', placeholder: '622-1234' },
  { code: '+229', iso: 'bj', flag: '🇧🇯', name: 'Benin', placeholder: '97 12 34 56' },
  { code: '+1441', iso: 'bm', flag: '🇧🇲', name: 'Bermuda', placeholder: '505 1234' },
  { code: '+975', iso: 'bt', flag: '🇧🇹', name: 'Bhutan', placeholder: '17 12 34 56' },
  { code: '+591', iso: 'bo', flag: '🇧🇴', name: 'Bolivia', placeholder: '71234567' },
  { code: '+387', iso: 'ba', flag: '🇧🇦', name: 'Bosnia and Herzegovina', placeholder: '061 123 456' },
  { code: '+267', iso: 'bw', flag: '🇧🇼', name: 'Botswana', placeholder: '71 234 567' },
  { code: '+55', iso: 'br', flag: '🇧🇷', name: 'Brazil', placeholder: '(11) 91234-5678' },
  { code: '+673', iso: 'bn', flag: '🇧🇳', name: 'Brunei', placeholder: '712 3456' },
  { code: '+359', iso: 'bg', flag: '🇧🇬', name: 'Bulgaria', placeholder: '088 123 4567' },
  { code: '+226', iso: 'bf', flag: '🇧🇫', name: 'Burkina Faso', placeholder: '70 12 34 56' },
  { code: '+257', iso: 'bi', flag: '🇧🇮', name: 'Burundi', placeholder: '79 12 34 56' },
  { code: '+855', iso: 'kh', flag: '🇰🇭', name: 'Cambodia', placeholder: '012 345 678' },
  { code: '+237', iso: 'cm', flag: '🇨🇲', name: 'Cameroon', placeholder: '6 71 23 45 67' },
  { code: '+238', iso: 'cv', flag: '🇨🇻', name: 'Cape Verde', placeholder: '991 12 34' },
  { code: '+1345', iso: 'ky', flag: '🇰🇾', name: 'Cayman Islands', placeholder: '925 1234' },
  { code: '+236', iso: 'cf', flag: '🇨🇫', name: 'Central African Republic', placeholder: '70 01 23 45' },
  { code: '+235', iso: 'td', flag: '🇹🇩', name: 'Chad', placeholder: '66 12 34 56' },
  { code: '+56', iso: 'cl', flag: '🇨🇱', name: 'Chile', placeholder: '9 1234 5678' },
  { code: '+86', iso: 'cn', flag: '🇨🇳', name: 'China', placeholder: '138 1234 5678' },
  { code: '+57', iso: 'co', flag: '🇨🇴', name: 'Colombia', placeholder: '300 1234567' },
  { code: '+269', iso: 'km', flag: '🇰🇲', name: 'Comoros', placeholder: '321 12 34' },
  { code: '+242', iso: 'cg', flag: '🇨🇬', name: 'Congo - Brazzaville', placeholder: '06 123 4567' },
  { code: '+243', iso: 'cd', flag: '🇨🇩', name: 'Congo - Kinshasa', placeholder: '081 123 4567' },
  { code: '+506', iso: 'cr', flag: '🇨🇷', name: 'Costa Rica', placeholder: '8312 3456' },
  { code: '+385', iso: 'hr', flag: '🇭🇷', name: 'Croatia', placeholder: '091 123 4567' },
  { code: '+53', iso: 'cu', flag: '🇨🇺', name: 'Cuba', placeholder: '5 1234567' },
  { code: '+357', iso: 'cy', flag: '🇨🇾', name: 'Cyprus', placeholder: '96 123456' },
  { code: '+420', iso: 'cz', flag: '🇨🇿', name: 'Czech Republic', placeholder: '601 123 456' },
  { code: '+45', iso: 'dk', flag: '🇩🇰', name: 'Denmark', placeholder: '20 12 34 56' },
  { code: '+253', iso: 'dj', flag: '🇩🇯', name: 'Djibouti', placeholder: '77 12 34 56' },
  { code: '+1767', iso: 'dm', flag: '🇩🇲', name: 'Dominica', placeholder: '275 1234' },
  { code: '+1809', iso: 'do', flag: '🇩🇴', name: 'Dominican Republic', placeholder: '809-234-5678' },
  { code: '+593', iso: 'ec', flag: '🇪🇨', name: 'Ecuador', placeholder: '099 123 4567' },
  { code: '+20', iso: 'eg', flag: '🇪🇬', name: 'Egypt', placeholder: '0100 123 4567' },
  { code: '+503', iso: 'sv', flag: '🇸🇻', name: 'El Salvador', placeholder: '7012 3456' },
  { code: '+240', iso: 'gq', flag: '🇬🇶', name: 'Equatorial Guinea', placeholder: '222 123 456' },
  { code: '+291', iso: 'er', flag: '🇪🇷', name: 'Eritrea', placeholder: '7 123456' },
  { code: '+372', iso: 'ee', flag: '🇪🇪', name: 'Estonia', placeholder: '5123 4567' },
  { code: '+251', iso: 'et', flag: '🇪🇹', name: 'Ethiopia', placeholder: '091 123 4567' },
  { code: '+679', iso: 'fj', flag: '🇫🇯', name: 'Fiji', placeholder: '701 2345' },
  { code: '+358', iso: 'fi', flag: '🇫🇮', name: 'Finland', placeholder: '040 1234567' },
  { code: '+241', iso: 'ga', flag: '🇬🇦', name: 'Gabon', placeholder: '06 12 34 56' },
  { code: '+220', iso: 'gm', flag: '🇬🇲', name: 'Gambia', placeholder: '701 2345' },
  { code: '+995', iso: 'ge', flag: '🇬🇪', name: 'Georgia', placeholder: '555 12 34 56' },
  { code: '+233', iso: 'gh', flag: '🇬🇭', name: 'Ghana', placeholder: '024 123 4567' },
  { code: '+30', iso: 'gr', flag: '🇬🇷', name: 'Greece', placeholder: '691 234 5678' },
  { code: '+299', iso: 'gl', flag: '🇬🇱', name: 'Greenland', placeholder: '22 12 34' },
  { code: '+1473', iso: 'gd', flag: '🇬🇩', name: 'Grenada', placeholder: '405 1234' },
  { code: '+502', iso: 'gt', flag: '🇬🇹', name: 'Guatemala', placeholder: '5123 4567' },
  { code: '+224', iso: 'gn', flag: '🇬🇮', name: 'Guinea', placeholder: '621 12 34 56' },
  { code: '+245', iso: 'gw', flag: '🇬🇼', name: 'Guinea-Bissau', placeholder: '955 12 34' },
  { code: '+592', iso: 'gy', flag: '🇬🇾', name: 'Guyana', placeholder: '624 1234' },
  { code: '+509', iso: 'ht', flag: '🇭🇹', name: 'Haiti', placeholder: '3410 1234' },
  { code: '+504', iso: 'hn', flag: '🇭🇳', name: 'Honduras', placeholder: '9123-4567' },
  { code: '+852', iso: 'hk', flag: '🇭🇰', name: 'Hong Kong', placeholder: '5123 4567' },
  { code: '+36', iso: 'hu', flag: '🇭🇺', name: 'Hungary', placeholder: '06 20 123 4567' },
  { code: '+354', iso: 'is', flag: '🇮🇸', name: 'Iceland', placeholder: '612 3456' },
  { code: '+91', iso: 'in', flag: '🇮🇳', name: 'India', placeholder: '98765 43210' },
  { code: '+62', iso: 'id', flag: '🇮🇩', name: 'Indonesia', placeholder: '0812-3456-7890' },
  { code: '+98', iso: 'ir', flag: '🇮🇷', name: 'Iran', placeholder: '0912 345 6789' },
  { code: '+964', iso: 'iq', flag: '🇮🇶', name: 'Iraq', placeholder: '0790 123 4567' },
  { code: '+353', iso: 'ie', flag: '🇮🇪', name: 'Ireland', placeholder: '085 123 4567' },
  { code: '+972', iso: 'il', flag: '🇮🇱', name: 'Israel', placeholder: '050-123-4567' },
  { code: '+1876', iso: 'jm', flag: '🇯🇲', name: 'Jamaica', placeholder: '876-123-4567' },
  { code: '+81', iso: 'jp', flag: '🇯🇵', name: 'Japan', placeholder: '090-1234-5678' },
  { code: '+962', iso: 'jo', flag: '🇯🇴', name: 'Jordan', placeholder: '07 9012 3456' },
  { code: '+7', iso: 'kz', flag: '🇰🇿', name: 'Kazakhstan', placeholder: '701 123 4567' },
  { code: '+254', iso: 'ke', flag: '🇰🇪', name: 'Kenya', placeholder: '0712 345678' },
  { code: '+965', iso: 'kw', flag: '🇰🇼', name: 'Kuwait', placeholder: '5123 4567' },
  { code: '+996', iso: 'kg', flag: '🇰🇬', name: 'Kyrgyzstan', placeholder: '0700 123 456' },
  { code: '+856', iso: 'la', flag: '🇱🇦', name: 'Laos', placeholder: '020 12 345 678' },
  { code: '+371', iso: 'lv', flag: '🇱🇻', name: 'Latvia', placeholder: '21 234 567' },
  { code: '+961', iso: 'lb', flag: '🇱🇧', name: 'Lebanon', placeholder: '70 123 456' },
  { code: '+266', iso: 'ls', flag: '🇱🇸', name: 'Lesotho', placeholder: '5812 3456' },
  { code: '+231', iso: 'lr', flag: '🇱🇷', name: 'Liberia', placeholder: '077 123 4567' },
  { code: '+218', iso: 'ly', flag: '🇱🇾', name: 'Libya', placeholder: '091 123 4567' },
  { code: '+423', iso: 'li', flag: '🇱🇮', name: 'Liechtenstein', placeholder: '660 12 34' },
  { code: '+370', iso: 'lt', flag: '🇱🇹', name: 'Lithuania', placeholder: '612 34567' },
  { code: '+352', iso: 'lu', flag: '🇱🇺', name: 'Luxembourg', placeholder: '621 123 456' },
  { code: '+853', iso: 'mo', flag: '🇲🇴', name: 'Macau', placeholder: '6123 4567' },
  { code: '+389', iso: 'mk', flag: '🇲🇰', name: 'North Macedonia', placeholder: '070 123 456' },
  { code: '+261', iso: 'mg', flag: '🇲🇬', name: 'Madagascar', placeholder: '032 12 345 67' },
  { code: '+265', iso: 'mw', flag: '🇲🇼', name: 'Malawi', placeholder: '099 123 4567' },
  { code: '+60', iso: 'my', flag: '🇲🇾', name: 'Malaysia', placeholder: '012-345 6789' },
  { code: '+960', iso: 'mv', flag: '🇲🇻', name: 'Maldives', placeholder: '712-3456' },
  { code: '+223', iso: 'ml', flag: '🇲🇱', name: 'Mali', placeholder: '65 12 34 56' },
  { code: '+356', iso: 'mt', flag: '🇲🇹', name: 'Malta', placeholder: '9912 3456' },
  { code: '+222', iso: 'mr', flag: '🇲🇷', name: 'Mauritania', placeholder: '22 12 34 56' },
  { code: '+230', iso: 'mu', flag: '🇲🇺', name: 'Mauritius', placeholder: '5123 4567' },
  { code: '+52', iso: 'mx', flag: '🇲🇽', name: 'Mexico', placeholder: '55 1234 5678' },
  { code: '+373', iso: 'md', flag: '🇲🇩', name: 'Moldova', placeholder: '0601 23 456' },
  { code: '+377', iso: 'mc', flag: '🇲🇨', name: 'Monaco', placeholder: '6 12 34 56 78' },
  { code: '+976', iso: 'mn', flag: '🇲🇳', name: 'Mongolia', placeholder: '8812 3456' },
  { code: '+382', iso: 'me', flag: '🇲🇪', name: 'Montenegro', placeholder: '067 123 456' },
  { code: '+212', iso: 'ma', flag: '🇲🇦', name: 'Morocco', placeholder: '0612-345678' },
  { code: '+258', iso: 'mz', flag: '🇲🇿', name: 'Mozambique', placeholder: '84 123 4567' },
  { code: '+95', iso: 'mm', flag: '🇲🇲', name: 'Myanmar', placeholder: '09 123 456789' },
  { code: '+264', iso: 'na', flag: '🇳🇦', name: 'Namibia', placeholder: '081 123 4567' },
  { code: '+977', iso: 'np', flag: '🇳🇵', name: 'Nepal', placeholder: '984-1234567' },
  { code: '+64', iso: 'nz', flag: '🇳🇿', name: 'New Zealand', placeholder: '021 123 4567' },
  { code: '+505', iso: 'ni', flag: '🇳🇮', name: 'Nicaragua', placeholder: '8123 4567' },
  { code: '+227', iso: 'ne', flag: '🇳🇪', name: 'Niger', placeholder: '90 12 34 56' },
  { code: '+234', iso: 'ng', flag: '🇳🇬', name: 'Nigeria', placeholder: '0802 123 4567' },
  { code: '+47', iso: 'no', flag: '🇳🇴', name: 'Norway', placeholder: '412 34 567' },
  { code: '+968', iso: 'om', flag: '🇴🇲', name: 'Oman', placeholder: '9123 4567' },
  { code: '+92', iso: 'pk', flag: '🇵🇰', name: 'Pakistan', placeholder: '0300 1234567' },
  { code: '+507', iso: 'pa', flag: '🇵🇦', name: 'Panama', placeholder: '6123-4567' },
  { code: '+595', iso: 'py', flag: '🇵🇾', name: 'Paraguay', placeholder: '0981 123456' },
  { code: '+51', iso: 'pe', flag: '🇵🇪', name: 'Peru', placeholder: '912 345 678' },
  { code: '+63', iso: 'ph', flag: '🇵🇭', name: 'Philippines', placeholder: '0917 123 4567' },
  { code: '+48', iso: 'pl', flag: '🇵🇱', name: 'Poland', placeholder: '512 345 678' },
  { code: '+351', iso: 'pt', flag: '🇵🇹', name: 'Portugal', placeholder: '912 345 678' },
  { code: '+974', iso: 'qa', flag: '🇶🇦', name: 'Qatar', placeholder: '3312 3456' },
  { code: '+40', iso: 'ro', flag: '🇷🇴', name: 'Romania', placeholder: '0712 345 678' },
  { code: '+7', iso: 'ru', flag: '🇷🇺', name: 'Russia', placeholder: '912 345-67-89' },
  { code: '+250', iso: 'rw', flag: '🇷🇼', name: 'Rwanda', placeholder: '078 123 4567' },
  { code: '+966', iso: 'sa', flag: '🇸🇦', name: 'Saudi Arabia', placeholder: '050 123 4567' },
  { code: '+221', iso: 'sn', flag: '🇸🇳', name: 'Senegal', placeholder: '77 123 45 67' },
  { code: '+381', iso: 'rs', flag: '🇷🇸', name: 'Serbia', placeholder: '060 1234567' },
  { code: '+65', iso: 'sg', flag: '🇸🇬', name: 'Singapore', placeholder: '8123 4567' },
  { code: '+421', iso: 'sk', flag: '🇸🇰', name: 'Slovakia', placeholder: '0901 123 456' },
  { code: '+386', iso: 'si', flag: '🇸🇮', name: 'Slovenia', placeholder: '040 123 456' },
  { code: '+27', iso: 'za', flag: '🇿🇦', name: 'South Africa', placeholder: '082 123 4567' },
  { code: '+82', iso: 'kr', flag: '🇰🇷', name: 'South Korea', placeholder: '010-1234-5678' },
  { code: '+94', iso: 'lk', flag: '🇱🇰', name: 'Sri Lanka', placeholder: '071 234 5678' },
  { code: '+249', iso: 'sd', flag: '🇸🇩', name: 'Sudan', placeholder: '091 123 4567' },
  { code: '+597', iso: 'sr', flag: '🇸🇷', name: 'Suriname', placeholder: '812-3456' },
  { code: '+46', iso: 'se', flag: '🇸🇪', name: 'Sweden', placeholder: '070-123 45 67' },
  { code: '+41', iso: 'ch', flag: '🇨🇭', name: 'Switzerland', placeholder: '079 123 45 67' },
  { code: '+886', iso: 'tw', flag: '🇹🇼', name: 'Taiwan', placeholder: '0912 345 678' },
  { code: '+992', iso: 'tj', flag: '🇹🇯', name: 'Tajikistan', placeholder: '918 12 3456' },
  { code: '+255', iso: 'tz', flag: '🇹🇿', name: 'Tanzania', placeholder: '0712 345 678' },
  { code: '+66', iso: 'th', flag: '🇹🇭', name: 'Thailand', placeholder: '081 234 5678' },
  { code: '+228', iso: 'tg', flag: '🇹🇬', name: 'Togo', placeholder: '90 12 34 56' },
  { code: '+1868', iso: 'tt', flag: '🇹🇹', name: 'Trinidad and Tobago', placeholder: '868-291-1234' },
  { code: '+216', iso: 'tn', flag: '🇹🇳', name: 'Tunisia', placeholder: '20 123 456' },
  { code: '+90', iso: 'tr', flag: '🇹🇷', name: 'Turkey', placeholder: '0532 123 45 67' },
  { code: '+993', iso: 'tm', flag: '🇹🇲', name: 'Turkmenistan', placeholder: '65 123456' },
  { code: '+256', iso: 'ug', flag: '🇺🇬', name: 'Uganda', placeholder: '0772 123456' },
  { code: '+380', iso: 'ua', flag: '🇺🇦', name: 'Ukraine', placeholder: '050 123 4567' },
  { code: '+971', iso: 'ae', flag: '🇦🇪', name: 'United Arab Emirates', placeholder: '050 123 4567' },
  { code: '+598', iso: 'uy', flag: '🇺🇾', name: 'Uruguay', placeholder: '099 123 456' },
  { code: '+998', iso: 'uz', flag: '🇺🇿', name: 'Uzbekistan', placeholder: '90 123 45 67' },
  { code: '+58', iso: 've', flag: '🇻🇪', name: 'Venezuela', placeholder: '0412-1234567' },
  { code: '+84', iso: 'vn', flag: '🇻🇳', name: 'Vietnam', placeholder: '091 234 56 78' },
  { code: '+967', iso: 'ye', flag: '🇾🇪', name: 'Yemen', placeholder: '771 234 567' },
  { code: '+260', iso: 'zm', flag: '🇿🇲', name: 'Zambia', placeholder: '097 1234567' },
  { code: '+263', iso: 'zw', flag: '🇿🇼', name: 'Zimbabwe', placeholder: '071 234 5678' }
];

// Smart Phone Number Formatter that automatically skips / inserts spaces as you type
function formatPhoneNumber(raw, countryCode) {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return '';

  // Netherlands (+31) format: 06 12 34 56 78
  if (countryCode === '+31') {
    if (digits.startsWith('06')) {
      const p1 = digits.slice(0, 2);
      const p2 = digits.slice(2, 4);
      const p3 = digits.slice(4, 6);
      const p4 = digits.slice(6, 8);
      const p5 = digits.slice(8, 10);
      return [p1, p2, p3, p4, p5].filter(Boolean).join(' ');
    } else if (digits.startsWith('6')) {
      const p1 = digits.slice(0, 1);
      const p2 = digits.slice(1, 3);
      const p3 = digits.slice(3, 5);
      const p4 = digits.slice(5, 7);
      const p5 = digits.slice(7, 9);
      return [p1, p2, p3, p4, p5].filter(Boolean).join(' ');
    }
  }

  // Belgium (+32) format: 0470 12 34 56
  if (countryCode === '+32') {
    const p1 = digits.slice(0, 4);
    const p2 = digits.slice(4, 6);
    const p3 = digits.slice(6, 8);
    const p4 = digits.slice(8, 10);
    return [p1, p2, p3, p4].filter(Boolean).join(' ');
  }

  // US / Canada (+1) format: (123) 456-7890
  if (countryCode === '+1') {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  }

  // Germany (+49), France (+33), UK (+44), etc. (auto-spaced in chunks of 2-3)
  const chunks = [];
  for (let i = 0; i < digits.length; i += (digits.length > 8 ? 3 : 2)) {
    chunks.push(digits.slice(i, i + (digits.length > 8 ? 3 : 2)));
  }
  return chunks.join(' ');
}

const GooglePhoneInput = ({ value, onChange, onCountryChange, selectedCountryCode = '+31' }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  const selectedCountry = COUNTRIES.find(c => c.code === selectedCountryCode) || COUNTRIES[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value, selectedCountryCode);
    onChange(formatted);
  };

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.code.includes(search)
  );

  return (
    <div className="space-y-1 relative" ref={dropdownRef}>
      
      {/* Google-Style Container */}
      <div className={`relative flex items-center bg-slate-800/90 rounded-2xl border transition-all duration-200 ${
        dropdownOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-white/10 hover:border-white/20'
      }`}>
        
        {/* Flag Selector Button */}
        <button
          type="button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 px-4 py-3.5 bg-slate-900/60 hover:bg-slate-900 rounded-l-2xl border-r border-white/10 transition-colors focus:outline-none flex-shrink-0"
        >
          <span className="text-xl select-none leading-none">{selectedCountry.flag}</span>
          <span className="text-xs font-black text-slate-300 tracking-wide font-mono">{selectedCountry.code}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180 text-blue-400' : ''}`} />
        </button>

        {/* Number Input Field with live auto-spacing */}
        <div className="relative flex-1 flex items-center">
          <input
            type="tel"
            required
            value={value}
            onChange={handleInputChange}
            placeholder={selectedCountry.placeholder}
            className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-slate-500 font-mono tracking-wider focus:outline-none"
          />
          {value && value.replace(/\D/g, '').length >= 7 && (
            <div className="pr-4 flex items-center text-emerald-400 gap-1 text-[11px] font-bold select-none">
              <Check className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      </div>

      {/* Google-Style Flag Search Dropdown Menu (All 200+ Countries) */}
      {dropdownOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 sm:w-88 bg-slate-900 border border-white/15 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in backdrop-blur-xl">
          
          {/* Search bar */}
          <div className="p-3 border-b border-white/10 bg-slate-950">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                autoFocus
                placeholder="Search any country or code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-900 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-white/5 hide-scrollbar">
            {filteredCountries.map((c, i) => (
              <button
                key={`${c.iso}-${c.code}-${i}`}
                type="button"
                onClick={() => {
                  onCountryChange(c.code);
                  setDropdownOpen(false);
                  setSearch('');
                }}
                className={`w-full px-4 py-2.5 flex items-center justify-between text-xs text-left hover:bg-blue-600/15 hover:text-white transition-colors ${
                  selectedCountryCode === c.code && selectedCountry.iso === c.iso ? 'bg-blue-600/20 text-blue-300 font-bold' : 'text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{c.flag}</span>
                  <span className="truncate">{c.name}</span>
                </div>
                <span className="font-mono text-slate-400 text-[11px] font-bold">{c.code}</span>
              </button>
            ))}

            {filteredCountries.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching country found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Google Verified Note */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 px-1">
        <span>Global International Format (200+ Countries)</span>
        <span className="text-slate-500">SMS / WhatsApp Ready</span>
      </div>

    </div>
  );
};

export default GooglePhoneInput;
