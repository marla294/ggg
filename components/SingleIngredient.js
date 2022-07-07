/* eslint-disable jsx-a11y/img-redundant-alt */
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import Link from 'next/link';
import PropTypes from 'react';
import DisplayError from './ErrorMessage';
import ButtonStyles from './styles/ButtonStyles';
import DeleteIngredient from './DeleteIngredient';
import { SingleItemStyles } from './styles/SingleItemStyles';

const SINGLE_INGREDIENT_QUERY = gql`
  query SINGLE_INGREDIENT_QUERY($id: ID!) {
    Ingredient(where: { id: $id }) {
      id
      name
      description
      aisle
      homeArea
      units
      store
      photo {
        id
        image {
          publicUrlTransformed
        }
        altText
      }
    }
  }
`;

function SingleIngredient({ id }) {
  const { data, loading, error } = useQuery(SINGLE_INGREDIENT_QUERY, {
    variables: {
      id,
    },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;
  const { Ingredient } = data;
  return (
    <SingleItemStyles>
      <Head>
        <title>Go Get Groceries | {Ingredient.name}</title>
      </Head>
      {Ingredient?.photo?.image?.publicUrlTransformed ? (
        <img
          src={Ingredient?.photo?.image?.publicUrlTransformed}
          alt={Ingredient?.photo?.altText}
        />
      ) : (
        <div className="noPhoto">Needs photo 📸</div>
      )}
      <div>
        <h2>{Ingredient.name}</h2>
        <p>{Ingredient.description}</p>
        <p>
          <b>Aisle:</b> {Ingredient.aisle}
        </p>
        <p>
          <b>Home Area:</b> {Ingredient.homeArea}
        </p>
        <p>
          <b>Units:</b> {Ingredient.units}
        </p>
        <p>
          <b>Store:</b> {Ingredient.store}
        </p>
        <div>
          <ButtonStyles style={{ margin: '1rem 0 0 0' }}>
            <Link
              passHref
              href={{
                pathname: '/editingredient',
                query: {
                  id: Ingredient.id,
                },
              }}
            >
              <button type="button" className="yellow">
                Edit Ingredient
              </button>
            </Link>
            <DeleteIngredient id={Ingredient.id}>Delete</DeleteIngredient>
          </ButtonStyles>
        </div>
      </div>
    </SingleItemStyles>
  );
}

SingleIngredient.propTypes = {
  id: PropTypes.string,
};

export default SingleIngredient;

export { SINGLE_INGREDIENT_QUERY };
