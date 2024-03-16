import { useState } from 'react';

/**
 * A custom hook for handling loading states and events.
 * 
 * @param {Function} asyncFunction - An async function to be executed within the hook.
 * @returns An object containing the loading state, error state, and a execute function to trigger the async operation.
 */
const useLoading = (asyncFunction) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = async (...args) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await asyncFunction(...args);
            setIsLoading(false);
            return result;
        } catch (err) {
            setIsLoading(false);
            setError(err);
            throw err;
        }
    };

    return { isLoading, error, execute };
};

export default useLoading;
