import React, {useState} from 'react'
import {Button} from '@material-ui/core'
import {storage, db} from '../firebase'
import firebase from 'firebase'
import './ImageUpload.css'

function ImageUpload({username}) {
    const [image, setImage] = useState(null)
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState('')

    const handleChange = (event) => {
        if(event.target.files[0]){
            setImage(event.target.files[0])
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on("state_changed",(snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progress);
            console.log('progress')
        },
        (error) => {
            console.log(error);
        },
        () => {
            storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageURL: url,
                        username: username
                    })
                    setProgress(0);
                    setCaption('');
                    setImage(null)
                })
        }
        )
    }
    return (
        <div className='imageUpload'>
            {/*  */}
            <progress className='imageUpload__progress' value={progress} max="100"/>
            <input type="text" placeholder='Enter Caption..' onChange={event => setCaption(event.target.value)} value={caption }/>
            <input type="file" onChange={handleChange}/>
            <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
