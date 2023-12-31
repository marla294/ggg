import { useLazyQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import useForm from '../lib/useForm';
import DisplayError from './ErrorMessage';
import FormStyles from './styles/FormStyles';
import recipeTypes from '../lib/recipeTypes';
import AlertMessage from './AlertMessage';
import { useUser } from './User';

const CREATE_RECIPE_MUTATION = gql`
  mutation CREATE_RECIPE_MUTATION(
    $name: String!
    $recipeLink: String!
    $description: String!
    $recipeType: String
  ) {
    createRecipe(
      data: {
        name: $name
        recipeLink: $recipeLink
        description: $description
        type: $recipeType
      }
    ) {
      id
    }
  }
`;

const SEARCH_RECIPES_QUERY = gql`
  query SEARCH_RECIPES_QUERY($userId: ID!, $searchName: String!) {
    allRecipes(where: { name_i: $searchName, user: { id: $userId } }) {
      id
    }
  }
`;

const UPDATE_RECIPE_IMAGE_MUTATION = gql`
  mutation UPDATE_RECIPE_IMAGE_MUTATION(
    $id: ID!
    $image: Upload
    $name: String!
  ) {
    updateRecipe(
      id: $id
      data: { photo: { create: { image: $image, altText: $name } } }
    ) {
      id
    }
  }
`;

export default function CreateRecipeForm() {
  const user = useUser();
  const [findRecipes, { data: existingRecipeData }] =
    useLazyQuery(SEARCH_RECIPES_QUERY);
  const { inputs, handleChange, clearForm } = useForm({
    name: '',
    recipeLink: '',
    description: '',
    recipeType: recipeTypes[0],
  });
  const [createRecipe, { error }] = useMutation(CREATE_RECIPE_MUTATION, {
    variables: inputs,
    refetchQueries: 'all',
  });
  const [updateRecipeImage] = useMutation(UPDATE_RECIPE_IMAGE_MUTATION);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    findRecipes({
      variables: {
        userId: user?.id,
        searchName: inputs.name,
      },
    });
  }, [inputs.name]);
  return (
    <FormStyles
      onSubmit={async (e) => {
        e.preventDefault();
        if (existingRecipeData?.allRecipes?.length > 0) {
          setErrorMessage({
            message: `Recipe "${inputs.name}" already exists`,
          });
          clearForm();
          return;
        }
        const res = await createRecipe();
        if (inputs.image && res?.data?.createRecipe?.id) {
          await updateRecipeImage({
            variables: {
              id: res?.data?.createRecipe?.id,
              name: inputs.name,
              image: inputs.image,
            },
          }).catch(console.error);
        }
        clearForm();
        setSuccessMessage(`Recipe "${inputs.name}" created successfully`);
      }}
    >
      <Head>
        <title>Create New Recipe | Go Get Ur Groceries</title>
      </Head>
      <fieldset>
        <h2>Create New Recipe</h2>
        <DisplayError error={error || errorMessage} />
        <AlertMessage message={successMessage} />
        <label htmlFor="name">
          Name<span className="required">&nbsp;*</span>
          <input
            required
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="recipeLink">
          Recipe link
          <input
            type="text"
            id="recipeLink"
            name="recipeLink"
            placeholder="Link to recipe"
            value={inputs.recipeLink}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="image">
          Image
          <input type="file" id="image" name="image" onChange={handleChange} />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            rows="7"
            id="description"
            name="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="recipeType">
          Type of Recipe
          <select
            type="text"
            name="recipeType"
            id="recipeType"
            onChange={handleChange}
            value={inputs.recipeType}
          >
            {recipeTypes.map((recipeType) => (
              <option value={recipeType} key={recipeType}>
                {recipeType}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="submit">
          Create Recipe
        </button>
        <button type="button" className="clear" onClick={clearForm}>
          Clear Form
        </button>
        <button
          type="button"
          className="cancel"
          onClick={() => {
            Router.push({
              pathname: '/recipes',
            });
          }}
        >
          Cancel
        </button>
      </fieldset>
    </FormStyles>
  );
}
