import Comment from "@/components/Comment";
import CommentModal from "@/components/CommentModal";
import Feed from "@/components/Feed";
import Post from "@/components/Post";
import Sidebar from "@/components/Sidebar";
import Widgets from "@/components/Widgets";
import { db } from "@/firebase";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
} from "firebase/firestore";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Snapshot } from "recoil";

export default function post({ newResults, randomUserResults }) {
    const router = useRouter();
    const { id } = router.query;
    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);

    // get post data
    useEffect(
        () => onSnapshot(doc(db, "posts", id), (snapchot) => setPost(snapchot)),
        [db, id]
    );

    // get comments of the post with query
    useEffect(() => {
        onSnapshot(
            query(
                collection(db, "posts", id, "comments"),
                orderBy("timestamp", "desc")
            ),
            (snapshot) => setComments(snapshot.docs)
        );
    }, [db, id]);
    return (
        <div>
            <Head>
                <title>post page</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex min-h-screen mx-auto">
                {/* sidebar */}

                <Sidebar />

                {/* feed */}

                {/* <Feed /> */}

                <div className="xl:ml-[370px] border-2 border-r xl:min-w[576px] border-gray-200 sm:ml-[73px] flex-grow max-w-xl">
                    <div className="flex  items-center space-x-2 py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
                        <div className="hoverEffect " onClick={() => router.push("/")}>
                            <ArrowLeftIcon className="h-5 " />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">
                            Tweet
                        </h2>
                    </div>
                    <Post id={id} post={post} />

                    {comments.length > 0 && (
                        <div>
                            {comments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    id={comment.id}
                                    comment={comment.data()}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* widgets */}

                <Widgets
                    newResults={newResults.articles}
                    randomUserResults={randomUserResults.results}
                />

                {/* modals */}

                <CommentModal />
            </main>
        </div>
    );
}

// https://saurav.tech/NewsAPI/top-headlines/category/business/Us.json

export async function getServerSideProps() {
    const newResults = await fetch(
        "https://saurav.tech/NewsAPI/top-headlines/category/business/us.json"
    ).then((res) => res.json());

    // who to follow section
    const randomUserResults = await fetch(
        "https://randomuser.me/api/?results=30&inc=name,login,picture"
    ).then((res) => res.json());
    return {
        props: {
            newResults,
            randomUserResults,
        },
    };
}
