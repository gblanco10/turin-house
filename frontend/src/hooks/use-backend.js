import { useReducer } from 'react';
import apiFactory from '../api/api-factory';

const initialState = {error:false, isLoading: false, result: null }

const reducer = (currentState, action) => {
    switch (action.type) {
        case 'FETCH':
            return {
                ...currentState,
                isLoading: true,
                error:false
            }
        case 'RESULT':
            return {
                isLoading: false,
                result:action.value,
                error:false
            }
        case 'ERROR':
            return {
                ...initialState,
                isLoading: false,
                error:true
            }
    }
    return initialState
}

const useBackend = (endpoint) => {

    const [fetchState, dispatch] = useReducer(reducer, initialState)

    const fetchHomes = (args) => {
        dispatch({ type: 'FETCH' })

        apiFactory.getHomes(args).then(result => {
                console.log(result)
                dispatch({type:'RESULT',value:result})
            }).catch((error)=>{
                console.error(error)
                dispatch({type:'ERROR'})
            })
    }
    const fetchRoutes = (args) => {
        dispatch({type:'FETCH'})
        apiFactory.getRoutes(args).then(result => {
                dispatch({type:'RESULT',value:{}})
            }).catch(() => {
                dispatch({type:'ERROR'})
            })
    }
    if (endpoint === 'HOMES')
        return [fetchState,fetchHomes]
    else
        return [fetchState,fetchRoutes]
}

export default useBackend;