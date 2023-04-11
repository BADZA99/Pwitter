import React, { useRef, useState } from 'react' 
import { useSession,signOut } from 'next-auth/react'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '@/firebase';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { XMarkIcon } from '@heroicons/react/24/solid';

export default function Input() {
  const { data: session } = useSession();
  const [input,setInput ] = useState("");
  const [selectedFile,setSelectedFile ] = useState(null);
  const [loading,setLoading ] = useState(false);
  // console.log(session);

  const filePickerRef = useRef(null);

  const sendPost = async ()=>{
    if(loading) return;
    setLoading(true);
    const docRef = await addDoc(collection(db,"posts"),{
      id:session.user.uid,
      text: input,
      userImg: session.user.image,
      userName: session.user.username,
      timestamp: serverTimestamp(),
      name:session.user.username,
    });

    const imageref=ref(storage,`posts/${docRef.id}/image`);

    if(selectedFile){
      await uploadString(imageref,selectedFile,"data_url").then(async()=>{
        const downloadUrl = await getDownloadURL(imageref,selectedFile);
        await updateDoc(doc(db,"posts",docRef.id),{
          image:downloadUrl,
        })
    })

    }
    setInput("");
    setSelectedFile(null);
    setLoading(false);
  }

  const addImageToPost =(e)=>{
    const reader = new FileReader();
    if(e.target.files[0]){
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent)=>{
      setSelectedFile(readerEvent.target.result);
    }

  }
  
  return (
    <>
      {session && (
        <div className="flex border-b border-gray-200 p-3 space-x-3">
          <img
            onClick={signOut}
            src={session.user.image}
            alt=""
            className="rounded-full h-11 w-11 cursor-pointer hover:brightness-95"
          />
          <div className="w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="w-full border-none focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px]  text-gray-700"
                rows="2"
                placeholder="What's happening"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>

            {selectedFile && (
              <div className="relative">
                <XMarkIcon
                  className=" border h-7 text-black absolute cursor-pointer shadow-md border-white m-1 rounded-full"
                  onClick={() => setSelectedFile(null)}
                />
                <img
                  src={selectedFile}
                  className={`${loading && "animate-pulse"}`}
                />
              </div>
            )}
            <div className="flex items-center justify-between pt-2.5">
              {!loading && (
                <>
                  <div className="flex">
                    <div
                      className=""
                      onClick={() => filePickerRef.current.click()}
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
                      <input
                        type="file"
                        hidden
                        ref={filePickerRef}
                        onChange={addImageToPost}
                      />
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
                    onClick={sendPost}
                    disabled={!input.trim()}
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                  >
                    Tweet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
