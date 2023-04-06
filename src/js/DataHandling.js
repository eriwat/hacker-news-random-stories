// Data handling

import React from 'react';

/**
 * Fetches data from the specified URL using the Fetch API and returns the JSON data.
 * If an error occurs, it logs the error message and re-throws the error.
 *
 * @function
 * @async
 * @param {string} url - The URL to fetch data from.
 * @returns {Promise<Object>} A promise resolving to the fetched JSON data.
 * @throws {Error} If the Fetch API encounters an HTTP error or fails to fetch the data.
 */
export const fetchData = async (url) => {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};