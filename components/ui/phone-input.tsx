'use client';

import PhoneInputWithCountry from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export function PhoneInput({ value, onChange, id }: PhoneInputProps) {
  return (
    <div className="phone-input-wrapper">
      <PhoneInputWithCountry
        international
        defaultCountry="US"
        value={value}
        onChange={(val) => onChange(val || '')}
        id={id}
        placeholder="Enter phone number"
      />
      <style jsx global>{`
        .phone-input-wrapper .PhoneInput {
          display: flex;
          align-items: center;
          border: 1px solid #D7D7D7;
          border-radius: 7px;
          height: 44px;
          overflow: hidden;
        }

        .phone-input-wrapper .PhoneInputCountry {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border-right: 1px solid #D7D7D7;
          height: 100%;
          background: transparent;
          transition: background-color 0.2s;
        }

        .phone-input-wrapper .PhoneInputCountry:hover {
          background-color: #F9FAFB;
        }

        .phone-input-wrapper .PhoneInputCountryIcon {
          width: 24px;
          height: 24px;
          font-size: 20px;
        }

        .phone-input-wrapper .PhoneInputCountryIcon--border {
          box-shadow: none;
          background-color: transparent;
        }

        .phone-input-wrapper .PhoneInputCountrySelectArrow {
          width: 14px;
          height: 14px;
          color: #66717D;
          border: none;
          opacity: 1;
        }

        .phone-input-wrapper .PhoneInputInput {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 16px;
          color: #102C4A;
          padding: 0 12px;
          height: 100%;
        }

        .phone-input-wrapper .PhoneInputInput::placeholder {
          color: #9CA3AF;
        }

        .phone-input-wrapper .PhoneInputCountrySelect {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          border: 1px solid #D7D7D7;
          border-radius: 7px;
          background: white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          max-height: 240px;
          overflow-y: auto;
          z-index: 20;
        }

        .phone-input-wrapper .PhoneInputCountrySelect option {
          padding: 10px 12px;
          font-size: 14px;
          color: #102C4A;
        }
      `}</style>
    </div>
  );
}
