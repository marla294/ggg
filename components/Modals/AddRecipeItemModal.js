import { useLazyQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { useEffect, useRef, useState } from 'react';
import { useAddRecipeItemModal } from '../../lib/addRecipeItemState';
import useForm from '../../lib/useForm';
import FormStyles from '../styles/FormStyles';
import ModalBackgroundStyles from '../styles/ModalBackgroundStyles';
import ModalStyles from '../styles/ModalStyles';
import { SEARCH_INGREDIENTS_QUERY } from '../IngredientsList';
import { DropDown, DropDownItemCover, DropDownItem } from '../styles/Dropdown';
import roundQuantity from '../../lib/roundQuantity';
import DisplayError from '../ErrorMessage';

const ADD_TO_RECIPE_MUTATION = gql`
  mutation ADD_TO_RECIPE_MUTATION(
    $id: ID!
    $recipeId: ID!
    $quantity: String!
  ) {
    addToRecipe(ingredientId: $id, recipeId: $recipeId, quantity: $quantity) {
      id
    }
  }
`;

export default function AddRecipeItemModal() {
  const [findIngredients, { data }] = useLazyQuery(SEARCH_INGREDIENTS_QUERY, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });
  const findItemsButChill = debounce(findIngredients, 5);
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownClosed, setDropdownClosed] = useState(false);
  const searchRef = useRef(null);
  useEffect(() => {
    findItemsButChill({
      variables: {
        searchTerm,
      },
    });
  }, [searchTerm]);

  const {
    addRecipeItemModalOpen,
    closeAddRecipeItemModal,
    ingredient,
    setIngredient,
    recipeId,
  } = useAddRecipeItemModal();

  useEffect(() => {
    searchRef?.current?.focus();
  }, [addRecipeItemModalOpen]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setDropdownClosed(false);
  };

  const items =
    searchTerm !== '' && data?.allIngredients.length > 0
      ? data?.allIngredients
      : [];

  const { inputs, handleChange, resetForm } = useForm({
    quantity: '1',
  });

  const [addToRecipe, { error }] = useMutation(ADD_TO_RECIPE_MUTATION);

  const [warning, setWarning] = useState(null);

  const closeDownModal = () => {
    resetForm();
    setSearchTerm('');
    setIngredient(null);
    setWarning(null);
    closeAddRecipeItemModal();
  };

  return addRecipeItemModalOpen ? (
    <>
      <ModalStyles
        className={addRecipeItemModalOpen && 'open'}
        id="addRecipeItemModal"
        onClick={() => {
          setDropdownClosed(true);
        }}
      >
        <FormStyles
          onSubmit={async (e) => {
            e.preventDefault();
            const parsedQuantity = Number.parseFloat(inputs.quantity);
            if (Number.isNaN(parsedQuantity)) {
              setWarning(
                `'${inputs.quantity}' is not a number.  Please enter a numeric value for the quantity.`
              );
            } else if (!ingredient) {
              setWarning('Please select an ingredient to add to this recipe');
            } else {
              await addToRecipe({
                variables: {
                  id: ingredient.id,
                  recipeId,
                  quantity: roundQuantity(inputs.quantity).toString(),
                },
                refetchQueries: 'all',
              });
              closeDownModal();
            }
          }}
        >
          <h2>Add ingredient to recipe</h2>
          <DisplayError error={{ message: warning } || error} />
          <div className="modalInputContainer">
            <input
              required
              type="text"
              id="quantity"
              name="quantity"
              placeholder="quantity"
              value={inputs.quantity}
              onChange={handleChange}
            />
            <div>
              <input
                id="searchTerm"
                name="searchTerm"
                placeholder='Search for ingredient (eg, "tomato")'
                value={searchTerm}
                onChange={handleSearch}
                ref={searchRef}
              />
              <DropDown
                className={items.length > 0 && !dropdownClosed ? 'open' : ''}
              >
                {items.length > 0 &&
                  items.map((ing) => (
                    <DropDownItemCover
                      key={ing.id}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setIngredient(ing);
                          setSearchTerm(ing.name);
                          setDropdownClosed(true);
                        }
                      }}
                    >
                      <DropDownItem
                        key={ing.id}
                        onClick={() => {
                          setIngredient(ing);
                          setSearchTerm(ing.name);
                          setDropdownClosed(true);
                        }}
                      >
                        {ing?.photo?.image?.publicUrlTransformed ? (
                          <img
                            key={ing.id}
                            src={ing?.photo?.image?.publicUrlTransformed}
                            alt={ing?.photo?.altText || ing?.name}
                          />
                        ) : (
                          <div className="noPhoto" />
                        )}
                        <div>{ing.name}</div>
                      </DropDownItem>
                    </DropDownItemCover>
                  ))}
              </DropDown>
            </div>
          </div>
          <div>
            <button type="submit" className="submit">
              Add
            </button>
            <button
              type="button"
              className="cancel"
              onClick={() => {
                closeDownModal();
              }}
            >
              Cancel
            </button>
          </div>
        </FormStyles>
        <button
          type="button"
          className="close"
          onClick={() => {
            closeDownModal();
          }}
        >
          &times;
        </button>
      </ModalStyles>
      <ModalBackgroundStyles
        className={addRecipeItemModalOpen && 'open'}
        onClick={closeDownModal}
      />
    </>
  ) : (
    <div />
  );
}
