import { format } from 'date-fns';
import ptBr from 'date-fns/locale/pt-BR';

import { FiCalendar, FiUser } from 'react-icons/fi';

interface PostInfoProps {
  publicationDate: string,
  author: string
}

export function PostInfo({ publicationDate, author }: PostInfoProps) {
  return (
    <>
      <div>
        <FiCalendar color='#BBBBBB' />
        <time>
          {format(new Date(publicationDate), 'dd MMM yyyy', {
            locale: ptBr
          })}
        </time>
      </div>

      <div>
        <FiUser color='#BBBBBB' />
        <span>{author}</span>
      </div>
    </>
  );
}