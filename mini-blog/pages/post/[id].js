import { useRouter } from "next/router";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function PostPage() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchPost = async () => {
      const docRef = doc(db, "posts", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPost({ id: docSnap.id, ...docSnap.data() });
      } else {
        setPost(false);
      }
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Ти впевнений, що хочеш видалити цей пост?")) return;
    try {
      await deleteDoc(doc(db, "posts", id));
      alert("Пост видалено");
      router.push("/");
    } catch (err) {
      alert("Помилка при видаленні: " + err.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Завантаження...</p>;
  if (post === false)
    return <p className="text-center mt-10">Пост не знайдено</p>;

  const isAuthor = currentUser && currentUser.uid === post.authorId;

  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <p className="text-gray-800 whitespace-pre-line mb-6">{post.content}</p>

      {isAuthor && (
        <div className="flex gap-4">
          <Link
            href={`/edit-post/${post.id}`}
            className="bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500"
          >
            Редагувати
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Видалити
          </button>
        </div>
      )}
    </main>
  );
}
