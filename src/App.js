import React, {useState, useEffect} from 'react';
import './App.css';
import Logo from './assets/instagram-logo.png';
import Post from './Components/Post';
import {db, auth, storage} from './firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './Components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));



function App() {
const classes = useStyles(); 
const [modalStyle] = useState(getModalStyle);

const [posts, setPosts] = useState([])
const [open, setOpen] = useState(false)
const [openSignIn, setOpenSignIn] = useState('')
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [email, setEmail] = useState('')
const [user, setUser] = useState(null)

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((authUser) => {
    if(authUser){
      console.log(authUser)
      setUser(authUser)

      if(authUser.displayName){
          //dont update displayname
      }
      else{
        return authUser.updateProfile({
          displaName: username,
        });
      }
    }
    else{
      setUser(null)
    }
  })
    return () => {
      //perform clean up
      unsubscribe();
    }
}, [user, username])
useEffect(() => {
  db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot => {
    setPosts(snapshot.docs.map(doc => ({
      id: doc.id,
      post: doc.data()
    })))
  })
},[]);

const SignUp = (event) =>{
  event.preventDefault();
  auth.createUserWithEmailAndPassword(email, password)
  .then((authUser ) => {
    authUser.user.updateProfile({
      displayName: username
    })
  })
  .catch((error) => alert(error.message))
}
const SignIn = (event) => {
  event.preventDefault();
  auth.signInWithEmailAndPassword(email, password)
  // .then((authUser ) => {
  //   authUser.user.updateProfile({
  //     imageURL: imageURL
  //   })
  // })
  .catch((error)=>alert(error.message))
  setOpenSignIn(false)
}
  return (
    <div className="App">

      {/* uploading stuff */}
      {user?.displayName ? (
        // if condition = True
        <ImageUpload username={user.displayName} />
      ):(
        //  If condition = False
        <h3>Sorry You need to Authenticate for uploading</h3>
        )
      }
       <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
          <center>
            <img className='app__headerImage' src= {Logo} alt=''/>
          </center>
             <Input type='text' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={SignIn}>SignIn</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={open}
        onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className='app__signup'>
          <center>
            <img className='app__headerImage' src= {Logo} alt=''/>
          </center>
            <Input type='text' placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input type='text' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button onClick={SignUp}>SignUp</Button>
          </form>
        </div>
      </Modal>

      {/* Header */}
      <div className='app__header'>
        <img
          className="app__headerImage"
          src={Logo}
          alt=""
          />
      {
        user ? (
          <div className="app__login">
            {/* <img className='displayPicture' src={user.imageURL} alt='post' /> */}
            <Button onClick={()=> auth.signOut()}>LogOut</Button>
          </div>
            
            ) : (
            <div className="app__loginContainer">
            <Button onClick={()=> setOpenSignIn(true)}>SignIn</Button>
            <Button onClick={()=> setOpen(true)}>SignUP</Button>
          </div>
          )
      }
        </div>
      {/* <Button onClick={() => setOpen(true)} SignIn></Button> */}
      {/*  Posts */}
      <div className="app__posts">
        <div className="posts__left">
        {
          posts.map(({id, post} )=> (
            <Post
              key= {id}
              postId={id}
              user={user}
              username= {post.username} 
              caption={post.caption} 
              imageURL={post.imageURL}/>
          ))
        }
        </div>
        <div className="posts__right">
          <InstagramEmbed
                url='https://www.instagram.com/p/CFj-cD_IHlf'
                maxWidth={320}
                hideCaption={false}
                containerTagName='div'
                protocol=''
                injectScript
                onLoading={() => {}}
                onSuccess={() => {}}
                onAfterRender={() => {}}
                onFailure={() => {}}
              />
        </div>
       
      </div>
      
    </div>
  );
}

export default App;
