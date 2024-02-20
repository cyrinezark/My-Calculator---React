import { actions} from './App'

export default function DigitButton ({dispatch, digit }){
    return <button onClick={() => dispatch({type: actions.ADD, payload: { digit}})}>
    {digit}
    </button>
}