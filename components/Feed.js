import { sparkLes } from "@heroicons/react/24/solid";
import Input from "./Input";
import Post from "./Post";
import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { AnimatePresence,motion } from "framer-motion";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    []
  );

  //  dummy data
  // const posts = [
  //   {
  //     id: "1",
  //     name: "Elon Musk",
  //     username: "elongoat ",
  //     userImg:
  //       "https://media.lesechos.com/api/v1/images/view/63898cb2160db4077a075737/1280x720/0702924180480-web-tete.jpg",
  //     img: "https://images.unsplash.com/photo-1617704548623-340376564e68?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZWxvbiUyMG11c2t8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
  //     text: "I am the king of the world",
  //     timestamp: "2 hours ago",
  //   },
  //   {
  //     id: "2",
  //     name: "Jef besos",
  //     username: "jeftheboss",
  //     userImg:
  //       "https://images.omerlocdn.com/resize?url=https%3A%2F%2Fgcm.omerlocdn.com%2Fproduction%2Fglobal%2Ffiles%2Fimage%2Ff7956ccc-fcb0-444a-bc37-0e0097ef3bc1.JPG&width=1024&type=jpeg&stripmeta=true",
  //     img: "https://images.omerlocdn.com/resize?url=https%3A%2F%2Fgcm.omerlocdn.com%2Fproduction%2Fglobal%2Ffiles%2Fimage%2Ff7956ccc-fcb0-444a-bc37-0e0097ef3bc1.JPG&width=1024&type=jpeg&stripmeta=true",
  //     text: "I don't think so",
  //     timestamp: "1 hours ago",
  //   },
  // ];
  return (
    <div className="xl:ml-[370px] border-2 border-r xl:min-w[576px] border-gray-200 sm:ml-[73px] flex-grow max-w-xl">
      <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        <div className="hoverEffect flex items-center justify-center px-0 ml-auto w-9 h-9">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="gray"
            className="w-5 h-5"
          >
            <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.962l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.962 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.962l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 2.051a1 1 0 01-.633.633l-2.051.683a1 1 0 000 1.898l2.051.684a1 1 0 01.633.632l.683 2.051a1 1 0 001.898 0l.683-2.051a1 1 0 01.633-.633l2.051-.683a1 1 0 000-1.898l-2.051-.683a1 1 0 01-.633-.633L6.95 5.684zM13.949 13.684a1 1 0 00-1.898 0l-.184.551a1 1 0 01-.632.633l-.551.183a1 1 0 000 1.898l.551.183a1 1 0 01.633.633l.183.551a1 1 0 001.898 0l.184-.551a1 1 0 01.632-.633l.551-.183a1 1 0 000-1.898l-.551-.184a1 1 0 01-.633-.632l-.183-.551z" />
          </svg>
        </div>
      </div>
      <Input />
      <AnimatePresence>

        {posts.map((post) => (

          <motion.div key={post.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration: 1}}>

            <Post
              key={post.id} post={post}
            />
          </motion.div>
        ))}
      </AnimatePresence>

    </div>
  );
}
