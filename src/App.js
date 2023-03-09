import "./App.css";
import React, { useState, useEffect } from "react";
const pagesPerPage = 5;

const Comments = (props) => {
  const isFetchCompleted = localStorage.getItem("isFetchCompleted");
  const [comments, setComments] = useState();
  useEffect(() => {
    if (isFetchCompleted !== "1") {
      fetch("https://jsonplaceholder.typicode.com/posts").then((response) =>
        response.json().then((data) => {
          localStorage.setItem("localSavesMessages", JSON.stringify(data));
          localStorage.setItem("isFetchCompleted", "1");
          props.isLoaded(true);
          setComments(data);
        })
      );
    }
  }, [isFetchCompleted]);

  if (isFetchCompleted === "1") {
    const savedComments = JSON.parse(
      localStorage.getItem("localSavesMessages")
    );

    const renderComments = (page, messages) => {
      const messagesArray = [];

      for (
        let i = (page - 1) * pagesPerPage;
        i <= page * pagesPerPage - 1;
        i++
      ) {
        messagesArray.push(
          <div key={messages[i].id} className="message-container">
            <h1>{messages[i].title}</h1>
            <p>{messages[i].body}</p>
          </div>
        );
      }

      return messagesArray;
    };

    return (
      <React.Fragment>
        {renderComments(props.page, savedComments)}
      </React.Fragment>
    );
  }
};

const Pagination = (props) => {
  const maxPages = Math.ceil(
    JSON.parse(localStorage.getItem("localSavesMessages")).length / pagesPerPage
  );

  const pagination = [];

  //beggining
  if (props.page <= 4 && maxPages > 15) {
    for (let i = 1; i < 6; i++) {
      pagination.push(
        <button key={i} onClick={() => props.setPage(i)}>
          {i}
        </button>
      );
    }
    pagination.push(
      <span>...</span>,
      <button key={maxPages} onClick={() => props.setPage(maxPages)}>
        {maxPages}
      </button>
    );

    console.log(pagination);
  }

  //middle
  if (props.page > 4 && props.page <= maxPages - 5) {
    pagination.push(
      <button key={1} onClick={() => props.setPage(2)}>
        {1}
      </button>,
      <span>...</span>
    );
    for (let i = props.page - 1; i < props.page + 4; i++) {
      pagination.push(
        <button key={i} onClick={() => props.setPage(i)}>
          {i}
        </button>
      );
    }

    if (props.page <= maxPages - 4) {
      pagination.push(
        <span>...</span>,
        <button key={maxPages} onClick={() => props.setPage(maxPages)}>
          {maxPages}
        </button>
      );
    }
  }

  if (props.page > maxPages - 5) {
    // let index = maxPages - 4;
    pagination.push(
      <button key={1} onClick={() => props.setPage(1)}>
        {1}
      </button>,
      <span>...</span>
    );
    for (let i = maxPages - 5; i <= maxPages; i++) {
      pagination.push(
        <button key={i} onClick={() => props.setPage(i)}>
          {i}
        </button>
      );
    }
    console.log(pagination);
  }

  return (
    <div className="pagination">
      {pagination.map(
        (page) => page
        // <button key={page} onClick={() => props.setPage(page)}>
        //   {page}
        // </button>
      )}
    </div>
  );
};

function App() {
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState();
  return (
    <div className="App">
      {localStorage.getItem("isFetchCompleted") === "1" ? (
        <Pagination
          page={page}
          setPage={(pg) => {
            setPage(pg);
          }}
        />
      ) : (
        ""
      )}

      <Comments
        page={page}
        isLoaded={(status) => {
          setIsLoaded(status);
        }}
      />
    </div>
  );
}

export default App;
