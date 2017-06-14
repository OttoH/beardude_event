import React from 'react'
import { Redirect } from 'react-router-dom'
import { actionCreators } from '../../ducks/event'
import { actionCreators as accountActionCreators } from '../../ducks/account'
import css from './style.css'
import Header from '../Header'
import Footer from '../Footer'

class Event extends React.Component {
  componentDidMount () {
    if (!this.props.account.isAuthenticated) {
      this.props.dispatch(accountActionCreators.accountInfo())
    }
    this.props.dispatch(actionCreators.getEvents())
  }
  render () {
    if (!this.props.account.isAuthenticated) {
      return <Redirect to={'/console/login'} />
    }

    const eventList = (this.props.event && this.props.event.events) ? this.props.event.events.map(raceEvent => <li key={'event-' + raceEvent.id}>{raceEvent.nameCht}</li>) : <li>empty</li>
    return (<div className={css.container}>
      <Header />
      <div className={css.mainBody}>
          <div className={css.body}>
            <div>
              <ul>{eventList}</ul>
              <div className={css.ft}>
                footer
              </div>
            </div>
          </div>
      </div>
      <Footer />
    </div>)
  }
}

export default Event
