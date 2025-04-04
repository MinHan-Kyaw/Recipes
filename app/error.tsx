"use client";

export default function error({ error }: { error: Error }) {
  console.error("Error occurred:", error);
  return (
    <main className="error">
      <h1>An error occurred!</h1>
      <p>{error.message}</p>
    </main>
  );
}
