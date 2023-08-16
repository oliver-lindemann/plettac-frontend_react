import { useContext } from 'react';
import AuthContext from '../../app/context/AuthContext';

export default function useAuth() {
  return useContext(AuthContext);
}
