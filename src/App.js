import React, { useState, useEffect, useRef } from "react";

function App() {
  const [shortenedUrls, setShortenedUrls] = useState(null);
  const [checked, setChecked] = useState(false);
  const dataFetchedRef = useRef(false);
  const dataFetchedRef2 = useRef(false);
  const [inputURLValidationPassed, setInputURLValidationPassed] =
    useState(false);

  // Apply validation to the input URL.
  const changeInputURL = (e) => {
    const inputUrl = e.target.value;
    if (inputUrl.indexOf("http://") != 0 && inputUrl.indexOf("https://") != 0) {
      setInputURLValidationPassed(false);
    } else {
      setInputURLValidationPassed(true);
    }
  };

  // Update the checkbox status.
  const customCheckboxPressed = (e) => {
    setChecked(!checked);
  };

  // Fetch the 10 most recent shortened URLs.
  const fetchData = () => {
    fetch("/api/urls")
      .then((res) => res.json())
      .then((data) => {
        setShortenedUrls(data.urls);
      });
  };

  // Redirect to the original URL.
  const redirectToURL = () => {
    const hashPath = window.location.pathname.substring(1);
    if (hashPath !== "") {
      fetch("/api/redirect?" + new URLSearchParams({ hash: hashPath }))
        .then((res) => res.json())
        .then((data) => {
          console.log(data.original_url);
          if (data.original_url !== "") {
            window.location.replace(data.original_url);
            console.log("redirecting...");
          }
        });
    }
  };

  // Fetch the 10 most recent shortened URLs.
  useEffect(() => {
    if (dataFetchedRef.current) return;
    dataFetchedRef.current = true;
    fetchData();
  }, []);

  // Redirect to the short URL.
  useEffect(() => {
    if (dataFetchedRef2.current) return;
    dataFetchedRef2.current = true;
    redirectToURL();
  }, []);

  // Display the times using Material UI components.
  return (
    <div class="h-screen bg-gradient-to-b from-sky-100 to-sky-200 flex flex-col">
      <p class="text-center text-4xl text-blue-500 font-bold p-8">
        URL Shortener
      </p>
      <div class="max-w-3xl mx-auto shadow-lg bg-white rounded-xl flex-grow p-10 mb-10 pt-4 overflow-auto">
        <p class="text-center text-xl text-black font-bold">
          Enter a URL (e.g. https://wikipedia.org)
        </p>
        <form action="/api/shorten" method="post">
          <input
            class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline mt-2"
            type="text"
            name="url_to_shorten"
            placeholder="Enter a URL"
            onChange={changeInputURL}
          />

          {checked ? (
            <input
              class="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline mt-2"
              type="text"
              name="custom_hash"
              placeholder="Enter a custom path (e.g. https://short.me/<custom-path>)"
            />
          ) : null}

          <div class="m-1">
            <input
              class="h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="checkbox"
              value=""
              id="flexCheckDefault"
              onChange={customCheckboxPressed}
            />
            <label
              class="form-check-label inline-block text-gray-800"
              for="flexCheckDefault"
            >
              Use custom short URL
            </label>
          </div>

          <div class="flex flex-row justify-center p-3">
            {inputURLValidationPassed ? (
              <input
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                type="submit"
                value="Submit"
              />
            ) : (
              <input
                disabled
                class="opacity-50 bg-blue-500 text-white font-bold py-2 px-4 rounded-full"
                type="submit"
                value="Submit"
              />
            )}
          </div>
        </form>

        {shortenedUrls != null ? (
          <table class="table-fixed w-full text-left border relative bottom-0 overflow-auto mt-3">
            <thead class="uppercase bg-gray-50 text-gray-700">
              <tr>
                <th class="border py-2 px-3">Original URL</th>
                <th class="border py-2 px-3">Hash</th>
                <th class="border py-2 px-3">Num Visits</th>
                <th class="border py-2 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {shortenedUrls.map((url) => (
                <tr class="border-b" key={url.hash}>
                  <td class="border py-2 px-3 truncate">
                    <a class="text-blue-500" href={url.original_url}>
                      {url.original_url}
                    </a>
                  </td>
                  <td class="border py-2 px-3">
                    <a
                      class="text-blue-500"
                      href={
                        window.location.href.substring(
                          0,
                          window.location.href.indexOf("/")
                        ) + url.hash
                      }
                    >
                      {url.hash}
                    </a>
                  </td>
                  <td class="border py-2 px-3">{url.visits}</td>
                  <td class="border py-2 px-3">{url.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
      </div>
    </div>
  );
}

export default App;
