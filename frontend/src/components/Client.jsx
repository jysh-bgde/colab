import React from 'react'
import '../styles/clientStyles.css'

const Client = ({username, index}) => {
  return (
    <div className='client'>
        
        <div className='username'>{`${index+1}. ${username}`}</div>
    </div>
  )
}

export default Client