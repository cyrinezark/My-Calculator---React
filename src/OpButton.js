import { actions} from './App'

export default function OperationButton ({dispatch, operation }){
    return <button onClick={() => dispatch({type: actions.CHOOSE_OP, payload: { operation}})}>
    {operation}
    </button>
}