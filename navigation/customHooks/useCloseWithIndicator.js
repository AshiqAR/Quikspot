import { useState } from 'react';

function useCloseWithIndicator(actionAsync) {
  const [isLoading, setIsLoading] = useState(false);

  const triggerAction = async () => {
    setIsLoading(true);
    try {
      await actionAsync();
    } finally {
      setIsLoading(false);
    }
  };

  return [triggerAction, isLoading];
}

export default useCloseWithIndicator;
