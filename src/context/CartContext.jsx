import React, { createContext, useContext, useReducer } from 'react';

// Contexto
const CartContext = createContext();

// Estado inicial del carrito
const initialState = {
    items: [],
    images: {},
  };

// Acciones
const actionTypes = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR: 'CLEAR',
};

// Reducer para manejar las acciones
const cartReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD_ITEM:
      const newItem = {
        id: action.payload.id,
        title: action.payload.title,
        price: action.payload.price,
        quantity: action.payload.quantity,
        image: action.payload.image,
      };

      const updatedImages = {
        ...state.images,
        [action.payload.id]: action.payload.image,
      };

      console.log('Nuevo estado de images:', updatedImages);

      return {
        ...state,
        items: [...state.items, newItem],
        images: updatedImages,
      };
    case actionTypes.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };
    case actionTypes.CLEAR:
      return {
        ...state,
        items: [],
      };
    default:
      return state;
  }
};

// Proveedor del contexto
const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item, quantity) => {
    dispatch({
      type: actionTypes.ADD_ITEM,
      payload: {
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: quantity,
        image: item.image,
      },
    });
  };

  const removeItem = (itemId) => {
    dispatch({
      type: actionTypes.REMOVE_ITEM,
      payload: itemId,
    });
  };

  const clear = () => {
    dispatch({
      type: actionTypes.CLEAR,
    });
  };

  const isInCart = (id) => {
    return state.items.some((item) => item.id === id);
  };  

  const calcItemsQty = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculo del precio total de los items en el carrito
  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{ items: state.items, images: state.images, addItem, removeItem, clear, isInCart, getTotalPrice, calcItemsQty }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Hook para acceder al contexto
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser utilizado dentro de un CartProvider');
  }
  return context;
};

export { CartProvider, useCart };