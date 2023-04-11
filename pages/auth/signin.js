import { signIn, signOut, useSession,getProviders } from 'next-auth/react'
// import getproviders
// import { getServerSideProps } from '..'

export default function signin({providers}) {
  return (
    <div className="flex justify-center mt-20 space-x-4">
      <img
        src="https://www.techbooky.com/wp-content/uploads/2021/07/4859E08D-388B-4475-9FCC-C05914CC654A.png"
        alt="twitter image"
        className=" hidden object-cover md:w-44 h-80 rotate-6 md:inline-flex"
      />
      <div className=" ">
        {Object.values(providers).map((provider) => (
          <div className="flex flex-col items-center">
            <img
              src="https://www.freepnglogos.com/uploads/twitter-logo-png/twitter-logo-vector-png-clipart-1.png"
              alt="twitter logo"
              className="w-36 object-cover"
            />
            <p className="text-center text-sm italic my-10 ">
              this app is created for learning purposes
            </p>
            <button   onClick={()=>signIn(provider.id,{callbackUrl:"/"})}  className='bg-red-400 rounded-lg p-3 text-white hover:bg-red-500'>Sign in with {provider.name}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function getServerSideProps(){
    const providers = await getProviders();
    return {
        props:{
            providers,
        },
    };
}
