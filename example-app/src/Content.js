import React, {
  useState,
  useTransition,
  Suspense
} from "react";
import logo from './logo.svg';
import './App.css';
import { fetchProfileData } from "./fakeApi";

function getNextId(id) {
  return id === 3 ? 0 : id + 1;
}

const initialResource = fetchProfileData(0);

const Content = () => {
  const [resource, setResource] = useState(
    initialResource
  );
  const [
    startTransition,
    isPending
  ] = useTransition({
    timeoutMs: 500
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
          <button
          disabled={isPending}
          onClick={() => {
            startTransition(() => {
              const nextUserId = getNextId(
                resource.userId
              );
              setResource(
                fetchProfileData(nextUserId)
              );
            });
          }}
        >
          Next
        </button>
        {isPending ? "Loading..." : null}
        <ProfilePage resource={resource} />
      </header>
    </div>
  );
}

function ProfilePage({ resource }) {
  return (
    <Suspense
      fallback={<h1>Loading profile...</h1>}
    >
      <ProfileDetails resource={resource} />
      <Suspense
        fallback={<h1>Loading posts...</h1>}
      >
        <ProfileTimeline resource={resource} />
      </Suspense>
    </Suspense>
  );
}

function ProfileDetails({ resource }) {
  const user = resource.user.read();
  return <h1>{user.name}</h1>;
}

function ProfileTimeline({ resource }) {
  const posts = resource.posts.read();
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.text}</li>
      ))}
    </ul>
  );
}
export default Content;