import Link from 'next/link';
import DeleteRecipeItem from './DeleteRecipeItem';
import ListItemStyles from './styles/ListItemStyles';

export default function RecipeIngredient({
  recipeItemId,
  ingredient,
  quantity,
}) {
  return (
    <ListItemStyles>
      {ingredient?.photo?.image?.publicUrlTransformed ? (
        <img
          src={ingredient?.photo?.image?.publicUrlTransformed}
          alt={ingredient?.photo?.altText}
        />
      ) : (
        <div className="noPhoto" />
      )}
      <div className="details">
        <h3>
          <Link href={`/ingredient/${ingredient?.id}`}>{ingredient?.name}</Link>
        </h3>
        <p>
          amount: {quantity}{' '}
          {ingredient?.units === 'none' ? '' : ingredient?.units}
        </p>
      </div>
      {recipeItemId && (
        <DeleteRecipeItem itemId={recipeItemId}>&times;</DeleteRecipeItem>
      )}
    </ListItemStyles>
  );
}
