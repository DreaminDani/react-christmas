import React, {useTransition, useState} from 'react'
import logo from './logo.svg';
import './App.css';

function fetchSomeData() {
  // simulates a 2 second data fetch
  console.log('called')
  return wrapPromise(new Promise(resolve => {
    setTimeout(() => {
      console.log('responded');
      resolve({test: "value"})
    }, 5000)
  }))
}

// simulate Relay
function wrapPromise(promise) {
  let status = "pending";
  let result;
  let suspender = promise.then(
    r => {
      status = "success";
      result = r;
    },
    e => {
      status = "error";
      result = e;
    }
  );
  return {
    read() {
      if (status === "pending") {
        throw suspender;
      } else if (status === "error") {
        throw result;
      } else if (status === "success") {
        return result;
      }
    }
  };
}

const Content = () => {
    const [someState, updateSomeState] = useState({})
    const [startTransition, isPending] = useTransition({ timeoutMs: 2000 });

    console.log(someState);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <button
              disabled={ isPending }
              onClick={ () => {
                startTransition(() => {
                  const data = fetchSomeData();
                  updateSomeState(data);
                })
              } }
            >
            {isPending ? "Fetching" : "This will simulate a data fetch" }
          </button>
        </header>
      </div>
    )
}

export default Content;