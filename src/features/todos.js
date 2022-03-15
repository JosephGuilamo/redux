import { combineReducers } from "redux"
import { useDispatch } from "react-redux"

export const setPending = () => {
    return {
        type:'todos/pending'
    }
}

export const setFullfilled = (payload) => ({type: 'todos/fullfilled', payload})
export const setError = e => ({ type: 'todos/error', error: e.message})
export const setComplete = payload => ({type: 'todo/completed', payload})
export const setFilter = (payload) => ({type: 'filter/set', payload})

export const fetchThunk = () => async dispatch => {
    dispatch(setPending())
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos')
        const data =  await response.json()
        const todos = data.slice(0,10)    
    
        dispatch(setFullfilled(todos))
    } catch (e) {
        dispatch(setError())
    }
}

export const filterReducer = ( state = 'all', action) => {
    switch(action.type) {
        case 'filter/set':
            return action.payload
        default:
            return state
    }
}

const initialFetching = { loading: 'idle', error: null}
export const fetchingReducer = (state = initialFetching , action) =>{
    switch (action.type) {
        case 'todos/pending' : {
            return {...state,loading: 'pending'}
        }
        case 'todos/fullfilled': {
            return {...state, loading: 'succeded'}
        }
        case 'todos/error': {
            return { error: action.error, loading: 'rejected'}
        }
        default: {
            return state
        }

    }
}

export const todosReducer = (state = [], action) => {
    switch(action.type) {
        case 'todos/fullfilled' :{
            return action.payload
        }
        case 'todo/add' : {
            return state.concat({...action.payload})
        }
        case 'todo/completed': {
            const newTodos = state.map(todo => {
                if (todo.id === action.payload.id) {
                    return {
                        ...todo, completed: !todo.completed
                    }
                }
                return todo
            })
            return newTodos
        }
        default:
            return state
    }
}

export const reducer = combineReducers({
    todos: combineReducers({
        entities:todosReducer,
        status: fetchingReducer,
    }),
    filter: filterReducer,
})


export const selectTodos = (state) => {
    const {todos: {entities},filter} = state

    if (filter === 'completed') {
        return entities.filter(todo => todo.completed)
    }

    if (filter === 'incompleted') {
        return entities.filter(todo => !todo.completed)
    }

    return entities
}

export const selectStatus = state => state.todos.status

export const TodoItem = ({todo}) => {
    const dispatch = useDispatch()
    return (
        <li 
            style={{textDecoration: todo.completed ? 'line-through': 'none'}}
            onClick={() => dispatch(setComplete(todo))}
        >{todo.title}
        
        </li>
    )
}