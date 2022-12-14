'use client';
import Link from 'next/link';

export default function Footer() {

  return (
    <footer className='footer'>
      <Link href="/">
        Powered by{' '}
        <span className='logo'>
          Bull Bitcoin
        </span>
      </Link>
    </footer>
  );
}
