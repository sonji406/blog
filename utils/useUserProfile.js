import { useState, useEffect } from 'react';
import axios from 'axios';

export const useUserProfile = (userId, session) => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/profile/${userId}`);
        if (response.data.status !== 200) {
          throw new Error(response.data.message);
        }
        setUserProfile(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, session]);

  return { userProfile, loading, error };
};
