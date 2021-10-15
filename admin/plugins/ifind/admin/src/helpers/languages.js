import React, { useState, useEffect } from 'react';
import { useQuery } from './query';

const languagesQuery = `
query GetLanguagesQuery {
  languages {
    id
    code
    name
  }
}
`

export const useLanguages = () => {
  const { data = {}, loading, error } = useQuery(languagesQuery);
  return data;
};