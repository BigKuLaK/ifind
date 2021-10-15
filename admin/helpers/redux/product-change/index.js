const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  productChangeParams: {
    // Admin ID
    admin_user: null,
    // Product data
    state: null,
    // product-change type (refer to product-change schema)
    change_type: 'script_update',
  }
};

const productChangeSlice = createSlice({
  name: 'product-change',
  initialState,
  reducers: {
    setProductChangeParams: (state, action) => {
      state.productChangeParams = {
        ...state.productChangeParams,
        ...action.payload,
      };
    },
    resetProductChangeParams: (state) => {
      state.productChangeParams = initialState.productChangeParams;
    }
  }
});

module.exports = {
  initialState,
  actions: productChangeSlice.actions,
  reducers: productChangeSlice.reducer,
};
