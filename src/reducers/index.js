import { combineReducers } from 'redux'
import goodsList from './goodsList'

const smallApp = combineReducers({
  goodsList
});

export default smallApp