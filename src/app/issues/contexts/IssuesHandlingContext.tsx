import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { Issue } from '../model/issue';
import {
  add,
  fetchIssues,
  remove,
  storeIssues,
  update,
  useIssues,
} from '../slice';
import { useAppDispatch } from '../../redux/hooks';

type IssueUpdate = Partial<Issue> & Pick<Issue, 'id'>;
type IssuesHandlingContextType = {
  issues: Issue[];
  addIssue: () => void;
  deleteIssue: (id: Issue['id']) => void;
  updateIssue: (update: IssueUpdate) => void;
  saveIssues: () => void;
};

// const IssuesHandlingContext = createContext<
//   IssuesHandlingContextType | undefined
// >(undefined);

const throwContextError = () => {
  throw new Error('IssuesHandlingContext is not availabe in the parent tree');
};
const IssuesHandlingContext = createContext<IssuesHandlingContextType>({
  issues: [],
  addIssue: throwContextError,
  deleteIssue: throwContextError,
  updateIssue: throwContextError,
  saveIssues: throwContextError,
});

export const IssuesHandlingContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchIssues());
  }, [dispatch]);

  const issues = useIssues();
  //   const [issues, setIssues] = useState(reduxIssues);

  const deleteIssue = useCallback(
    (id: Issue['id']) => {
      console.log('Delete issue with id:', id);
      // setIssues((prev) => prev.filter((issue) => issue.id !== id));
      dispatch(remove(id));
    },
    [dispatch]
  );

  const addIssue = useCallback(() => {
    dispatch(add());
    // setIssues((prev) => [...prev, issueFactory()]);
    // setIssues([...issues, issueFactory()]);
    // }, [issues]);
  }, [dispatch]);

  const updateIssue = useCallback(
    (issueUdpate: IssueUpdate) => {
      dispatch(update(issueUdpate));
    },
    [dispatch]
  );

  const saveIssues = useCallback(() => {
    dispatch(storeIssues());
  }, [dispatch]);

  const contextValue: IssuesHandlingContextType = useMemo(
    () => ({
      issues,
      addIssue,
      deleteIssue,
      updateIssue,
      saveIssues,
    }),
    [issues, addIssue, deleteIssue, updateIssue, saveIssues]
  );

  return (
    <IssuesHandlingContext.Provider value={contextValue}>
      {children}
    </IssuesHandlingContext.Provider>
  );
};

export const useIssuesHandling = () => useContext(IssuesHandlingContext);
