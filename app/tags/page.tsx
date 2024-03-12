
import {TAGS} from '@/_libs/server'
export default function App() {
  return (
    <div>
      {TAGS.map((tag) => {
        const encode_url = encodeURIComponent(tag.tag);
        return (
          <div key={tag.tag}>
            <a href={`./tags/${encode_url}`}>{tag.tag}</a>
          </div>
        );
      })}

    </div>
  );
}
