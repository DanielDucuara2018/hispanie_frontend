import { useMemo } from 'react';

/**
 * Custom hook to format an address string.
 * @param {string} address - The full address string.
 * @returns {string} - The formatted address.
 */
function useFormattedAddress(address) {
  return useMemo(() => {
    if (!address) return '';
    // Split the address into components
    const components = address.split(',').map(component => component.trim());

    // Extract relevant parts
    const number = components[0] || '';
    const street = components[1] || '';
    const postalCode = components[components.length - 2] || '';
    const city = components[5] || '';
    const country = components[components.length - 1] || '';

    // Construct the formatted address
    return `${number} ${street}, ${postalCode} ${city} ${country}`;
  }, [address]);
}

function FormattedAddressWrapper({ address, children }) {
    const formattedAddress = useFormattedAddress(address);
    return formattedAddress
}

export default FormattedAddressWrapper;
