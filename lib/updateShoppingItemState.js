import { createContext, useContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function UpdateShoppingItemStateProvider({ children }) {
  const [updateShoppingItemModalOpen, setUpdateShoppingItemModalOpen] =
    useState(false);

  const [shoppingListItem, setShoppingListItem] = useState(null);

  function toggleUpdateShoppingItemModal() {
    setUpdateShoppingItemModalOpen(!updateShoppingItemModalOpen);
  }

  function closeUpdateShoppingItemModal() {
    setUpdateShoppingItemModalOpen(false);
  }

  function openUpdateShoppingItemModal() {
    setUpdateShoppingItemModalOpen(true);
  }

  return (
    <LocalStateProvider
      value={{
        shoppingListItem,
        setShoppingListItem,
        updateShoppingItemModalOpen,
        setUpdateShoppingItemModalOpen,
        toggleUpdateShoppingItemModal,
        closeUpdateShoppingItemModal,
        openUpdateShoppingItemModal,
      }}
    >
      {children}
    </LocalStateProvider>
  );
}

function useUpdateShoppingItemModal() {
  const all = useContext(LocalStateContext);
  return all;
}

export { UpdateShoppingItemStateProvider, useUpdateShoppingItemModal };