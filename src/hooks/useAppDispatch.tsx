import {useDispatch} from 'react-redux';
import {AppDispatch} from '@Types/appDispatch';

// Use throughout your app instead of plain `useDispatch`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
