import { useReducer } from 'react';
import apiFactory from '../api/api-factory';

const initialState = { error: false, isLoading: false, result: null };

const reducer = (currentState, action) => {
    switch (action.type) {
        case 'FETCH':
            return { ...currentState, isLoading: true, error: false };
        case 'RESULT':
            return { isLoading: false, result: action.value, error: false };
        case 'ERROR':
            return { ...initialState, isLoading: false, error: true };
        case 'CLEAR':
            return initialState;
        default:
            return initialState;
    }
};

const useBackend = () => {
    const [fetchState, dispatch] = useReducer(reducer, initialState);

    const clearState = () => dispatch({ type: 'CLEAR' });

    const fetchHomes = (args) => {
        dispatch({ type: 'FETCH' });
        apiFactory.getHomes(args)
            .then(result => dispatch({ type: 'RESULT', value: result }))
            .catch(() => dispatch({ type: 'ERROR' }));
    };

    return [fetchState, fetchHomes, clearState];
};

export default useBackend;
