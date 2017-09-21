import { combineReducers } from 'redux';
import goodsList from './goodsList';
import categoriesList from './categoriesList';
import ordersList from './ordersList';

const smallApp = combineReducers({
  goodsList,
  categoriesList,
  ordersList
});

export default smallApp