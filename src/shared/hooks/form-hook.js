import {useCallback,useReducer} from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };
    case 'set_data':
      return{
        inputs:action.inputs,  
        isValid:action.isValid,
      }
    default:
      return state;
  }
};

export const useForm=(initialInputs,initialFormValidity)=>{
    const [formState, dispatch] = useReducer(formReducer, {
      inputs:initialInputs,
      isValid: initialFormValidity,
    });

    const inputHandler = useCallback((id, value, isValid) => {
      dispatch({
        type: "INPUT_CHANGE",
        value: value,
        isValid: isValid,
        inputId: id,
      });
    }, []);

    const setFormData=useCallback((inputs,isValid)=>{
      dispatch({
        type:'set_data',
        inputs:inputs,
        isvalid:isValid,
      })
    },[]);
    
    return [inputHandler,formState,setFormData];
}