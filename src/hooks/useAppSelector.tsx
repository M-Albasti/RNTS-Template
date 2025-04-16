//* packages import
import {useSelector} from 'react-redux';

//* types import
import {RootState} from '@Types/rootState';

// Use throughout your app instead of plain `useSelector`
export const useAppSelector = useSelector.withTypes<RootState>();
