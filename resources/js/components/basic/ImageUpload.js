import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import ButtonSecondary from './Buttons/ButtonSecondary';


export const StyledImageWrapper = styled.div`
text-align:center;
background:#ebebea;
overflow:hidden;
max-height:200px;
img{
  width:100%
}
`

export default function ImageUpload(props) {
  const { onImageUpload } = props;
  const [selectedImage, setSelectedImage] = useState(null);

  const onUploadImage = (event) => {
    const data = new FormData()
    data.append('image', selectedImage)
    axios.post('/store-image', data).then((response) => {
    })
    event.preventDefault();
  };

  const onCustomUpload = (event, file) => {
    event.preventDefault();
    const data = new FormData()
    data.append('image', file)
    axios.post('/store-image', data).then((response) => {
      console.log(response.data);
      console.log(file);
      onImageUpload && onImageUpload(response.data);
    })
  };

  function onImageChange(event) {
    onCustomUpload(event, event.target.files[0]);
  }

  return (
    <>
      <form onSubmit={onUploadImage}>
        <div className="image">
          {selectedImage && (
            <StyledImageWrapper>
              <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} />
              <br />
              {/* <button onClick={() => setSelectedImage(null)}>Remove</button> */}
            </StyledImageWrapper>
          )}
          <input type="file" className="form-control" required name="image"
            onChange={(event) => {
              console.log(event)
              console.log(event.target.files[0]);
              setSelectedImage(event.target.files[0]);
              onImageChange(event)
            }} />
        </div>
        {/* <ButtonSecondary title="Upload Image"></ButtonSecondary> */}
      </form>
    </>
  )
}