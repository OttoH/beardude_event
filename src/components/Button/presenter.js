import React from 'react'
import css from './style.css'

const Button = ({ onClick, style = 'regular', text, url }) => ((url)
  ? <a className={css[style]} href={url}>{text}</a>
  : <button className={css[style]} onClick={onClick}>{text}</button>)

export default Button