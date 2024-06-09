// src/queries.js
import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query Books {
    books {
      author
      coverPhotoURL
      readingLevel
      title
    }
  }
`;
