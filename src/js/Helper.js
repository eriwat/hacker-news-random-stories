// Helper
import React from 'react';

/**
 * LoadingSpinner renders a loading spinner.
 *
 * @function
 * @returns {JSX.Element} The JSX element for a loading spinner.
 */
export const LoadingSpinner = () => (
    <div className="loading-spinner" aria-hidden={true}>
        <div className="spinner"></div>
    </div>
);

/**
 * It adds the 'fade-in' CSS class to the target element of the given event,
 * typically used to apply a fade-in effect to an image.
 *
 * @function
 * @param {Event} event - The event of the target element which the fade-in effect is applied to.
 */
export const addFadeInEffectToImage = (event) => {
    event.target.classList.add("fade-in");
};