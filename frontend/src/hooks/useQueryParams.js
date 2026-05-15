import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateParams = useCallback(
    (updates) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          Object.entries(updates).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
              next.set(key, value);
            } else {
              next.delete(key);
            }
          });
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  return { params: searchParams, updateParams };
};

export default useQueryParams;
