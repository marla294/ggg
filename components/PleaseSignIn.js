import SignIn from './SignIn';
import { useUser } from './User';

export default function PleaseSignIn({ children }) {
  const user = useUser();
  return (
    <>
      {user && children}
      {!user && (
        <div>
          <h2>Please sign in to view this page</h2>
          <SignIn />
        </div>
      )}
    </>
  );
}
