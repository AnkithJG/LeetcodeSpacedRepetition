import { useEffect, useState } from "react";

export default function Dashboard({ token }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/reviews", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setReviews(data.reviews_due || []));
  }, [token]);

  return (
    <div>
      <h2>Your Reviews Today</h2>
      <ul>
        {reviews.map((p) => (
          <li key={p.title}>
            {p.title} — {p.difficulty}
          </li>
        ))}
      </ul>
    </div>
  );
}
