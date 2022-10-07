import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const modalStyle = {
  paddingRight: "15px", display: "block",
}

function UpdateModal(props) {

  const { item } = props;
  const [localItem, setLocalItem] = useState({ ...item });

  useEffect(() => {
    const { id } = item.id;
    axios.post('/get/worlds/details', { worldId: id }).then((response) => {
      console.log(response)
    })
  }, [])


  const onChange = (prop, e) => {
    if (prop === "name") {
      localItem.name = e.target.value;
    }
    localItem.data = JSON.stringify(localItem.data)
    setLocalItem({ ...localItem });
  }
  const onSend = () => {
    props.onSend && props.onSend();
    axios.post('/update/worlds/data', { worldId: localItem.id, data: localItem }).then((response) => {
      console.log(response.data)
    })
  };
  const onDuplicate = () => {
    axios.post('/update/worlds/duplicate', { worldId: localItem.id }).then((response) => {
      console.log(response.data);
    })
  };
  const onGetWorldData = () => {
    axios.post('/get/worlds/getWorldData', { worldId: localItem.id }).then((response) => {
      console.log(response.data);
    })
  };

  const onNewWorld = () => {
    axios.post('/post/worlds/newWorld', { worldId: localItem.id }).then((response) => {
      console.log(response.data);
    })
  };
  const onCancel = () => {
    props.onCancel && props.onCancel()
  }


  return (

    <div className="modal" tabIndex="-1" role="dialog" style={modalStyle}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit world</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>{localItem.id}</p>
            <input type="text" className="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value={localItem.name} onChange={(e) => { onChange("name", e) }} />
            <div>{localItem.created}</div>
            <div>{localItem.updated}</div>
            <div>{localItem.description}</div>
            <div>{localItem.id}</div>
            <div>{localItem.publicAvailable}</div>
            <div>{localItem.previewBackgroundImagePath}</div>
          </div>
          <div className="modal-footer">
            <button type="button" onClick={onSend} className="btn btn-primary">Save changes</button>
            <button type="button" onClick={onCancel} className="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
      <button type="button" onClick={onDuplicate} className="btn btn-secondary" data-dismiss="modal">Duplicate</button>
      <button type="button" onClick={onGetWorldData} className="btn btn-secondary" data-dismiss="modal">getWorldData</button>
      <button type="button" onClick={onNewWorld} className="btn btn-secondary" data-dismiss="modal">create new world</button>
    </div>
  );
}

export default UpdateModal;
