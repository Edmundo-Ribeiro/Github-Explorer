import React, { useState, FormEvent, useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Title, Form, Repositories, Error } from './styles';
import logo from '../../assets/logo.svg';
import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setnewRepo] = useState('');
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const stgrep = localStorage.getItem('@GithubExplorer:Repositories');

    if (stgrep) {
      return JSON.parse(stgrep);
    }
    return [];
  });
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    localStorage.setItem(
      '@GithubExplorer:Repositories',
      JSON.stringify(repositories),
    );
  }, [repositories]);

  async function handleAddRepository(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    if (!newRepo) {
      setInputError('Digite o autor/nome do repositório');
      return;
    }

    try {
      const { data } = await api.get<Repository>(`repos/${newRepo}`);
      setnewRepo('');
      setInputError('');
      setRepositories([...repositories, data]);
    } catch (err) {
      setInputError('Erro, o repositório não foi encontrado');
    }
  }

  return (
    <>
      <img src={logo} alt="Githib Explorer" />
      <Title>Explore repositorios no Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          placeholder="Procure aqui o nome do repositório"
          value={newRepo}
          onChange={e => setnewRepo(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map(repository => (
          <Link
            key={repository.full_name}
            to={`/repositories/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />

            <div>
              <strong>{repository.owner.login}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};
export default Dashboard;
