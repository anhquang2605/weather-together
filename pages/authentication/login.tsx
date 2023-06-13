export default function Login() {
    return (
        <>
            <h1>Login</h1>
            <form className="bg-white md:container md:mx-auto mx-auto shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">Username</label>
                <input type="text" className="rounded text-pink-500 p-4" placeholder="username" />
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password" >Password</label>
                <input type="password" className="rounded text-pink-500 p-4" placeholder="password" />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Log in</button>
            </form>
        </>
    )
}