import {useReducer } from "react" //importer de la bibliotheque react pour pouvoir gérer les états complexe des actions 
import "./App.css"
import DigitButton from "./button" 
import OperationButton from "./OpButton" 


export const actions = { //nommer les opérations qu'on va utiliser 
  ADD: 'add-digit', //addition
  CHOOSE_OP: 'choose-operation',
  CLEAR: 'clear', //supprimer
  DELETE:'delete-digit', //effacer
  EVALUATE: 'evaluate', //resultat
}


function reducer(state, {type, payload}){ //gère les états de nos calculs
  switch(type){ 
    case actions.ADD: //si c'esdt une addition 
      if(state.overwrite){
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand ==="0") {  //ne pas répeter le 0
        return state
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) { //possibilités d'avoir qu'une virgule 
        return state
      }
      return{
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }
      case actions.CHOOSE_OP:
        if (state.currentOperand == null && state.previousOperand == null) {
          return state
        }
        if (state.currentOperand == null ) {
          return {
            ...state,
            operation: payload.operation
          }
        }
        if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,
          }
        }

        return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null
        }
      case actions.CLEAR: //si supprimer 
        return {} //retourner rien 
      case actions.DELETE: //si effacer
        if(state.overwrite) {
          return {
            ...state,
            overwrite: false, 
            currentOperand: null
          }
        }
        if (state.currentOperand == null) return state 
        if (state.currentOperand.length === 1) {
          return { ...state, currentOperand: null}
        }

        return {
          ...state,
          currentOperand: state.currentOperand.slice(0, -1)
        }
      case actions.EVALUATE: //si = 
        if (
          state.operation == null || 
          state.currentOperand == null || 
          state.previousOperand == null
        ){
          return state
        }

        return {
          ...state,
          overwrite: true,
          previousOperand: null,
          operation: null,
          currentOperand: evaluate(state),
        }
  }
}

function evaluate({ currentOperand, previousOperand, operation}) { //mise en place des calcul 
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if(isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch (operation){
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current 
      break
    case "*":
      computation = prev * current 
      break
    case "/":
      computation = prev / current 
      break
  }

  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", { //séparer les parties entières et les parties décimale 
  maximumFractionDigits: 0,
})
function formatOperand(operand){
  if(operand == null) return 
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() { //partie visible 
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {}) //initialiser l'états de la calculatrice 
  return (
    <>
      <h1> My Calculator</h1>
      <div className="tablet">
      
        <div className="result">
            <div className="last-result">{formatOperand(previousOperand)}{operation}</div>
            <div className="current-result">{formatOperand(currentOperand)}</div>
          </div>
          <button className="span-two" onClick={() => dispatch({ type: actions.CLEAR })}>Suprimer</button>
          <button onClick={() => dispatch({ type: actions.DELETE})}>Effacer</button>
          <OperationButton operation="/" dispatch={dispatch}/>
          <DigitButton digit="7" dispatch={dispatch}/>
          <DigitButton digit="8" dispatch={dispatch}/>
          <DigitButton digit="9" dispatch={dispatch}/>
          <OperationButton operation="*" dispatch={dispatch}/>
          <DigitButton digit="4" dispatch={dispatch}/>
          <DigitButton digit="5" dispatch={dispatch}/>
          <DigitButton digit="6" dispatch={dispatch}/>
          <OperationButton operation="-" dispatch={dispatch}/>
          <DigitButton digit="1" dispatch={dispatch}/>
          <DigitButton digit="2" dispatch={dispatch}/>
          <DigitButton digit="3" dispatch={dispatch}/>
          <OperationButton operation="+" dispatch={dispatch}/>
          <DigitButton digit="0" dispatch={dispatch}/>
          <DigitButton digit="." dispatch={dispatch}/>
          <button className="span-two" onClick={() => dispatch({ type: actions.EVALUATE })}>=</button>
        </div>
    </>
  );
}

export default App;
