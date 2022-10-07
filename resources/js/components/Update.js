import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function Update() {

  const [worlds, setworlds] = useState([]);

  useEffect(() => {
    axios.get('/get/worlds/list').then((response) => {
      setworlds(response.data)
    })
    return () => {
    };
  }, []);


  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="card-header">List of worlds</div>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#id</th>
              <th scope="col">name</th>
              <th scope="col">created</th>
              <th scope="col">updated</th>
              <th scope="col">description</th>
              <th scope="col">id</th>
              <th scope="col">publicAvailable</th>
              <th scope="col">previewBackgroundImagePath</th>
            </tr>
          </thead>
          <tbody>
            {worlds && worlds.map(item => {
              return (<tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.created}</td>
                <td>{item.updated}</td>
                <td>{item.description}</td>
                <td>{item.id}</td>
                <td>{item.publicAvailable}</td>
                <td>{item.previewBackgroundImagePath}</td>
                {/* <td>{item.data}</td> */}
              </tr>)
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Update;
