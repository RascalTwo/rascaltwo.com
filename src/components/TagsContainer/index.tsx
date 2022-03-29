import Link from 'next/link';
import styles from './TagsContainer.module.css';

export default function TagsContainer({ tags, absolute=true }: { tags: string[], absolute?: boolean }) {
  if (!tags.length) return null;

	return (
    <ul className={styles.container} style={{ position: absolute ? 'absolute' : 'static' }}>
      {tags.map(tag => (
        <li key={tag}>
          <Link href={`/blog?tag=${tag}`}><a rel="tag">{tag}</a></Link>
        </li>
      ))}
    </ul>
  );
}
