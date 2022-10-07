import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import UpdateModal from './UpdateModal';

function WorldsList() {

	const [worlds, setworlds] = useState([]);
	const [modal, setModal] = useState({ visible: false, selectedItem: null });

	useEffect(() => {
		axios.get('/get/worlds/list').then((response) => {
			setworlds(response.data)
		})
		return () => {
		};
	}, []);

	const onOpenModalAndSelectItem = (item) => {
		setModal({
			visible: true,
			selectedItem: item,
		})
	}

	const onSend = (item) => {

	}

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
								<td><button type="button" onClick={(e) => { onOpenModalAndSelectItem(item) }} className="btn btn-primary">Edit</button></td>
							</tr>)
						})}
					</tbody>
				</table>
				{modal.visible && <UpdateModal onCancel={() => { setModal({ visible: false, selectedItem: null }) }} item={modal.selectedItem} />}
			</div>
		</div>
	);
}

export default WorldsList;
