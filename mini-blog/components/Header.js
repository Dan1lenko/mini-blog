import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-bold text-lg">
          MiniBlog
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/create-post">
                Новий пост
              </Link>
              <button
                onClick={() => auth.signOut()}
                className="underline hover:text-red-400"
              >
                Вийти
              </button>
            </>
          ) : (
            <Link href="/login">
              Увійти
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
