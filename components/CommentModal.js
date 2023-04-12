import React, { useEffect, useState } from 'react'
import { Snapshot, useRecoilState } from 'recoil';
import { modalState, postIdState } from '../atom/modalAtom';
import Modal from 'react-modal'
import { XMarkIcon } from '@heroicons/react/24/outline';
import { db } from '../firebase';
import { addDoc, collection, doc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import Moment from 'react-moment';
import { useRouter } from 'next/router';
import { userState } from '@/atom/userAtom';




export default function CommentModal() {
    const [open, setOpen] = useRecoilState(modalState);
    const [postId] = useRecoilState(postIdState);
    const [post, setPost] = useState({});
    const [input, setinput] = useState("");
    const [currentUser] = useRecoilState(userState);

    const router = useRouter();


    useEffect(() => {
        onSnapshot(doc(db, "posts", postId), (Snapshot) => { setPost(Snapshot) })
    }, { postId, db })

    async function sendComment() {
      await addDoc(collection(db, "posts", postId, "comments"), {
        comment: input,
        name: currentUser.name,
        userImg: currentUser.userImg,
        userName: currentUser.username,
        timestamp: serverTimestamp(),
        userId: currentUser.uid,
      });
      setOpen(false);
      setinput("");
      router.push(`/posts/${postId}`);
    }


    return (
      <div>
        {open && (
          <Modal
            isOpen={open}
            onRequestClose={() => setOpen(false)}
            className="max-w-lg w-[90%]  absolute top-24 translate-x-[-50%] left-[50%] bg-white border-2  border-gray-300 rounded-xl shadow-md "
          >
            <div className="p-1">
              <div className="border-b border-gray-200 py-2 px-1.5">
                <div className="hoverEffect w-9 h-9 flex items-center justify-center ">
                  <XMarkIcon
                    onClick={() => setOpen(false)}
                    className="h-[23px] text-gray-700"
                  />
                </div>
              </div>
              <div className="p-2 flex items-center space-x-1 relative ">
                <span className="w-0.5 h-full z-[-1] absolute left-8 top-11 bg-gray-300" />
                <img
                  className="h-11 w-11 rounded-full object-cover mr-4 "
                  src={post?.data()?.image}
                  alt="user image"
                />
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                  {post?.data()?.name}
                </h4>
                <span className="text-sm sm:text-[15px]">
                  @{post?.data()?.userName} -{" "}
                </span>
                <span className="text-sm sm:text-[15px] hover:underline">
                  <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
                </span>
                <p
                  className="text-gray-500 text-[18px] sm:text-[17px] absolute top-12
                         right-13 left-12 mb-2"
                >
                  {post?.data()?.text}
                </p>
              </div>

              <div className="flex  p-3 space-x-3">
                <img
                  src={currentUser?.userImg}
                  alt=""
                  className="rounded-full h-11 w-11 cursor-pointer hover:brightness-95"
                />
                <div className="w-full divide-y divide-gray-200">
                  <div className="">
                    <textarea
                      className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px]  text-gray-700"
                      rows="2"
                      placeholder="Tweet you reply"
                      value={input}
                      onChange={(e) => setinput(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex items-center justify-between pt-2.5">
                    <div className="flex">
                      <div
                        className=""
                        // onClick={() => filePickerRef.current.click()}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-10 h-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100"
                        >
                          <path
                            fillRule="evenodd"
                            d="M1 8a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 018.07 3h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V8zm13.5 3a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM10 14a3 3 0 100-6 3 3 0 000 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {/* <input
                                                type="file"
                                                hidden
                                                ref={filePickerRef}
                                                onChange={addImageToPost}
                                            /> */}
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-10 h-10 hoverEffect p-2 text-sky-500 hover:bg-sky-100"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                        />
                      </svg>
                    </div>
                    <button
                      onClick={sendComment}
                      disabled={!input.trim()}
                      className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
}
