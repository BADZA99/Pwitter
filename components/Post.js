import React, { useEffect, useState } from 'react'
import { ChatIcon, } from '@heroicons/react/outline';
import Moment from 'react-moment';
import { addDoc, collection, deleteDoc, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase';
import { signIn } from 'next-auth/react';
import { deleteObject, ref } from 'firebase/storage';
import { useRecoilState } from 'recoil';
import { modalState, postIdState } from '@/atom/modalAtom';
import { useRouter } from 'next/router';
import { userState } from '@/atom/userAtom';

export default function Post({ post,id }) {
  const [likes, setlikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasLiked, setHasLiked] = useState(false);
  const [open,setOpen]=useRecoilState(modalState);
  const [postId,setPostId]=useRecoilState(postIdState);

  const [currentUser] = useRecoilState(userState);
  const router=useRouter();

  useEffect(() => {
    const unsubcribe = onSnapshot(
      collection(db, "posts", id, "likes"), (snapshot) => setlikes(snapshot.docs)
    )

  }, [db]);

  useEffect(() => {
    setHasLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1)

  }, [likes]);

  useEffect(() => {
    const unsubcribe = onSnapshot(
      collection(db, "posts", id, "comments"), (snapshot) => setComments(snapshot.docs)
    )
  }, [db]);





  async function likePost() {
    if(currentUser){
      if (hasLiked) {
        // remove like
        await deleteDoc(doc(db,"posts",id,"likes",currentUser?.uid));
      }else{
        // add like
        await setDoc(doc(db, "posts", id, "likes", currentUser?.uid), {
          username: currentUser?.username,
        })
      }
    }else{
      // signIn();
      router.push("/auth/signin")
    }
  }


  async function deletePost(){
     if(window.confirm('are you sure you want to delete this post')){

      await deleteDoc(doc(db,"posts",id));
      if(post.data().image){

        deleteObject(ref(storage,`posts/${id}/image`));
      }

      router.push("/");

     }

  }

  


  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200">
      {/* user image */}

      <img
        className="h-11 w-11 rounded-full object-cover mr-4 "
        src={currentUser?.userImg}
        alt="user image"
      />

      {/* right side */}
      <div className='flex-1'>
        {/* header */}
        <div className="flex items-center justify-between">
          {/* post user info */}

          <div className="flex  items-center space-x-1 whitespace-nowrap ">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
              {post?.data()?.name}
            </h4>
            <span className="text-sm sm:text-[15px]">
              @{post?.data()?.userName} -{" "}
            </span>
            <span className="text-sm sm:text-[15px] hover:underline">
              <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
            </span>
          </div>

          {/* dot icon */}

          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 hoverEffect hover:bg-sky-100 hover:text-sky-500 p-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </div>
        {/* post text */}
        <p  onClick={()=>router.push(`/posts/${id}`)} className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
          {post?.data()?.text}
        </p>

        {/*post  image */}
        <img    onClick={()=>router.push(`/posts/${id}`)} className="rounded-2xl mr-2" src={post?.data()?.image} alt="" />

        {/* icons */}

        <div className="flex justify-between text-gray-500 p-2">
          {/*icone chat */}
          <div className='flex items-center select-none'>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="  w-10 h-10  hoverEffect pt-2 hover:text-sky-500  hover:bg-sky-100 "

            onClick={()=> {

              if(!currentUser){
                // signIn();
                router.push("/auth/signin");
              }else{
                
                setPostId(id);
                setOpen(!open);
              }
             
            } }
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>

          {comments.length>0 && (
            <span className='text-sm'>{comments.length}</span>
          )}

          </div>
          {/*icone boubelle */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`  ${currentUser?.uid === post?.data()?.id ? "display" :"hidden"} w-10 h-10 hoverEffect pt-2 hover:text-red-500  hover:bg-red-100`}
            onClick={() => deletePost()}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
            />
          </svg>
          
          {/*icone like */}
          <div className='flex items-center'>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill={...hasLiked ? "red" : "none" }  
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10  hoverEffect pt-2 hover:text-red-500  hover:text-bg-100"
              onClick={likePost}
              >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
            {likes.length > 0 && <span className={`${hasLiked && "text-red-600 "} text-sm pb-1 select-none`}>{likes.length}</span>}

          </div>
          
        


          {/* icone partage */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10  hoverEffect pt-2 hover:text-sky-500  hover:bg-sky-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
          {/* icone chart */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10  hoverEffect pt-2 hover:text-sky-500  hover:bg-sky-100"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
