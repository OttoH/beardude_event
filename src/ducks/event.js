/* global fetch */

// types
const ACTION_ERR = 'event/ACTION_ERR'
const DELETE_EVENT = 'event/DELETE_EVENT'
const DELETE_GROUP = 'event/DELETE_GROUP'
const DELETE_RACE = 'event/DELETE_RACE'
const EVENT_ERR = 'event/EVENT_ERR'
const GET_EVENT = 'event/GET_EVENT'
const GET_EVENTS = 'event/GET_EVENTS'
const GET_REGS_OF_GROUP = 'event/GET_REGS_OF_GROUP'
const GET_REGS_OF_RACE = 'event/GET_REGS_OF_RACE'
const SUBMIT_EVENT = 'event/SUBMIT_EVENT'
const SUBMIT_GROUP = 'event/SUBMIT_GROUP'
const SUBMIT_RACE = 'event/SUBMIT_RACE'
const SUBMIT_REG = 'event/SUBMIT_REG'

const returnPostHeader = (obj) => ({ method: 'post', credentials: 'same-origin', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(obj) })
// actions
export const actionCreators = {
  delete: (state, successCallback) => async (dispatch) => {
    const types = { event: DELETE_EVENT, group: DELETE_GROUP, race: DELETE_RACE }
    try {
      const response = await fetch(`/api/${state.model}/delete/${state.original.id}`, {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        dispatch({type: types[state.model], payload: {...res, state: state}})
        if (state.model !== 'event') { successCallback() }
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  },
  getEvents: () => async (dispatch, getState) => {
    try {
      const response = await fetch('/api/event/getEvents', {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        return dispatch({type: GET_EVENTS, payload: res})
      }
      throw res.message
    } catch (e) {
      dispatch({type: EVENT_ERR, payload: {error: '取得活動失敗'}})
    }
  },
  getEvent: (id, successCallback) => async (dispatch, getState) => {
    if (id === 'new') {
      dispatch({type: GET_EVENT, payload: { event: { groups: [] } }})
      return successCallback()
    }
    try {
      const response = await fetch(`/api/event/mgmtInfo/${id}`, {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        return dispatch({type: GET_EVENT, payload: {...res}})
      }
      throw res.message
    } catch (e) {
      dispatch({type: EVENT_ERR, payload: {error: '取得活動內容失敗'}})
    }
  },
  getRegs: (model, id, index, state, successCallback) => async (dispatch) => {
    try {
      const response = await fetch(`/api/reg/${model}/${id}`, {credentials: 'same-origin'})
      const res = await response.json()
      if (response.status === 200) {
        if (model === 'group') {
          dispatch({type: GET_REGS_OF_GROUP, payload: {...res, id: id, state: state, index: index}})
        } else {
          dispatch({type: GET_REGS_OF_RACE, payload: {...res, id: id, state: state, index: index}})
        }
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: EVENT_ERR, payload: {error: '取得選手賽籍失敗'}})
    }
  },
  submit: (state, successCallback) => async (dispatch) => {
    const types = { event: SUBMIT_EVENT, group: SUBMIT_GROUP, race: SUBMIT_RACE, reg: SUBMIT_REG }
    const pathname = (state.original.id) ? 'update' : 'create'
    try {
      const response = await fetch(`/api/${state.model}/${pathname}`, returnPostHeader({...state.modified, id: state.original.id}))
      const res = await response.json()
      if (response.status === 200) {
        dispatch({type: types[state.model], payload: {...res, state: state}})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  },
  submitAdvancingRules: (state, successCallback) => async (dispatch) => {
    try {
      const response = await fetch('/api/race/update', returnPostHeader({id: state.advRuleRaceId, advancingRules: state.advRuleModified}))
      const res = await response.json()
      if (response.status === 200) {
        dispatch({type: SUBMIT_RACE, payload: {...res, state: state}})
        return successCallback()
      }
      throw res.message
    } catch (e) {
      dispatch({type: ACTION_ERR, payload: {error: e}})
    }
  }
}

// reducers
const initialState = {
  event: undefined,
  events: []
}
export const reducer = (state = initialState, action) => {
  const {type, payload} = action

  switch (type) {
    case ACTION_ERR: {
      return {...state, error: payload.error}
    }
    case DELETE_EVENT: {
      return {...state, event: -1}
    }
    case DELETE_GROUP: {
      let nextState = {...state}
      nextState.event.groups.splice(payload.state.groupSelected, 1)
      return nextState
    }
    case DELETE_RACE: {
      let nextState = {...state}
      nextState.event.groups[payload.state.groupSelected].races.splice(payload.state.raceSelected, 1)
      return nextState
    }
    case GET_EVENTS: {
      return {...state, events: payload.events}
    }
    case GET_EVENT: {
      return {...state, event: payload.event}
    }
    case GET_REGS_OF_GROUP: {
      let nextState = {...state}
      nextState.event.groups[payload.index].registrations = payload.registrations
      return nextState
    }
    case GET_REGS_OF_RACE: {
      let nextState = {...state}
      nextState.event.groups[payload.state.groupSelected].races[payload.index].registrations = payload.registrations
      return nextState
    }
    case SUBMIT_EVENT: {
      return {...state, event: {...payload.event, groups: [...state.event.groups]}}
    }
    case SUBMIT_GROUP: {
      let nextState = {...state}
      const group = state.event.groups[payload.state.groupSelected] || {...payload.group, races: [], registrations: []}
      if (state.event.groups.length === payload.state.groupSelected) {
        nextState.event.groups.push(group)
      } else {
        nextState.event.groups[payload.state.groupSelected] = {...payload.group, races: group.races, registrations: group.registrations}
      }
      return nextState
    }
    case SUBMIT_RACE: {
      let nextState = {...state}
      if (state.event.groups[payload.state.groupSelected].races.length === payload.state.raceSelected) {
        nextState.event.groups[payload.state.groupSelected].races.push({...payload.race, registrations: []})
      } else {
        nextState.event.groups[payload.state.groupSelected].races[payload.state.raceSelected] = payload.race
      }
      return nextState
    }
    case SUBMIT_REG: {
      let nextState = {...state}

      // group's reg
      if (state.event.groups[payload.state.groupSelected].registrations.length === payload.state.regSelected) {
        nextState.event.groups[payload.state.groupSelected].registrations.push({...payload.registration})
      } else {
        nextState.event.groups[payload.state.groupSelected].registrations[payload.state.regSelected] = payload.registration
      }
      return nextState
    }
    case EVENT_ERR: {
      return {...state, event: -1}
    }
  }
  return state
}

export default reducer
