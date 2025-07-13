import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">📚 Усі пости</h1>

      {posts.length === 0 ? (
        <p className="text-center">Поки що немає постів 😢</p>
      ) : (
        posts.map((post) => (
          <div
            key={post.id}
            className="border border-gray-300 rounded p-4 mb-4 shadow"
          >
            <Link
              href={`/post/${post.id}`}
              className="text-xl font-semibold text-blue-600 hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-gray-700 mt-2">
              {post.content.length > 150
                ? post.content.slice(0, 150) + "..."
                : post.content}
            </p>
          </div>
        ))
      )}
    </main>
  );
}
