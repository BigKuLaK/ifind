import React, { useState } from 'react';

import './styles.scss';

const InputError = ({ message = [] }) => {
  const [ isVisible, setIsVisible ] = useState(true);

  return isVisible && (
    <aside className='input-error'>
      <div className="input-error__content">
        {message.join('<br />')}
        <button
          type="button"
          className='input-error__close'
          onClick={() => setIsVisible(false)}
        >
          <strong>&times;</strong>
        </button>
      </div>
    </aside>
  )
}

const InputBlock = ({ className = '', error = '', children }) => {
  return (
    <div className={['input-block', className, error && 'input-block--error' ].filter(Boolean).join(' ')}>
      {children}
      {
        error && <InputError message={error} />
      }
    </div>
  )
}

export default InputBlock;