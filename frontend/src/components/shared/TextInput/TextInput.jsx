import React from 'react';
import styles from './TextInput.module.css';

const TextInput = (props) => {
    return (
        <div>
            <input className={ styles.textInput } type="text" { ...props } />
        </div>
    )
}

export default TextInput;