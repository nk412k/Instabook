import React, { Suspense } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Users from "./users/pages/users";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
// import NewPost from "./posts/pages/newPost";
// import UserPosts from "./posts/pages/UserPosts";
// import UpdatePost from "./posts/pages/updatePost";
// import Auth from "./users/pages/Auth";
import { AuthContext } from "./shared/context/Auth-context";
import { useAuth } from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/components/UIElements/LoadingSpinner";

const Auth = React.lazy(() => import("./users/pages/Auth"));
const NewPost = React.lazy(() => import("./posts/pages/newPost"));
const UserPosts = React.lazy(() => import("./posts/pages/UserPosts"));
const UpdatePost = React.lazy(() => import("./posts/pages/updatePost"));

function App() {
  const { token, loginHandler, logoutHandler, userId } = useAuth();

  let routes;
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/posts/new" exact>
          <NewPost />
        </Route>
        <Route path="/:userId/posts" exact>
          <UserPosts />
        </Route>
        <Route path="/posts/:postId">
          <UpdatePost />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/posts" exact>
          <UserPosts />
        </Route>
        <Route path="/Auth">
          <Auth />
        </Route>
        <Redirect to="/Auth" />
      </Switch>
    );
  }
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      <BrowserRouter>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
