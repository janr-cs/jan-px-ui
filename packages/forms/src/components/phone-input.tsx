import React from "react";
import { cn } from "@px-ui/core";
import PhoneInputLib from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GoogleLibPhoneNumber from "google-libphonenumber";

const phoneUtil = GoogleLibPhoneNumber.PhoneNumberUtil.getInstance();
const PNF = GoogleLibPhoneNumber.PhoneNumberFormat;

export const validatePhoneNumber = (
  value: string | undefined | null,
  country?: string,
): boolean => {
  if (!value) return true;
  const phoneValue = value.startsWith("+") ? value : "+" + value;
  try {
    const parsed = phoneUtil.parseAndKeepRawInput(phoneValue, country);
    return phoneUtil.isValidNumberForRegion(parsed, country);
  } catch {
    return false;
  }
};

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  country?: string;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const PhoneInput = ({
  value,
  onChange,
  country = "us",
  error,
  errorMessage,
  placeholder,
  disabled,
  className,
}: PhoneInputProps) => {
  const handleChange = (inputValue: string, data: any) => {
    if (!inputValue) {
      onChange("");
      return;
    }

    const phoneValue = inputValue.startsWith("+")
      ? inputValue
      : "+" + inputValue;

    try {
      const parsedNumber = phoneUtil.parseAndKeepRawInput(
        phoneValue,
        data.countryCode,
      );
      if (phoneUtil.isValidNumberForRegion(parsedNumber, data.countryCode)) {
        onChange(phoneUtil.format(parsedNumber, PNF.E164));
        return;
      }
    } catch {
      // fall through — pass raw value up so RHF validate can flag it
    }
    onChange(phoneValue);
  };

  return (
    <div className={cn("flex w-full flex-col gap-1", className)}>
      <div className={`relative ${error ? "phone-input-error" : ""}`}>
        <PhoneInputLib
          country={country}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          inputClass={`!w-full !h-11 !text-base !rounded-lg !border ${
            error
              ? "!border-red-500 !bg-red-50"
              : "!border-gray-300 focus:!border-blue-500 focus:!ring-1 focus:!ring-blue-500"
          }`}
          buttonClass={`!rounded-l-lg !border-y !border-l ${
            error ? "!border-red-500 !bg-red-50" : "!border-gray-300"
          }`}
          containerClass="!w-full"
        />
      </div>

      {error && errorMessage && (
        <p className="mt-1 text-xs font-medium text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};
