import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";

const UsersList = () => {
  // Call the `useGetUsersQuery` hook to fetch the list of users
  const {
    data: users, // `data` contains the response data
    isLoading, // `isLoading` is true while the query is in progress
    isSuccess, // `isSuccess` is true if the query succeeds
    isError, // `isError` is true if the query fails
    error, // `error` contains the error object if the query fails
  } = useGetUsersQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let content;

  // If the query is still loading, show a loading message
  if (isLoading) content = <p>Loading...</p>;

  // If the query fails, show an error message
  if (isError) content = <p className="errmsg">{error?.data?.message}</p>;

  // If the query succeeds, render the table of users
  if (isSuccess) {
    const { ids } = users;

    // If there are no users, show an empty table
    // Otherwise, map over the list of user IDs and render a <User> component for each one
    const tableContent = ids?.length
      ? ids.map((userId) => <User key={userId} userId={userId} />)
      : null;

    // Render the table of users
    content = (
      <table className="table table--users">
        <thead className="table__thead">
          <tr>
            <th scope="col" className="table__th user__username">
              Username
            </th>
            <th scope="col" className="table__th user__roles">
              Roles
            </th>
            <th scope="col" className="table__th user__edit">
              Edit
            </th>
          </tr>
        </thead>
        <tbody>{tableContent}</tbody>
      </table>
    );
  }

  // Return the content to be rendered
  return content;
};

export default UsersList;
