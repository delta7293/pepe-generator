import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        height: '100dvh',
        justifyContent: 'center',
        marginBottom: '100px',
      }}
    >
      <h2>Are you lost?</h2>
      <p>
        Go back <Link href="/">home</Link>.
      </p>
    </div>
  );
}
