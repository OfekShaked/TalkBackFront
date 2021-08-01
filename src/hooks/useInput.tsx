import { useState } from "react";


const useInput = (initalValue:any) => {
    const [value, setValue] = useState(initalValue || '');

    const onChange = (e:any) => {
        setValue(e.target.value);
    }

    return {
        value,
        onChange
    }
}

export default useInput;