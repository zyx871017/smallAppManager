import { combineReducers } from 'redux';
import goodsList from './goodsList';
import categoriesList from './categoriesList';

const smallApp = combineReducers({
  goodsList,
  categoriesList,
});

export default smallApp