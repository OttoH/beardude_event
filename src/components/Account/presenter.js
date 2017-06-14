import React from 'react'
import BaseCompont from '../BaseComponent'
import { Redirect } from 'react-router-dom'
import { actionCreators } from '../../ducks/account'
import Header from '../Header'
import Footer from '../Footer'
import css from './style.css'

class Account extends BaseCompont {
  constructor (props) {
    super(props)
    this.dispatch = this.props.dispatch
    this._bind('handleInput', 'handleSubmit')
  }
  componentDidMount () {
    if (!this.props.account.isAuthenticated) {
      this.dispatch(actionCreators.accountInfo())
    }
  }
  handleInput (field) {
    return (E) => {
      this.dispatch(actionCreators.input(field, E.currentTarget.value))
    }
  }
  handleSubmit () {
    const { email, password } = this.props.account.credentials
    if (email && password) {
      this.dispatch(actionCreators.login())
    }
  }
  render () {
    const { credentials } = this.props.account
    const err = (credentials.error === '') ? '' : <div className={css.errMsg}>{credentials.error}</div>

    if (this.props.account.isAuthenticated) {
      return <Redirect to={'/console'} />
    }

    return (<div className={css.container}>
      <Header />
      <div className={css.mainBody}>
          <div className={css.body}>
            <div>
              {err}
              <ul>
                  <li className={css.li}>
                      <input type='text' className={css.text1} onChange={this.handleInput('email')} placeholder='電子信箱' />
                  </li>
                  <li className={css.li}>
                      <input type='password' className={css.text2} onChange={this.handleInput('password')} placeholder='密碼' />
                  </li>
              </ul>
              <div className={css.ft}>
                  <button className={css.submit} onClick={this.handleSubmit} type='submit'>登入</button>
              </div>
            </div>
          </div>
      </div>
      <Footer />
    </div>)
  }
}

export default Account
