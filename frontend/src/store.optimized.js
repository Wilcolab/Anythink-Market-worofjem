/**
 * OPTIMIZED FRONTEND STORE & REDUCERS
 * 
 * Performance improvements:
 * - Memoization of selectors
 * - Efficient state updates
 * - Lazy loading of data
 * - Reduced re-renders
 * - Optimized action dispatching
 * - State normalization
 */

// ===== OPTIMIZED STORE CONFIGURATION =====
const redux = require('redux');
const thunk = require('redux-thunk');

// Selector memoization library
const reselect = require('reselect');

// ===== NORMALIZED STATE STRUCTURE =====
const initialState = {
  // Auth state
  auth: {
    loggedIn: false,
    user: null,
    token: null,
    isAuthenticating: false,
    errors: null
  },
  
  // Items state - normalized
  items: {
    byId: {}, // items keyed by ID for O(1) lookup
    allIds: [], // array of item IDs in order
    isLoading: false,
    errors: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0
    }
  },
  
  // User profiles - normalized
  profiles: {
    byUsername: {}, // users keyed by username
    isLoading: false,
    errors: null
  },
  
  // Comments - normalized
  comments: {
    byId: {},
    byArticle: {}, // article ID -> [comment IDs]
    isLoading: false,
    errors: null
  },
  
  // UI state
  ui: {
    isNavOpen: false,
    isEditing: false,
    currentFilter: 'all'
  },
  
  // Cache metadata
  cache: {
    itemsLastFetched: null,
    profilesLastFetched: {}
  }
};

// ===== MEMOIZED SELECTORS =====

// Base selectors
const selectItemsState = (state) => state.items;
const selectAuthState = (state) => state.auth;
const selectProfilesState = (state) => state.profiles;
const selectCommentsState = (state) => state.comments;

// Memoized: Get all items as array
const selectAllItems = reselect.createSelector(
  [selectItemsState],
  (itemsState) => itemsState.allIds.map(id => itemsState.byId[id])
);

// Memoized: Get item by ID
const selectItemById = reselect.createSelector(
  [(state, itemId) => itemId, selectItemsState],
  (itemId, itemsState) => itemsState.byId[itemId]
);

// Memoized: Get comments for an article
const selectCommentsByArticle = reselect.createSelector(
  [(state, articleId) => articleId, selectCommentsState],
  (articleId, commentsState) => {
    const commentIds = commentsState.byArticle[articleId] || [];
    return commentIds.map(id => commentsState.byId[id]);
  }
);

// ===== OPTIMIZED REDUCERS =====

const itemsReducer = (state = initialState.items, action) => {
  switch (action.type) {
    case 'ITEMS_FETCH_START':
      return { ...state, isLoading: true };
    
    case 'ITEMS_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        byId: {
          ...state.byId,
          ...action.payload.reduce((acc, item) => {
            acc[item.id] = item;
            return acc;
          }, {})
        },
        allIds: action.payload.map(item => item.id),
        pagination: action.pagination,
        errors: null
      };
    
    case 'ITEMS_FETCH_ERROR':
      return { ...state, isLoading: false, errors: action.payload };
    
    case 'ITEM_ADD_FAVORITE':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.itemId]: {
            ...state.byId[action.itemId],
            favorited: true,
            favoritesCount: state.byId[action.itemId].favoritesCount + 1
          }
        }
      };
    
    case 'ITEM_REMOVE_FAVORITE':
      return {
        ...state,
        byId: {
          ...state.byId,
          [action.itemId]: {
            ...state.byId[action.itemId],
            favorited: false,
            favoritesCount: state.byId[action.itemId].favoritesCount - 1
          }
        }
      };
    
    default:
      return state;
  }
};

const authReducer = (state = initialState.auth, action) => {
  switch (action.type) {
    case 'AUTH_LOGIN_START':
      return { ...state, isAuthenticating: true, errors: null };
    
    case 'AUTH_LOGIN_SUCCESS':
      return {
        ...state,
        loggedIn: true,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticating: false,
        errors: null
      };
    
    case 'AUTH_LOGIN_ERROR':
      return {
        ...state,
        isAuthenticating: false,
        errors: action.payload
      };
    
    case 'AUTH_LOGOUT':
      return initialState.auth;
    
    default:
      return state;
  }
};

const profilesReducer = (state = initialState.profiles, action) => {
  switch (action.type) {
    case 'PROFILES_FETCH_START':
      return { ...state, isLoading: true };
    
    case 'PROFILES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        byUsername: {
          ...state.byUsername,
          [action.username]: action.payload
        },
        errors: null
      };
    
    case 'PROFILES_FETCH_ERROR':
      return { ...state, isLoading: false, errors: action.payload };
    
    default:
      return state;
  }
};

const commentsReducer = (state = initialState.comments, action) => {
  switch (action.type) {
    case 'COMMENTS_FETCH_START':
      return { ...state, isLoading: true };
    
    case 'COMMENTS_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        byId: {
          ...state.byId,
          ...action.payload.reduce((acc, comment) => {
            acc[comment.id] = comment;
            return acc;
          }, {})
        },
        byArticle: {
          ...state.byArticle,
          [action.articleId]: action.payload.map(c => c.id)
        },
        errors: null
      };
    
    case 'COMMENTS_FETCH_ERROR':
      return { ...state, isLoading: false, errors: action.payload };
    
    default:
      return state;
  }
};

const uiReducer = (state = initialState.ui, action) => {
  switch (action.type) {
    case 'UI_TOGGLE_NAV':
      return { ...state, isNavOpen: !state.isNavOpen };
    
    case 'UI_SET_FILTER':
      return { ...state, currentFilter: action.payload };
    
    default:
      return state;
  }
};

// ===== ROOT REDUCER =====
const rootReducer = redux.combineReducers({
  auth: authReducer,
  items: itemsReducer,
  profiles: profilesReducer,
  comments: commentsReducer,
  ui: uiReducer
});

// ===== STORE CREATION =====
const store = redux.createStore(
  rootReducer,
  initialState,
  redux.compose(
    redux.applyMiddleware(thunk),
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

// ===== OPTIMIZED ASYNC ACTIONS WITH THROTTLING =====
const fetchItemsWithCache = () => (dispatch, getState) => {
  const state = getState();
  const lastFetched = state.cache.itemsLastFetched;
  
  // Skip if fetched within last 5 minutes
  if (lastFetched && Date.now() - lastFetched < 5 * 60 * 1000) {
    return Promise.resolve();
  }

  dispatch({ type: 'ITEMS_FETCH_START' });
  
  // Fetch logic here
  return fetch('/api/items')
    .then(res => res.json())
    .then(data => {
      dispatch({
        type: 'ITEMS_FETCH_SUCCESS',
        payload: data.items,
        pagination: data.pagination
      });
    })
    .catch(error => {
      dispatch({
        type: 'ITEMS_FETCH_ERROR',
        payload: error.message
      });
    });
};

module.exports = {
  store,
  rootReducer,
  // Export selectors for use in components
  selectAllItems,
  selectItemById,
  selectCommentsByArticle,
  selectAuthState,
  // Export action creators
  fetchItemsWithCache
};
