// import getproviders
// import { getServerSideProps } from '..'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { db } from '../../firebase'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
// import routeur
import { useRouter } from 'next/router'


export default function Signin() {
  const router = useRouter();


  const onGoogleClick = async () => {
    try {

      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider)
      const user = auth.currentUser.providerData[0];
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(docRef, {
          email: user.email,
          username: user.displayName.split(" ").join("").toLocaleLowerCase(),
          name: user.displayName,
          userImg: user.photoURL,
          uid: user.uid,
          createdAt: serverTimestamp(),
        })
      }
      router.push("/");
      // console.log(user);
    }
    catch (error) {
      console.log(error);
      }

  }


  return (
    <div className="flex justify-center mt-20 space-x-4">
      <img
        src="https://www.techbooky.com/wp-content/uploads/2021/07/4859E08D-388B-4475-9FCC-C05914CC654A.png"
        alt="twitter image"
        className=" hidden object-cover md:w-44 h-80 rotate-6 md:inline-flex"
      />
      <div className=" ">

        <div className="flex flex-col items-center">
          <img
            src="https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"
            alt="twitter logo"
            className="w-36 object-cover"
          />
          <p className="text-center text-sm italic my-10 ">
            this app is created for learning purposes
          </p>
          <button onClick={onGoogleClick} className='bg-red-400 rounded-lg p-3 text-white hover:bg-red-500'>Sign in GOOGLE</button>
        </div>

      </div>
    </div>
  );
}


