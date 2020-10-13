import React, { useState, useEffect } from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import {db} from '../firebase'
import firebase from 'firebase'

function Post({postId,user,  username, imageURL, caption}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if(postId) {
            unsubscribe=db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc)=> doc.data()));
                })
        }
        return () => {
            unsubscribe();
        }
    }, [postId])

    const postComment = (event) => {
        event.preventDefault();
        db.collection('posts').doc(postId).collection('comments').add({
            comments: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment('');
    }

    return (
        <div className='post'>
            <div className="post__header">
                <Avatar 
                    className='post__avatar'
                    src='http://www.newsshare.in/wp-content/uploads/2017/04/Miniclip-8-Ball-Pool-Avatar-11.png'
                    alt='user'
                />
                <h3>{username}</h3>
            </div>
            {/* header -> image * username */}
            {/* image */}
            <img className='post__image' src={imageURL} alt='post' />
            {/* username * caption */}
            <h4 className='post__text'><strong>{username}</strong>  {caption}</h4>

            <div className="post__comments">
            { 
                comments.map((comment) => (
                <p><strong>{comment.username}</strong>{comment.comment}</p>
                ))
            }
            </div>
            <form action="" className='post__commentBox'>
                <input type="text" className="post__input" placeholder='comments here' value={comments} onChange={(e) => setComments(e.target.value)}/>
                <button disabled={!comment} className='post__button' type='submit' onClick={postComment}>Post!</button>
            </form>
        </div>
    )
}

export default Post
