import { combineReducers } from 'redux';
import goodsList from './goodsList';
import categoriesList from './categoriesList';
import ordersList from './ordersList';
import activeList from './activeList';

const smallApp = combineReducers({
  goodsList,
  categoriesList,
  ordersList,
  activeList
});

export default smallApp;